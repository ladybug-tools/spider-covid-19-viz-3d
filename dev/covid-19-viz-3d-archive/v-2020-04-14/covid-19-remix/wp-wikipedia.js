// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THR, resetGroups , THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */
/* globals */
// jshint esversion: 6
// jshint loopfunc: true

// https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data
// https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data/United_States_medical_cases_by_state

const WP = {};

WP.cors = "https://cors-anywhere.herokuapp.com/";

WP.api = "https://en.wikipedia.org/w/api.php?";

WP.query = "action=parse&format=json&page=";

WP.articleUsa = "Template:2019–20_coronavirus_pandemic_data/United_States_medical_cases_by_state";

WP.articleGlobal = "Template:2019–20_coronavirus_pandemic_data";

WP.init = function () {

	resetGroups();

	const timeStartAll = performance.now();

	WP.getPandemicData( c19GeoDataUsa, WP.articleUsa );

	WP.getPandemicData( c19GeoDataGlobal, WP.articleGlobal );

	//console.log( "time start all", performance.now() - timeStartAll );

};




WP.getPandemicData = function ( c19GeoData, article ) {

	WP.timeStart = performance.now();

	WP.requestFileUserData( WP.cors + WP.api + WP.query + article, WP.onLoadData, c19GeoData );

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

	const tables = html.querySelectorAll( ".wikitable" );
	//console.log(tables );

	const trs = tables[ 0 ].querySelectorAll( "tr" );
	//console.log( 'trs', trs );

	let rows = Array.from( trs ).slice( 0, - 2 ).map( tr => tr.innerText.trim().replace( /\[(.*?)\]/g, "" ).split( "\n" ) );

	const totals = rows[ 1 ];

	rows = rows.slice( 2 ).sort();
	//console.log( "rows", rows);

	if ( c19GeoData === c19GeoDataUsa ) {

		WP.totalsUsa = totals;
		WP.parseUsa( rows );

	} else {

		WP.totalsGlobal = totals;
		WP.parseGlobal( rows );

	}

};



WP.parseUsa = function ( rows ) {

	c19GeoDataUsa.forEach( state => {

		//console.log( "rows", rows );
		const find = rows.find( places => places[ 0 ] === state.region );

		state.cases = find[ 2 ].replace( /,/g, "" );
		state.deaths = find[ 4 ].replace( /,/g, "" );
		state.recoveries = find[ 6 ].replace( /,/g, "" );

	} );


	//console.log( "time", performance.now() - WP.timeStart );

	WP.updateBars( c19GeoDataUsa );

};



WP.parseGlobal = function ( rows ) {

	//console.log( "rows", rows );

	rows[ 44 ][ 0 ] = "China";

	//console.log( "row1", rows[ 0 ] );

	c19GeoDataGlobal.forEach( country => {

		const find = rows.find( places => places[ 0 ] === country.country && country.region === "" );

		if ( find ) {

			country.cases = find[ 2 ].replace( /,/g, "" );
			country.deaths = find[ 4 ].replace( /,/g, "" );
			country.recoveries = find[ 6 ].replace( /,/g, "" );

		} else {

			const find2 = rows.find( places => places[ 0 ] === country.region );

			if ( find2 ) {

				country.cases = find2[ 2 ].replace( /,/g, "" );
				country.deaths = find2[ 4 ].replace( /,/g, "" );
				country.recoveries = find2[ 6 ].replace( /,/g, "" );

			}

		}

	} );

	//console.log( "time", performance.now() - WP.timeStart );

	WP.updateBars( c19GeoDataGlobal );

	sta.init();

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

		return new THREE.Mesh();

	}

	const heightScaled = 0.05 * Math.sqrt( height );

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

	return mesh;

};



