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

WP.articlePrefix = "https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_";

WP.templateUsa = "Template:2019–20_coronavirus_pandemic_data/United_States_medical_cases_by_state";

WP.templateGlobal = "Template:2019–20_coronavirus_pandemic_data";

WP.init = function () {

	resetGroups();

	const timeStartAll = performance.now();

	WP.getPandemicData( c19GeoDataUsa, WP.templateUsa );

	WP.getPandemicData( c19GeoDataGlobal, WP.templateGlobal );

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
		//WP.parseGlobal( rows );
		WP.parseGlobal2( rows );

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

	//rows[ 44 ][ 0 ] = "China";
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

			} else {

				//console.log( "not found", country );
			}

		}

	} );

	//console.log( "time", performance.now() - WP.timeStart );

	WP.updateBars( c19GeoDataGlobal );

	sta.init();

};


WP.parseGlobal2 = function ( rows ) {

	//console.log( "rows", rows );

	const ignores = [ "Coral Princess", "Diamond Princess", "Greg Mortimer", "MS Zaandam", "Leopold I",
		"Recovered", "USS Theodore Roosevelt", "Charles de Gaulle", "HNLMS Dolfijn", "International conveyances",
		"American Samoa", "Guam", "Guantanamo Bay", "Northern Mariana Islands", "Puerto Rico",
		"U.S. Virgin Islands" ];


	const filter1 = rows.filter( row => ignores.includes( row[ 0 ].trim() ) === false );

	//console.log( "filter1", filter1 );

	filter = filter1.filter( row => {

		const find1 = c19GeoDataGlobal.find( country => row[ 0 ] === country.country );

		const find2 = c19GeoDataGlobal.find( country => row[ 0 ] === country.region );

		if ( ! find1 && ! find2 ) {

			//console.log( "not find", row );

		}

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



//////////

DMT.displayYourMessage = function ( intersected) {

	//console.log( "event", event );
	//console.log( "DMT.intersects", DMT.intersects );

	DMTdivPopUp.hidden = false;
	DMTdivPopUp.style.left = event.clientX + "px";
	DMTdivPopUp.style.top = event.clientY + "px";
	//DMTdivContainer.scrollTop = 0;

	WP.places = intersected.userData.places;
	const index = intersected.userData.index;
	const line = WP.places[ index ];
	WP.line = line;

	if ( WP.places === c19GeoDataUsa ) {

		const state = c19LinksUsa.find( state => state.state === line.region );

		WP.place = state.state;

		WP.article = state.state;
		//console.log( "", WP.place );

	} else {

		WP.place = line.region ? line.region : line.country;
		//console.log( "place", place );

		WP.dataLinks = c19LinksGlobal.find( place => place.country === line.country && place.region === line.region );

		WP.article = WP.dataLinks.article;

	}

	DMTdivPopUp.innerHTML = `
	<div id=DMTdivIntersected>
		Wikipedia: <a href="${ WP.articlePrefix }${ WP.article }" target="_blank">${ WP.place }</a><br>
		WP cases: ${ Number( line.cases ).toLocaleString() }<br>
		WP deaths: ${ Number( line.deaths ).toLocaleString() }<br>
		WP recoveries: ${ isNaN( Number( line.recoveries ) ) ? "NA" : Number( line.recoveries ).toLocaleString() }<br>
		<button onclick=WP.getPopUpMore(); >view ${ WP.place } case data chart</button></br>
	</div>`;

};



WP.getPopUpMore = function () {
	//console.log( "", WP.line, WP.place );

	let article;
	let template;
	let htmJhu = "";
	WP.htmPlace = "";
	let chartIdx = 1

	if ( WP.places === c19GeoDataUsa ) {

		WP.htmPlace = `
			<p>
				<button onclick=WP.getPlace();>view ${ WP.place } county data chart</button>
			</p>
		`;

		article = WP.article + "_medical cases chart";

		template = "Template:2019–20_coronavirus_pandemic_data/United_States/";

	} else {

		let cases = "NA";
		let date = "NA";

		const placeJTS = JTS.rowsCases.find( row => WP.line.country === row[ 1 ] && WP.line.region === row[ 0 ] );

		if ( placeJTS ) {

			cases = Number( placeJTS[ placeJTS.length - 1 ] );
			const row = JTS.rowsCases[ 0 ];
			date = row[ row.length - 1 ];
			htmJhu = `
				<p>
					JHU Date: ${ date }<br>
					JHU Cases: ${ cases.toLocaleString() }<br>
				</p>
			`;

		} else {

			htmJhu = `
			<p>No data from JHU for this location</p>
			<p>This may happen at midnight Central European time and at midnight US East Coast time.</p>`;

		}

		WP.article = WP.article
 			.replace( /Ireland/, "Republic_of_Ireland" );

		const suffix = WP.article === "United States" ? "_medical cases by state" : "_medical cases chart";

		article = WP.article + suffix;

		template = WP.templateGlobal + "/";

		chartIdx = WP.dataLinks.chartIdx;


	}




	DMTdivPopUp.innerHTML = DMT.htmlPopUp;

	DMTdivContent.innerHTML = `
	<div id="DMTdivJhu"  >${ htmJhu }</div>
	<div id=WPdivGraph><div>
	`;


	console.log( "idx", WP.dataLinks.chartIdx );

	if ( chartIdx > 0 ) {

		const url = WP.cors + WP.api + WP.query + template + article;

		requestFile( url, WP.onLoadBarBox );

		WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	} else {

		WPdivGraph.innerHTML = "No chart available"
	}

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );
	DMTdivHeader.addEventListener( "touchstart", DMT.onMouseDown );

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
	console.log( bboxes );

	boxIndex = 0;
	const bbox = bboxes[ boxIndex ];

	const plinks = bbox.querySelectorAll( ".plainlinks, .reflist" );
	console.log( "plinks", plinks );

	if ( plinks ) { plinks.forEach( link => link.style.display = "none" ); }

	extras = bbox.querySelectorAll( 'td[colspan="5"]' );

	if ( extras.length ) {

		extras[ 0 ].style.display = "none";
		console.log( "extras", extras );
	}

	const s = new XMLSerializer();
	str = s.serializeToString( bbox );

	str = str //.replace( /\<td colspan=\"5\"(.*?)\<\/td>/, "" );
		.replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = str + WP.htmPlace;

	DMT.onLoadMore();
	setTimeout( DMT.onLoadMore, 100 );

};



WP.getPlace = function () {

	console.log( "get place ", WP.place );

	const url = WP.cors + WP.api + WP.query + "2020_coronavirus_pandemic_in_" + WP.article;
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

	const tables = html.querySelectorAll( ".wikitable" );
	console.log( tables );

	const ttab = tables[ 0 ];

	const s = new XMLSerializer();
	const str = s.serializeToString( ttab );

	WPdivGraph.innerHTML = WP.htmPlace + str;

	WPdivGraph.scrollTop = 0;

};



c19LinksGlobalbbb = [
	{ "country": "Afghanistan", "region": "", "article": "Afghanistan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Albania", "region": "", "article": "Albania", "chart": "1", "table": "", "index": "0" },
	{ "country": "Algeria", "region": "", "article": "Algeria", "chart": "1", "table": "", "index": "0" },
	{ "country": "Andorra", "region": "", "article": "Andorra", "chart": "1", "table": "", "index": "0" },
	{ "country": "Angola", "region": "", "article": "Angola", "chart": "1", "table": "", "index": "0" },
	{ "country": "Antigua & Barbuda", "region": "", "article": "Antigua_and_Barbuda", "chart": "1", "table": "", "index": "0" },
	{ "country": "Argentina", "region": "", "article": "Argentina", "chart": "1", "table": "", "index": "0" },
	{ "country": "Armenia", "region": "", "article": "Armenia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "Australian Capital Territory", "article": "Australian_Capital_Territory", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "New South Wales", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "Northern Territory", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "Queensland", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "South Australia", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "Tasmania", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "Victoria", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "Western Australia", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Australia", "region": "", "article": "Australia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Austria", "region": "", "article": "Austria", "chart": "1", "table": "", "index": "0" },
	{ "country": "Azerbaijan", "region": "", "article": "Azerbaijan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Bahamas", "region": "", "article": "Bahamas", "chart": "1", "table": "", "index": "0" },
	{ "country": "Bahrain", "region": "", "article": "Bahrain", "chart": "1", "table": "", "index": "0" },
	{ "country": "Bangladesh", "region": "", "article": "Bangladesh", "chart": "1", "table": "", "index": "0" },
	{ "country": "Barbados", "region": "", "article": "Barbados", "chart": "1", "table": "", "index": "0" },
	{ "country": "Belarus", "region": "", "article": "Belarus", "chart": "1", "table": "", "index": "0" },
	{ "country": "Belgium", "region": "", "article": "Belgium", "chart": "1", "table": "", "index": "0" },
	{ "country": "Belize", "region": "", "article": "Belize", "chart": "1", "table": "", "index": "0" },
	{ "country": "Benin", "region": "", "article": "Benin", "chart": "1", "table": "", "index": "0" },
	{ "country": "Bhutan", "region": "", "article": "Bhutan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Bolivia", "region": "", "article": "Bolivia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Bosnia & Herzegovina", "region": "", "article": "Bosnia_and_Herzegovina", "chart": "1", "table": "", "index": "0" },
	{ "country": "Botswana", "region": "", "article": "Botswana", "chart": "1", "table": "", "index": "0" },
	{ "country": "Brazil", "region": "", "article": "Brazil", "chart": "1", "table": "", "index": "0" },
	{ "country": "Brunei", "region": "", "article": "Brunei", "chart": "1", "table": "", "index": "0" },
	{ "country": "Bulgaria", "region": "", "article": "Bulgaria", "chart": "1", "table": "", "index": "0" },
	{ "country": "Burkina Faso", "region": "", "article": "Burkina_Faso", "chart": "1", "table": "", "index": "0" },
	{ "country": "Burundi", "region": "", "article": "Burundi", "chart": "1", "table": "", "index": "0" },
	{ "country": "Cambodia", "region": "", "article": "Cambodia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Cameroon", "region": "", "article": "Cameroon", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Alberta", "article": "Alberta", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "British Columbia", "article": "British_Columbia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Grand Princess", "article": "Grand_Princess", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Manitoba", "article": "Manitoba", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "New Brunswick", "article": "New_Brunswick", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Newfoundland and Labrador", "article": "Newfoundland_and_Labrador", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Nova Scotia", "article": "Nova_Scotia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Ontario", "article": "Ontario", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Prince Edward Island", "article": "Prince_Edward_Island", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Quebec", "article": "Quebec", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Saskatchewan", "article": "Saskatchewan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Northwest Territories", "article": "Northwest_Territories", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "Yukon", "article": "Yukon", "chart": "1", "table": "", "index": "0" },
	{ "country": "Canada", "region": "", "article": "Canada", "chart": "1", "table": "", "index": "0" },
	{ "country": "Cape Verde", "region": "", "article": "Cape_Verde", "chart": "1", "table": "", "index": "0" },
	{ "country": "Central African Republic", "region": "", "article": "Central_African_Republic", "chart": "0", "table": "", "index": "0" },
	{ "country": "Chad", "region": "", "article": "Chad", "chart": "1", "table": "", "index": "0" },
	{ "country": "Chile", "region": "", "article": "Chile", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Anhui", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Beijing", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Chongqing", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Fujian", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Gansu", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Guangdong", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Guangxi", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Guizhou", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Hainan", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Hebei", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Heilongjiang", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Henan", "article": "Henan", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Hong Kong", "article": "Hong_Kong", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Hubei", "article": "Hubei", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Hunan", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Inner Mongolia", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Jiangsu", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Jiangxi", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Jilin", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Liaoning", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Macau", "article": "Macau", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Ningxia", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Qinghai", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Shaanxi", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Shandong", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Shanghai", "article": "Shanghai", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Shanxi", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Sichuan", "article": "Sichuan", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Tianjin", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Tibet", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Xinjiang", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Yunnan", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "Zhejiang", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "China", "region": "", "article": "mainland_China", "chart": "1", "table": "", "index": "0" },
	{ "country": "Colombia", "region": "", "article": "Colombia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Republic of the Congo", "region": "", "article": "Republic_of_the_Congo", "chart": "1", "table": "", "index": "0" },
	{ "country": "DR Congo", "region": "", "article": "the_Democratic_Republic_of_the_Congo", "chart": "1", "table": "", "index": "0" },
	{ "country": "Costa Rica", "region": "", "article": "Costa_Rica", "chart": "1", "table": "", "index": "0" },
	{ "country": "Croatia", "region": "", "article": "Croatia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Cuba", "region": "", "article": "Cuba", "chart": "1", "table": "", "index": "0" },
	{ "country": "Cyprus", "region": "", "article": "Cyprus", "chart": "1", "table": "", "index": "0" },
	{ "country": "Czech Republic", "region": "", "article": "Czech_Republic", "chart": "1", "table": "", "index": "0" },
	{ "country": "Denmark", "region": "Faroe Islands", "article": "Faroe_Islands", "chart": "1", "table": "", "index": "0" },
	{ "country": "Denmark", "region": "Greenland", "article": "Greenland", "chart": "1", "table": "", "index": "0" },
	{ "country": "Denmark", "region": "", "article": "Denmark", "chart": "1", "table": "", "index": "0" },
	{ "country": "Djibouti", "region": "", "article": "Djibouti", "chart": "1", "table": "", "index": "0" },
	{ "country": "Dominica", "region": "", "article": "Dominica", "chart": "1", "table": "", "index": "0" },
	{ "country": "Dominican Republic", "region": "", "article": "the_Dominican_Republic", "chart": "1", "table": "", "index": "0" },
	{ "country": "East Timor", "region": "", "article": "East_Timor", "chart": "1", "table": "", "index": "0" },
	{ "country": "Ecuador", "region": "", "article": "Ecuador", "chart": "1", "table": "", "index": "0" },
	{ "country": "Egypt", "region": "", "article": "Egypt", "chart": "1", "table": "", "index": "0" },
	{ "country": "El Salvador", "region": "", "article": "El_Salvador", "chart": "1", "table": "", "index": "0" },
	{ "country": "Equatorial Guinea", "region": "", "article": "Equatorial_Guinea", "chart": "1", "table": "", "index": "0" },
	{ "country": "Eritrea", "region": "", "article": "Eritrea", "chart": "1", "table": "", "index": "0" },
	{ "country": "Estonia", "region": "", "article": "Estonia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Eswatini", "region": "", "article": "Eswatini", "chart": "1", "table": "", "index": "0" },
	{ "country": "Ethiopia", "region": "", "article": "Ethiopia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Fiji", "region": "", "article": "Fiji", "chart": "1", "table": "", "index": "0" },
	{ "country": "Finland", "region": "", "article": "Finland", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "French Guiana", "article": "French_Guiana", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "French Polynesia", "article": "French_Polynesia", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "Guadeloupe", "article": "Guadeloupe", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "Mayotte", "article": "Mayotte", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "New Caledonia", "article": "New_Caledonia", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "Réunion", "article": "Réunion", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "Saint Barthélemy", "article": "Saint_Barthélemy", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "Saint Martin", "article": "French_Saint_Martin", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "Martinique", "article": "Martinique", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "Saint Pierre & Miquelon", "article": "Saint_Pierre_and_Miquelon", "chart": "1", "table": "", "index": "0" },
	{ "country": "France", "region": "", "article": "France", "chart": "1", "table": "", "index": "0" },
	{ "country": "Gabon", "region": "", "article": "Gabon", "chart": "1", "table": "", "index": "0" },
	{ "country": "Gambia", "region": "", "article": "Gambia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Georgia", "region": "", "article": "Georgia_(country)", "chart": "1", "table": "", "index": "0" },
	{ "country": "Germany", "region": "", "article": "Germany", "chart": "1", "table": "", "index": "0" },
	{ "country": "Ghana", "region": "", "article": "Ghana", "chart": "1", "table": "", "index": "0" },
	{ "country": "Greece", "region": "", "article": "Greece", "chart": "1", "table": "", "index": "0" },
	{ "country": "Grenada", "region": "", "article": "Grenada", "chart": "1", "table": "", "index": "0" },
	{ "country": "Guatemala", "region": "", "article": "Guatemala", "chart": "1", "table": "", "index": "0" },
	{ "country": "Guinea", "region": "", "article": "Guinea", "chart": "1", "table": "", "index": "0" },
	{ "country": "Guinea-Bissau", "region": "", "article": "Guinea-Bissau", "chart": "1", "table": "", "index": "0" },
	{ "country": "Guyana", "region": "", "article": "Guyana", "chart": "1", "table": "", "index": "0" },
	{ "country": "Haiti", "region": "", "article": "Haiti", "chart": "1", "table": "", "index": "0" },
	{ "country": "Honduras", "region": "", "article": "Honduras", "chart": "1", "table": "", "index": "0" },
	{ "country": "Hungary", "region": "", "article": "Hungary", "chart": "1", "table": "", "index": "0" },
	{ "country": "Iceland", "region": "", "article": "Iceland", "chart": "1", "table": "", "index": "0" },
	{ "country": "India", "region": "", "article": "India", "chart": "1", "table": "", "index": "0" },
	{ "country": "Indonesia", "region": "", "article": "Indonesia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Iran", "region": "", "article": "Iran", "chart": "1", "table": "", "index": "0" },
	{ "country": "Iraq", "region": "", "article": "Iraq", "chart": "1", "table": "", "index": "0" },
	{ "country": "Ireland", "region": "", "article": "Ireland", "chart": "1", "table": "", "index": "0" },
	{ "country": "Israel", "region": "", "article": "Israel", "chart": "1", "table": "", "index": "0" },
	{ "country": "Italy", "region": "", "article": "Italy", "chart": "1", "table": "", "index": "0" },
	{ "country": "Ivory Coast", "region": "", "article": "Ivory_Coast", "chart": "1", "table": "", "index": "0" },
	{ "country": "Jamaica", "region": "", "article": "Jamaica", "chart": "1", "table": "", "index": "0" },
	{ "country": "Japan", "region": "", "article": "Japan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Jordan", "region": "", "article": "Jordan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Kazakhstan", "region": "", "article": "Kazakhstan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Kenya", "region": "", "article": "Kenya", "chart": "1", "table": "", "index": "0" },
	{ "country": "Kosovo", "region": "", "article": "Kosovo", "chart": "1", "table": "", "index": "0" },
	{ "country": "Kuwait", "region": "", "article": "Kuwait", "chart": "1", "table": "", "index": "0" },
	{ "country": "Kyrgyzstan", "region": "", "article": "Kyrgyzstan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Laos", "region": "", "article": "Laos", "chart": "1", "table": "", "index": "0" },
	{ "country": "Latvia", "region": "", "article": "Latvia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Lebanon", "region": "", "article": "Lebanon", "chart": "1", "table": "", "index": "0" },
	{ "country": "Liberia", "region": "", "article": "Liberia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Libya", "region": "", "article": "Libya", "chart": "1", "table": "", "index": "0" },
	{ "country": "Liechtenstein", "region": "", "article": "Liechtenstein", "chart": "1", "table": "", "index": "0" },
	{ "country": "Lithuania", "region": "", "article": "Lithuania", "chart": "1", "table": "", "index": "0" },
	{ "country": "Luxembourg", "region": "", "article": "Luxembourg", "chart": "1", "table": "", "index": "0" },
	{ "country": "Madagascar", "region": "", "article": "Madagascar", "chart": "1", "table": "", "index": "0" },
	{ "country": "Malawi", "region": "", "article": "Malawi", "chart": "1", "table": "", "index": "0" },
	{ "country": "Malaysia", "region": "", "article": "Malaysia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Maldives", "region": "", "article": "the_Maldives", "chart": "1", "table": "", "index": "0" },
	{ "country": "Mali", "region": "", "article": "Mali", "chart": "1", "table": "", "index": "0" },
	{ "country": "Malta", "region": "", "article": "Malta", "chart": "1", "table": "", "index": "0" },
	{ "country": "Mauritania", "region": "", "article": "Mauritania", "chart": "1", "table": "", "index": "0" },
	{ "country": "Mauritius", "region": "", "article": "Mauritius", "chart": "1", "table": "", "index": "0" },
	{ "country": "Mexico", "region": "", "article": "Mexico", "chart": "1", "table": "", "index": "0" },
	{ "country": "Moldova", "region": "", "article": "Moldova", "chart": "1", "table": "", "index": "0" },
	{ "country": "Monaco", "region": "", "article": "Monaco", "chart": "1", "table": "", "index": "0" },
	{ "country": "Mongolia", "region": "", "article": "Mongolia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Montenegro", "region": "", "article": "Montenegro", "chart": "1", "table": "", "index": "0" },
	{ "country": "Morocco", "region": "", "article": "Morocco", "chart": "1", "table": "", "index": "0" },
	{ "country": "Mozambique", "region": "", "article": "Mozambique", "chart": "1", "table": "", "index": "0" },
	{ "country": "Myanmar", "region": "", "article": "Myanmar", "chart": "1", "table": "", "index": "0" },
	{ "country": "Namibia", "region": "", "article": "Namibia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Nepal", "region": "", "article": "Nepal", "chart": "1", "table": "", "index": "0" },
	{ "country": "Netherlands", "region": "Aruba", "article": "Aruba", "chart": "1", "table": "", "index": "0" },
	{ "country": "Netherlands", "region": "Curaçao", "article": "Curaçao", "chart": "1", "table": "", "index": "0" },
	{ "country": "Netherlands", "region": "Sint Maarten", "article": "Sint_Maarten", "chart": "1", "table": "", "index": "0" },
	{ "country": "Netherlands", "region": "", "article": "the_Netherlands", "chart": "1", "table": "", "index": "0" },
	{ "country": "Netherlands", "region": "Sint Eustatius", "article": "Sint_Eustatius", "chart": "1", "table": "", "index": "0" },
	{ "country": "New Zealand", "region": "", "article": "New_Zealand", "chart": "1", "table": "", "index": "0" },
	{ "country": "Nicaragua", "region": "", "article": "Nicaragua", "chart": "1", "table": "", "index": "0" },
	{ "country": "Niger", "region": "", "article": "Niger", "chart": "1", "table": "", "index": "0" },
	{ "country": "Nigeria", "region": "", "article": "Nigeria", "chart": "1", "table": "", "index": "0" },
	{ "country": "Niue", "region": "", "article": "Niue", "chart": "1", "table": "", "index": "0" },
	{ "country": "North Macedonia", "region": "", "article": "North_Macedonia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Norway", "region": "", "article": "Norway", "chart": "1", "table": "", "index": "0" },
	{ "country": "Oman", "region": "", "article": "Oman", "chart": "1", "table": "", "index": "0" },
	{ "country": "Pakistan", "region": "", "article": "Pakistan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Palestine", "region": "", "article": "Palestine", "chart": "1", "table": "", "index": "0" },
	{ "country": "Panama", "region": "", "article": "Panama", "chart": "1", "table": "", "index": "0" },
	{ "country": "Papua New Guinea", "region": "", "article": "Papua_New_Guinea", "chart": "1", "table": "", "index": "0" },
	{ "country": "Paraguay", "region": "", "article": "Paraguay", "chart": "1", "table": "", "index": "0" },
	{ "country": "Peru", "region": "", "article": "Peru", "chart": "1", "table": "", "index": "0" },
	{ "country": "Philippines", "region": "", "article": "the_Philippines", "chart": "1", "table": "", "index": "0" },
	{ "country": "Poland", "region": "", "article": "Poland", "chart": "1", "table": "", "index": "0" },
	{ "country": "Portugal", "region": "", "article": "Portugal", "chart": "1", "table": "", "index": "0" },
	{ "country": "Qatar", "region": "", "article": "Qatar", "chart": "1", "table": "", "index": "0" },
	{ "country": "Romania", "region": "", "article": "Romania", "chart": "1", "table": "", "index": "0" },
	{ "country": "Russia", "region": "", "article": "Russia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Rwanda", "region": "", "article": "Rwanda", "chart": "1", "table": "", "index": "0" },
	{ "country": "Saint Kitts & Nevis", "region": "", "article": "Saint_Kitts_and_Nevis", "chart": "1", "table": "", "index": "0" },
	{ "country": "Saint Lucia", "region": "", "article": "Saint_Lucia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Saint Vincent and the Grenadines", "region": "", "article": "Saint_Vincent_and_the_Grenadines", "chart": "1", "table": "", "index": "0" },
	{ "country": "San Marino", "region": "", "article": "San_Marino", "chart": "1", "table": "", "index": "0" },
	{ "country": "São Tomé & Príncipe", "region": "", "article": "São_Tomé_and_Príncipe", "chart": "1", "table": "", "index": "0" },
	{ "country": "Saudi Arabia", "region": "", "article": "Saudi_Arabia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Senegal", "region": "", "article": "Senegal", "chart": "1", "table": "", "index": "0" },
	{ "country": "Serbia", "region": "", "article": "Serbia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Seychelles", "region": "", "article": "Seychelles", "chart": "1", "table": "", "index": "0" },
	{ "country": "Sierra Leone", "region": "", "article": "Sierra_Leone", "chart": "1", "table": "", "index": "0" },
	{ "country": "Singapore", "region": "", "article": "Singapore", "chart": "1", "table": "", "index": "0" },
	{ "country": "Slovakia", "region": "", "article": "Slovakia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Slovenia", "region": "", "article": "Slovenia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Somalia", "region": "", "article": "Somalia", "chart": "1", "table": "", "index": "0" },
	{ "country": "South Africa", "region": "", "article": "South_Africa", "chart": "1", "table": "", "index": "0" },
	{ "country": "South Korea", "region": "", "article": "South_Korea", "chart": "1", "table": "", "index": "0" },
	{ "country": "South Sudan", "region": "", "article": "South_Sudan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Spain", "region": "", "article": "Spain", "chart": "1", "table": "", "index": "0" },
	{ "country": "Sri Lanka", "region": "", "article": "Sri_Lanka", "chart": "1", "table": "", "index": "0" },
	{ "country": "Sudan", "region": "", "article": "Sudan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Suriname", "region": "", "article": "Suriname", "chart": "1", "table": "", "index": "0" },
	{ "country": "Sweden", "region": "", "article": "Sweden", "chart": "1", "table": "", "index": "0" },
	{ "country": "Switzerland", "region": "", "article": "Switzerland", "chart": "1", "table": "", "index": "0" },
	{ "country": "Syria", "region": "", "article": "Syria", "chart": "1", "table": "", "index": "0" },
	{ "country": "Taiwan", "region": "", "article": "Taiwan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Tanzania", "region": "", "article": "Tanzania", "chart": "1", "table": "", "index": "0" },
	{ "country": "Thailand", "region": "", "article": "Thailand", "chart": "1", "table": "", "index": "0" },
	{ "country": "Togo", "region": "", "article": "Togo", "chart": "1", "table": "", "index": "0" },
	{ "country": "Trinidad & Tobago", "region": "", "article": "Trinidad_and_Tobago", "chart": "1", "table": "", "index": "0" },
	{ "country": "Tunisia", "region": "", "article": "Tunisia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Turkey", "region": "", "article": "Turkey", "chart": "1", "table": "", "index": "0" },
	{ "country": "Uganda", "region": "", "article": "Uganda", "chart": "1", "table": "", "index": "0" },
	{ "country": "Ukraine", "region": "", "article": "Ukraine", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Arab Emirates", "region": "", "article": "the_United_Arab_Emirates", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Bermuda", "article": "Bermuda", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Cayman Islands", "article": "the_Cayman_Islands", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Channel Islands", "article": "Channel_Islands", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Gibraltar", "article": "Gibraltar", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Isle of Man", "article": "the_Isle_of_Man", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Montserrat", "article": "Montserrat", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "", "article": "United_Kingdom", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Anguilla", "article": "Anguilla", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "British Virgin Islands", "article": "the_British_Virgin_Islands", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Turks & Caicos Islands", "article": "the_Turks_and_Caicos_Islands", "chart": "1", "table": "", "index": "0" },
	{ "country": "United Kingdom", "region": "Falkland Islands", "article": "the_Falkland_Islands", "chart": "1", "table": "", "index": "0" },
	{ "country": "United States", "region": "", "article": "United_States", "chart": "1", "table": "", "index": "0" },
	{ "country": "Uruguay", "region": "", "article": "Uruguay", "chart": "1", "table": "", "index": "0" },
	{ "country": "Uzbekistan", "region": "", "article": "Uzbekistan", "chart": "1", "table": "", "index": "0" },
	{ "country": "Vatican City", "region": "", "article": "Vatican_City", "chart": "1", "table": "", "index": "0" },
	{ "country": "Venezuela", "region": "", "article": "Venezuela", "chart": "1", "table": "", "index": "0" },
	{ "country": "Vietnam", "region": "", "article": "Vietnam", "chart": "1", "table": "", "index": "0" },
	{ "country": "Western Sahara", "region": "", "article": "Western_Sahara", "chart": "1", "table": "", "index": "0" },
	{ "country": "Yemen", "region": "", "article": "Yemen", "chart": "1", "table": "", "index": "0" },
	{ "country": "Zambia", "region": "", "article": "Zambia", "chart": "1", "table": "", "index": "0" },
	{ "country": "Zimbabwe", "region": "", "article": "Zimbabwe", "chart": "1", "table": "", "index": "0" }
];



const c19LinksUsa = [

	{ state: "Alabama", article: "Alabama", table: "0" },
	{ state: "Alaska", article: "Alaska", table: "0" },
	{ state: "American Samoa", article: "American_Samoa", chart: "??", table: "0" },
	{ state: "Arizona", article: "Arizona", table: "0" },
	{ state: "Arkansas", article: "Arkansas", table: "0" },
	{ state: "California", article: "California", table: "0" },
	{ state: "Colorado", article: "Colorado", table: "0" },
	{ state: "Connecticut", article: "Connecticut", table: "0" },
	{ state: "Delaware", article: "Delaware", table: "0" },
	{ state: "Florida", article: "Florida", table: "0" },
	{ state: "Georgia", article: "Georgia_(U.S._state)", chart: "Georgia" },
	{ state: "Guam", article: "Guam", table: "0" },
	{ state: "Hawaii", article: "Hawaii", table: "0" },
	{ state: "Idaho", article: "Idaho", table: "0" },
	{ state: "Illinois", article: "Illinois", table: "0" },
	{ state: "Indiana", article: "Indiana", table: "0" },
	{ state: "Iowa", article: "Iowa", table: "0" },
	{ state: "Kansas", article: "Kansas", table: "0" },
	{ state: "Kentucky", article: "Kentucky", table: "0" },
	{ state: "Louisiana", article: "Louisiana", table: "0" },
	{ state: "Maine", article: "Maine", table: "0" },
	{ state: "Maryland", article: "Maryland", table: "1" },
	{ state: "Massachusetts", article: "Massachusetts", table: "1" },
	{ state: "Michigan", article: "Michigan", table: "0" },
	{ state: "Minnesota", article: "Minnesota", table: "0" },
	{ state: "Mississippi", article: "Mississippi", table: "0" },
	{ state: "Missouri", article: "Missouri", table: "0" },
	{ state: "Montana", article: "Montana", table: "0" },
	{ state: "Nebraska", article: "Nebraska", table: "0" },
	{ state: "Nevada", article: "Nevada", table: "0" },
	{ state: "New Hampshire", article: "New_Hampshire", table: "0" },
	{ state: "New Jersey", article: "New_Jersey", table: "0" },
	{ state: "New Mexico", article: "New_Mexico", table: "0" },
	{ state: "New York", article: "New_York_(state)", chart: "New_York_State", table: "1" },
	{ state: "North Carolina", article: "North_Carolina", table: "0" },
	{ state: "North Dakota", article: "North_Dakota", table: "0" },
	{ state: "Northern Mariana Islands", article: "Northern_Mariana_Islands", chart: "??", table: "0" },
	{ state: "Ohio", article: "Ohio", table: "0" },
	{ state: "Oklahoma", article: "Oklahoma", table: "0" },
	{ state: "Oregon", article: "Oregon", table: "1" },
	{ state: "Pennsylvania", article: "Pennsylvania", table: "0" },
	{ state: "Puerto Rico", article: "Puerto_Rico", table: "0" },
	{ state: "Rhode Island", article: "Rhode_Island", table: "0" },
	{ state: "South Carolina", article: "South_Carolina", table: "0" },
	{ state: "South Dakota", article: "South_Dakota", table: "0" },
	{ state: "Tennessee", article: "Tennessee", table: "0" },
	{ state: "Texas", article: "Texas", table: "0" },
	{ state: "U.S. Virgin Islands", article: "the_United_States_Virgin_Islands", chart: "", table: "0" },
	{ state: "Utah", article: "Utah", table: "0" },
	{ state: "Vermont", article: "Vermont", table: "0" },
	{ state: "Virginia", article: "Virginia", table: "0" },
	{ state: "Washington", article: "Washington", chart: "Washington_State", table: "0" },
	{ state: "Washington D.C.", article: "Washington,_D.C.", table: "0" },
	{ state: "West Virginia", article: "West_Virginia", table: "0" },
	{ state: "Wisconsin", article: "Wisconsin", table: "0" },
	{ state: "Wyoming", article: "Wyoming", table: "0" }

];

