// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THR, resetGroups , THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */
/* globals */
// jshint esversion: 6
// jshint loopfunc: true

// https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data
// https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data/United_States_medical_cases_by_state

const WP = {};

//WP.cors = location.protocol === "https:" ? "" : "https://cors-anywhere.herokuapp.com/";
WP.cors = "https://cors-anywhere.herokuapp.com/";

WP.api = "https://en.wikipedia.org/w/api.php?";

WP.query = "action=parse&format=json&page=";

WP.chartPrefix = "https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_";

WP.templateUsa = "Template:2019–20_coronavirus_pandemic_data/United_States_medical_cases_by_state";

WP.templateGlobal = "Template:2019–20_coronavirus_pandemic_data";

WP.init = function () {

	resetGroups();

	const timeStartAll = performance.now();

	WP.getPandemicData( c19GeoDataUsa, WP.templateUsa );

	WP.getPandemicData( c19GeoDataGlobal, WP.templateGlobal );

	//console.log( "time start all", performance.now() - timeStartAll );

};



WP.getPandemicData = function ( c19GeoData, chart ) {

	WP.timeStart = performance.now();

	WP.requestFileUserData( WP.cors + WP.api + WP.query + chart, WP.onLoadData, c19GeoData );

};



WP.requestFileUserData = function ( url, callback, userData ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr, userData );
	xhr.send( null );

};



WP.onLoadData = function ( xhr, c19GeoData ) {

	//console.log( "xhr", xhr, c19GeoData );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	const text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const table = html.querySelector( ".wikitable" );
	//console.log(table );

	const trs = table.querySelectorAll( "tr" );
	//console.log( 'trs', trs );

	let rows = Array.from( trs ).slice( 0, - 2 ).map( tr => tr.innerText.trim()
		.replace( /\[(.*?)\]/g, "" )
		.split( "\n" ) );

	rows = rows.slice( 2 )// .sort();
	//console.log( "rows", rows);

	if ( c19GeoData === c19GeoDataUsa ) {

		const totals = rows[ 2 ];
		WP.totalsUsa = totals;
		WP.parseUsa( rows );

	} else {

		const totals = rows[ 1 ];
		WP.totalsGlobal = totals;
		WP.parseGlobal( rows );

		sta.init();

	}

};



WP.parseUsa = function ( rows ) {

	//console.log( "rows", rows );

	c19GeoDataUsa.forEach( state => {

		const find = rows.slice( 1 ).find( places => places[ 0 ] === state.region );

		if ( find ) {

			state.cases = find[ 2 ].trim().replace( /,/g, "" );
			state.deaths = find[ 4 ].trim().replace( /,/g, "" );
			state.recoveries = find[ 6 ].trim().replace( /,/g, "" );

		} else {

			//console.log( "state", state );

		}

	} );

	//console.log( "time", performance.now() - WP.timeStart );

	WP.updateBars( c19GeoDataUsa );

};



WP.parseGlobal = function ( rows ) {

	//console.log( "rows", rows );

	const ignores = [ "Coral Princess", "Diamond Princess", "Greg Mortimer", "MS Zaandam", "Leopold I",
		"Recovered", "USS Theodore Roosevelt", "Charles de Gaulle", "HNLMS Dolfijn", "International conveyances",
		"American Samoa", "Guam", "Guantanamo Bay", "Northern Mariana Islands", "Puerto Rico",
		"U.S. Virgin Islands" ];


	const filter1 = rows.filter( row => ignores.includes( row[ 0 ].trim() ) === false );
	//console.log( "filter1", filter1 );

	const filter = filter1.filter( row => {

		const find1 = c19GeoDataGlobal.find( country => row[ 0 ] === country.country );

		const find2 = c19GeoDataGlobal.find( country => row[ 0 ] === country.region );

		// if ( ! find1 && ! find2 ) {

		// 	//console.log( "not find", row );

		// }

		return find1 || find2;

	} );
	//console.log( "filter", filter );


	const countries = filter.map( row => {

		let country;

		country = c19GeoDataGlobal.find( country => row[ 0 ] === country.country && country.region === "" );

		if ( country ) {

			country.cases = row[ 2 ].replace( /,/g, "" );
			country.deaths = row[ 4 ].replace( /,/g, "" );
			country.recoveries = row[ 6 ].replace( /,/g, "" );

		} else {

			country = c19GeoDataGlobal.find( country => row[ 0 ] === country.region );

			if ( country ) {

				country.cases = row[ 2 ].replace( /,/g, "" );
				country.deaths = row[ 4 ].replace( /,/g, "" );
				country.recoveries = row[ 6 ].replace( /,/g, "" );

			} else {

				//console.log( "not found", country );

			}

		}

		return country;

	} );
	// console.log( "", countries );

	WP.updateBars( countries );

};