DMT.displayMessage = function ( intersected ) {

	const places = intersected.userData.places;
	const index = intersected.userData.index;

	const line = places[ index ];
	DMT.line = line;
	//console.log( "line", line );

	const place = DMT.line.region ? DMT.line.region : DMT.line.country;

	const placeWP = place
		.replace( /United/g, "the_United" )
		.replace( / /g, "_" )
		.replace( /New_York/, "New_York_(state)" )
		.replace( /Georgia/, "Georgia_(U.S._state)" );

	DMTdivPopUp.innerHTML = `
		<div id=DMTdivIntersected>
			Wikipedia: <a href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${ placeWP }" target="_blank">${ place }</a><br>
			WP cases: ${ Number( line.cases ).toLocaleString() }<br>
			WP deaths: ${ Number( line.deaths ).toLocaleString() }<br>
			WP recoveries: ${ isNaN( Number( line.recoveries ) ) ? "NA" : Number( line.recoveries ).toLocaleString() }<br>
			<button onclick=DMT.getPopUpMore(); >view ${ place } case data chart</button></br>
			<div id="DMTdivJhu"  ></div>
			<div id=WPdivPlaceJs ></div>
			<div id=WPdivGraph style="overflow:auto;resizable:both;"><div>
		</div>
	`;

};


DMT.getPopUpMore = function () {

	//console.log( "", DMT.line );

	WPdivGraph.innerHTML = `<img src="${ pathAssets }images/progress-indicator.gif" width=100 >`;

	let cases = "NA";
	let date = "NA";

	const placeJTS = JTS.rowsCases.find( row => DMT.line.country === row[ 1 ] && DMT.line.region === row[ 0 ] );

	if ( placeJTS ) {

		cases = Number( placeJTS[ placeJTS.length - 1 ] );
		const row = JTS.rowsCases[ 0 ];
		date = row[ row.length - 1 ];
		DMTdivJhu.innerHTML = `
			<p>
				JHU Date: ${ date }<br>
				JHU Cases: ${ cases.toLocaleString() }<br>
			</p>
		`;

	} else {

		if ( DMT.line.country === "United States" ) {

			DMTdivJhu.innerHTML = "";

			WPdivPlaceJs.innerHTML = `
				<p>
					<button onclick=WP.getPlace();>view county data chart</button>
				</p>
			`;


		} else {

			DMTdivJhu.innerHTML = `
			<p>No data from JHU for this location</p>
			<p>This may happen at midnight Central European time and at midnight US East Coast time.</p>`;

		}

	}

	WP.place = DMT.line.region ? DMT.line.region : DMT.line.country;

	// const js = document.createElement( "script" );
	// js.onerror = console.clear();
	// js.src = `../places/${ place.toLowerCase() },js`;
	// if ( js ) { document.body.appendChild( js ); }



	const placeWP = WP.place
		.replace( /United/g, "the_United" )
		.replace( / /g, "_" )
		.replace( /New_York/, "New_York_(state)" )
		.replace( /Georgia/, "Georgia_(U.S._state)" )
		.replace( /Washington D.C./, "Washington,_D.C." )
		.replace( /Ireland/, "the_Republic_of_Ireland" )
		.replace( /Isle of Man/, "the_Isle_of_Man" )


	const article = "2020_coronavirus_pandemic_in_" + placeWP;

	requestFile( WP.cors + WP.api + WP.query + article, WP.onLoadBarBox );
	//DMT.fetchUrlWikipediaApiPlace( url, 0 );

};



WP.onLoadBarBox = function ( xhr ) {

	//console.log( "xhr", xhr );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	// text = text
	// 	.replace( /\<img (.*?)>/gi, "" )
	// 	.replace( /\<a href(.*?)>/gi, "" )
	// 	.replace( /\<ul>(.*?)\<\/ul>/i, "" );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const bboxes = html.querySelectorAll( ".barbox" );
	//console.log( bboxes );

	boxIndex = 0; //[ "Ireland" ].includes( WP.place ) ? 1 : 0;
	const bbox = bboxes[ boxIndex ];

	const plinks = bbox.querySelectorAll( ".plainlinks" );
	//console.log( "", links );
	plinks[ 0 ].style.display = "none";

	const s = new XMLSerializer();
	const str = s.serializeToString( bbox ).replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = str;
	WPdivGraph.style.maxHeight = ( window.innerHeight - DMTdivPopUp.offsetTop - WPdivGraph.offsetTop - 15 ) + "px";

};



WP.getPlace = function () {

	//console.log( "", DMT.line );

	link = links.find( link => link.state === WP.place );
	//console.log( "link", link );

	WP.table = Number( link.table );
	const article = link.article;

	if ( article.startsWith( "http: " ) ) {

	} else {

		requestFile( WP.cors + WP.api + WP.query + article, WP.onLoadDataTable );

	}

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

	const tables = html.querySelectorAll( ".wikitable" );
	//console.log( tables );


	const ttab = tables[ WP.table ];

	const s = new XMLSerializer();
	const str = s.serializeToString( ttab ).replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = str;

};




DMT.fetchUrlWikipediaApiPlace = function ( url, tab = 0, rowStart = 0, column = 0 ) {

	tab = ! tab ? 0 : tab;

	const api = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=parse&format=json&page=";

	//console.log( 'api', tab,  api + url );
	//console.log( 'tab', tab );

	fetch( api + url )
		.then( function ( response ) {

			return response.json();

		} )
		.then( function ( response ) {

			let html_code = response[ "parse" ][ "text" ][ "*" ];

			html_code = html_code
				.replace( /\<img (.*?)>/gi, "" )
				.replace( /\<a href(.*?)>/gi, "" )
				.replace( /\<ul>(.*?)\<\/ul>/gi, "" );

			const parser = new DOMParser();
			const html = parser.parseFromString( html_code, "text/html" );
			//console.log( "html", html );

			tables = html.querySelectorAll( ".barbox" );

			const ttab = tables[ tab ];

			if ( ! ttab ) {

				WPdivGraph.innerHTML = "There seem to be no charts or tables we can access here.\n\nTry another place";
				return;

			}

			const links = ttab.querySelectorAll( ".plainlinks" );
			//console.log( "", links );
			links[ 0 ].style.display = "none";

			const s = new XMLSerializer();
			let str = s.serializeToString( ttab );
			//str = str.replace( /\[(.*?)\]/g, "" );

			if ( WPdivGraph ) {

				WPdivGraph.innerHTML = str;
				WPdivGraph.style.maxHeight = ( window.innerHeight - DMTdivPopUp.offsetTop - WPdivGraph.offsetTop - 15 ) + "px";

			}

		} );

};


// const states = c19GeoDataUsa.map( state => {
// 	return `{ state: "${state.region }", article: "2020_coronavirus_pandemic_in_${state.region.replace( / /g, "_" ) }", table: "0" }`; } ).join( ",\n");

//console.log( "", states );