WP.updateBars = function ( places ) {

	//console.log( "", places );

	const heightsCases = places.map( line => Number( line.cases ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = places.map( ( line, index ) =>
		WP.addBar( line.latitude, line.longitude, places, index, "red", 0.4, heightsCases[ index ], 0, 12, 1, false ) );

	groupCasesWP.add( ...meshesCases );


	const heightsDeaths = places.map( line => Number( line.deaths ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = places.map( ( line, index ) =>
		WP.addBar( line.latitude, line.longitude, places, index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeathsWP.add( ...meshesDeaths );


	const heightsRecoveries = places.map( line => Number( line.recoveries ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = places.map( ( line, index ) =>
		WP.addBar( line.latitude, line.longitude, places, index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveriesWP.add( ...meshesRecoveries );

};



WP.addBar = function ( lat, lon, places, index, color = "red", radius = 0.4, height = 0, offset = 0, radialSegments = 12, heightSegments = 1, openEnded = false ) {

	//console.log( 'rad', radius );

	if ( ! height || height === 0 ) {

		//console.log( "no height", index );

		return new THREE.Mesh();

	}


	const heightScaled = WP.scale ? 0.05 * Math.sqrt( height ) : 0.0002 * height;

	const p1 = THR.latLonToXYZ( 50 + ( offset + 0.5 * heightScaled ), lat, lon );
	const p2 = THR.latLonToXYZ( 100, lat, lon );

	let geometry = new THREE.CylinderGeometry( 0.2, radius, heightScaled, radialSegments, heightSegments, openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( - 0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData.index = index;
	mesh.userData.places = places;
	//mesh.name = rows[ index ][ 0 ];

	//mesh.matrixAutoUpdate = false;

	return mesh;

};



//////////

DMT.displayYourMessage = function ( intersected ) {

	//console.log( "event", event );
	//console.log( "DMT.intersects", DMT.intersects );

	DMTdivPopUp.hidden = false;
	DMTdivPopUp.style.left = event.clientX + "px";
	DMTdivPopUp.style.top = event.clientY + "px";

	WP.places = intersected.userData.places;
	const index = intersected.userData.index;
	const line = WP.places[ index ];
	WP.line = line;


	WP.place = line.region ? line.region : line.country;
	//console.log( "place", place );

	WP.dataLinks = c19LinksGlobal.find( place => place.country === line.country && place.region === line.region );

	DMTdivPopUp.innerHTML = `
	<div id=DMTdivIntersected>
		WP cases: ${ Number( line.cases ).toLocaleString() }<br>
		WP deaths: ${ Number( line.deaths ).toLocaleString() }<br>
		WP recoveries: ${ isNaN( Number( line.recoveries ) ) ? "NA" : Number( line.recoveries ).toLocaleString() }<br>
		<button onclick=WP.getPopUpMore(); >view ${ WP.place } case data chart</button></br>
	</div>`;

};



WP.getPopUpMore = function () {

	//console.log( "", WP.line, WP.place, WP.chart );

	let chart;
	let template;
	WP.htmPlace = "";
	let htmJhu = "";
	let chartIdx = 1;

	if ( WP.places === c19GeoDataUsa ) {

		chart = WP.dataLinks.chart + "_medical cases chart";

		template = "Template:2019–20_coronavirus_pandemic_data/United_States/";

		WP.htmPlace = `
		<div>
			Data courtesy of Wikipedia: <a href="${ WP.chartPrefix }${ WP.dataLinks.article }" target="_blank">${ WP.place }</a>
		<div>
		<p>
			<button onclick=WP.getInfobox();>infobox</button>

			<button onclick=WP.getCases();>state data</button>

			<button onclick=WP.getPlace();>regional data</button>
		</p>`;

	} else {

		// let cases = "NA";
		// let date = "NA";

		// const placeJTS = JTS.rowsCases.find( row => WP.line.country === row[ 1 ] && WP.line.region === row[ 0 ] );

		// if ( placeJTS ) {

		// 	cases = Number( placeJTS[ placeJTS.length - 1 ] );
		// 	const row = JTS.rowsCases[ 0 ];
		// 	date = row[ row.length - 1 ];
		// 	htmJhu = `
		// 		<p>
		// 			JHU Date: ${ date }<br>
		// 			JHU Cases: ${ cases.toLocaleString() }<br>
		// 		</p>
		// 	`;

		// } else {

		// 	htmJhu = `
		// 	<p>No data from JHU for this location</p>
		// 	<p>This may happen at midnight Central European time and at midnight US East Coast time.</p>`;

		// }

		WP.htmPlace = `
		<div>
			Data courtesy of Wikipedia: <a href="${ WP.chartPrefix }${ WP.dataLinks.article }" target="_blank">${ WP.place }</a>
		<div>
		<p>
			<button onclick=WP.getInfobox();>infobox</button>

			<button onclick=WP.getCases();>national data</button>

			<button onclick=WP.getPlace();>regional data</button>
		</p>`;

	}



	DMTdivPopUp.innerHTML = DMT.htmlPopUp;

	DMTdivContent.innerHTML = `
	<div id="DMTdivJhu"  >${ htmJhu }</div>
	<div id="DMTdivMoreButtons" >${ WP.htmPlace }</div>
	<div id=WPdivGraph><div>
	`;


	WP.getInfobox();

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );
	DMTdivHeader.addEventListener( "touchstart", DMT.onMouseDown );

};



WP.getCases = function () {


	if ( WP.places === c19GeoDataUsa ) {

		chart = WP.dataLinks.chart + "_medical cases chart";

		template = "Template:2019–20_coronavirus_pandemic_data/United_States/";

	} else {

		//console.log( "idx", WP.dataLinks.chartIdx );

		WP.chart = WP.dataLinks.chart;
		//.replace( /Ireland/, "Republic_of_Ireland" );

		const suffix = WP.chart === "United States" ? "_medical cases by state" : "_medical cases chart";

		chart = WP.chart + suffix;

		template = WP.templateGlobal + "/";

	}

	chartIdx = WP.dataLinks.chartIdx;

	if ( chartIdx > 0 ) {

		const url = WP.cors + WP.api + WP.query + template + chart;

		requestFile( url, WP.onLoadBarBox );

		WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	} else {

		WPdivGraph.innerHTML = "No chart available";

	}

}


WP.onLoadBarBox = function ( xhr ) {

	//console.log( "xhr", xhr );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const bbox = html.querySelector( ".barbox" );
	//console.log( bboxes );

	//const bbox = bboxes[ 0 ];

	const plinks = bbox.querySelectorAll( ".plainlinks, .reflist" );
	//console.log( "plinks", plinks );

	if ( plinks ) {

		plinks.forEach( link => link.style.display = "none" );

	}

	const extras = bbox.querySelectorAll( 'td[colspan="5"]' );

	if ( extras.length ) {

		extras[ 0 ].style.display = "none";
		//console.log( "extras", extras );

	}

	const s = new XMLSerializer();
	str = s.serializeToString( bbox );

	str = str.replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = str + "<p><button onclick=DMTdivContent.scrollTop=0 >back to top</button></p>";

	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

	DMTdivContent.scrollTop = 88888;

};



WP.getPlace = function () {

	//console.log( "get place ", WP.place );

	const url = WP.cors + WP.api + WP.query + "2020_coronavirus_pandemic_in_" + WP.dataLinks.article;
	//console.log( "", url );

	WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	requestFile( url, WP.onLoadDataTable );

};



WP.onLoadDataTable = function ( xhr ) {

	//console.log( "xhr", xhr );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	text = text
		.replace( /\<img (.*?)>/gi, "" )
		.replace( /\<a href(.*?)>/gi, "" )
		.replace( /\<ul>(.*?)\<\/ul>/i, "" );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const ttab = html.querySelector( ".wikitable" );

	const s = new XMLSerializer();
	const str = s.serializeToString( ttab );

	WPdivGraph.innerHTML = str;

	WPdivGraph.scrollTop = 0;

};



//////////

WP.getInfobox = function () {

	//console.log( "get place ", WP.place );

	const url = WP.cors + WP.api + WP.query + "2020_coronavirus_pandemic_in_" + WP.dataLinks.article;
	//console.log( "", url );

	WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	requestFile( url, WP.onLoadDataInfobox );

};

WP.onLoadDataInfobox = function ( xhr ) {

	//console.log( "xhr", xhr );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	text = text
		.replace( /\<a href(.*?)>/gi, "" )
		.replace( /\<ul>(.*?)\<\/ul>/i, "" )
		.replace( /\[(.*?)\]/g, "" );


	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const infoboxes = html.querySelectorAll( ".infobox" );

	WPdivGraph.innerHTML = "";

	infoboxes.forEach( infobox => {
		//console.log( "infobox", infobox );
		images = infobox.querySelectorAll( "img" );
		//images.forEach( image => image.src = "https://" + image.src.slice( 5 ) );
		refs = infobox.querySelectorAll( ".reference" );
		refs.forEach( ref => ref.style.display = "none" );
		WPdivGraph.innerHTML += infobox.outerHTML + "<br><hr>";
	} );

	WPdivGraph.scrollTop = 0;

	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

};