const links = [

	{ state: "Alabama", article: "2020_coronavirus_pandemic_in_Alabama", table: "0" },
	{ state: "Alaska", article: "2020_coronavirus_pandemic_in_Alaska", table: "0" },
	{ state: "American Samoa", article: "2020_coronavirus_pandemic_in_American_Samoa", table: "0" },
	{ state: "Arizona", article: "2020_coronavirus_pandemic_in_Arizona", table: "0" },
	{ state: "Arkansas", article: "2020_coronavirus_pandemic_in_Arkansas", table: "0" },
	{ state: "California", article: "2020_coronavirus_pandemic_in_California", table: "0" },
	{ state: "Colorado", article: "2020_coronavirus_pandemic_in_Colorado", table: "0" },
	{ state: "Connecticut", article: "2020_coronavirus_pandemic_in_Connecticut", table: "0" },
	{ state: "Delaware", article: "2020_coronavirus_pandemic_in_Delaware", table: "0" },
	{ state: "Florida", article: "2020_coronavirus_pandemic_in_Florida", table: "0" },
	{ state: "Georgia", article: "2020_coronavirus_pandemic_in_Georgia_(U.S._state)", table: "2" },
	{ state: "Guam", article: "2020_coronavirus_pandemic_in_Guam", table: "0" },
	{ state: "Hawaii", article: "2020_coronavirus_pandemic_in_Hawaii", table: "0" },
	{ state: "Idaho", article: "2020_coronavirus_pandemic_in_Idaho", table: "0" },
	{ state: "Illinois", article: "2020_coronavirus_pandemic_in_Illinois", table: "0" },
	{ state: "Indiana", article: "2020_coronavirus_pandemic_in_Indiana", table: "0" },
	{ state: "Iowa", article: "2020_coronavirus_pandemic_in_Iowa", table: "0" },
	{ state: "Kansas", article: "2020_coronavirus_pandemic_in_Kansas", table: "0" },
	{ state: "Kentucky", article: "2020_coronavirus_pandemic_in_Kentucky", table: "0" },
	{ state: "Louisiana", article: "2020_coronavirus_pandemic_in_Louisiana", table: "0" },
	{ state: "Maine", article: "2020_coronavirus_pandemic_in_Maine", table: "0" },
	{ state: "Maryland", article: "2020_coronavirus_pandemic_in_Maryland", table: "1" },
	{ state: "Massachusetts", article: "2020_coronavirus_pandemic_in_Massachusetts", table: "0" },
	{ state: "Michigan", article: "2020_coronavirus_pandemic_in_Michigan", table: "0" },
	{ state: "Minnesota", article: "2020_coronavirus_pandemic_in_Minnesota", table: "0" },
	{ state: "Mississippi", article: "2020_coronavirus_pandemic_in_Mississippi", table: "0" },
	{ state: "Missouri", article: "2020_coronavirus_pandemic_in_Missouri", table: "0" },
	{ state: "Montana", article: "2020_coronavirus_pandemic_in_Montana", table: "0" },
	{ state: "Nebraska", article: "2020_c", table: "0" },
	{ state: "Nevada", article: "http://dpbh.nv.gov/coronavirus/", table: "0" },
	{ state: "New Hampshire", article: "2020_coronavirus_pandemic_in_New_Hampshire", table: "0" },
	{ state: "New Jersey", article: "2020_coronavirus_pandemic_in_New_Jersey", table: "0" },
	{ state: "New Mexico", article: "2020_coronavirus_pandemic_in_New_Mexico", table: "0" },
	{ state: "New York", article: "2020_coronavirus_pandemic_in_New_York_(state)", table: "1" },
	{ state: "North Carolina", article: "2020_coronavirus_pandemic_in_North_Carolina", table: "0" },
	{ state: "North Dakota", article: "2020_coronavirus_pandemic_in_North_Dakota", table: "0" },
	{ state: "Northern Mariana Islands", article: "2020_coronavirus_pandemic_in_Northern_Mariana_Islands", table: "0" },
	{ state: "Ohio", article: "2020_coronavirus_pandemic_in_Ohio", table: "0" },
	{ state: "Oklahoma", article: "2020_coronavirus_pandemic_in_Oklahoma", table: "0" },
	{ state: "Oregon", article: "2020_coronavirus_pandemic_in_Oregon", table: "1" },
	{ state: "Pennsylvania", article: "2020_coronavirus_pandemic_in_Pennsylvania", table: "0" },
	{ state: "Puerto Rico", article: "2020_coronavirus_pandemic_in_Puerto_Rico", table: "0" },
	{ state: "Rhode Island", article: "2020_coronavirus_pandemic_in_Rhode_Island", table: "0" },
	{ state: "South Carolina", article: "2020_coronavirus_pandemic_in_South_Carolina", table: "0" },
	{ state: "South Dakota", article: "2020_coronavirus_pandemic_in_South_Dakota", table: "0" },
	{ state: "Tennessee", article: "2020_coronavirus_pandemic_in_Tennessee", table: "0" },
	{ state: "Texas", article: "2020_coronavirus_pandemic_in_Texas", table: "0" },
	{ state: "U.S. Virgin Islands", article: "2020_coronavirus_pandemic_in_U.S._Virgin_Islands", table: "0" },
	{ state: "Utah", article: "2020_coronavirus_pandemic_in_Utah", table: "0" },
	{ state: "Vermont", article: "2020_coronavirus_pandemic_in_Vermont", table: "0" },
	{ state: "Virginia", article: "2020_coronavirus_pandemic_in_Virginia", table: "0" },
	{ state: "Washington", article: "2020_coronavirus_pandemic_in_Washington", table: "0" },
	{ state: "Washington D.C.", article: "2020_coronavirus_pandemic_in_Washington,_D.C.", table: "0" },
	{ state: "West Virginia", article: "2020_coronavirus_pandemic_in_West_Virginia", table: "0" },
	{ state: "Wisconsin", article: "2020_coronavirus_pandemic_in_Wisconsin", table: "0" },
	{ state: "Wyoming", article: "2020_coronavirus_pandemic_in_Wyoming", table: "0" }

];



