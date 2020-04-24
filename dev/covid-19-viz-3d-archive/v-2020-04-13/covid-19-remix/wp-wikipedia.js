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

	// const place = line.region ? line.region : line.country;

	// placeJTS = JTS.rowsCases.find( row => line.country === row[ 1 ] && line.region === row[ 0 ] );

	// let num;

	// if ( placeJTS ) {

	// 	num = Number( placeJTS.pop() );
	// 	//console.log( "nim", num );
	// 	//num = "-999" : "-" : num;

	// }
	// //console.log( "", placeJTS );

	// const placeWP = place
	// 	.replace( /United/g, "the_United" )
	// 	.replace( / /g, "_" )
	// 	.replace( /New_York/, "New_York_(state)" )
	// 	.replace( /Georgia/, "Georgia_(U.S._state)" );


	DMTdivPopUp.innerHTML = `
		<div id=DMTdivIntersected>
			country: ${ line.country }<br>
			${ ( line.region ? "place: " + line.region + "<br>" : "" ) }
			cases WP: ${ Number( line.cases ).toLocaleString() }<br>
			deaths WP: ${ Number( line.deaths ).toLocaleString() }<br>
			recoveries WP: ${ isNaN( Number( line.recoveries ) ) ? "NA" : Number( line.recoveries ).toLocaleString() }<br>
			<button onclick=DMT.getMorePopUp(); >more</button></br>
		</div>
	`;

};


DMT.getMorePopUp = function () {

	//console.log( "", DMT.line );
	let cases = "NA";
	let date = "NA";

	const placeJTS = JTS.rowsCases.find( row => DMT.line.country === row[ 1 ] && DMT.line.region === row[ 0 ] );

	if ( placeJTS ) {

		cases = placeJTS[ placeJTS.length - 1 ];
		const row = JTS.rowsCases[ 0 ];
		date = row[ row.length - 1 ];

	}



	DMTdivIntersected.innerHTML += `
	<div id="DMTdivMore"  >
		<a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory" target="_blank">Global pandemic Wikipedia data</a><br>

		JHU Date: ${ date }<br>
		JHU Cases: ${ cases }<br>
		<br>
	<div id=WPdivGraph style="overflow:auto;resizable:both;">
		<img src="${ pathAssets }images/progress-indicator.gif" width=100 >
	<div>
	`;

	const place = DMT.line.region ? DMT.line.region : DMT.line.country;

	const placeWP = place
		.replace( /United/g, "the_United" )
		.replace( / /g, "_" )
		.replace( /New_York/, "New_York_(state)" )
		.replace( /Georgia/, "Georgia_(U.S._state)" );

	const url = "2020_coronavirus_pandemic_in_" + placeWP;

	fetchUrlWikipediaApiPlace( url, 0 );

};

function showLocation ( place, table ) {

	//console.log( "place", place );

	if ( place === "" ) {

		alert( "data coming soon" );

	} else {

		const url = "2020_coronavirus_pandemic_in_" + place;

		fetchUrlWikipediaApiPlace( url, table );

	}

}



function fetchUrlWikipediaApiPlace ( url, tab = 0, rowStart = 0, column = 0 ) {

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
				.replace( /\<a href(.*?)>/gi, "" );

			const parser = new DOMParser();
			const html = parser.parseFromString( html_code, "text/html" );
			//console.log( "html", html );

			const tables = html.querySelectorAll( ".wikitable,.barbox" );

			const ttab = tables[ tab ];

			if ( ! ttab ) {

				WPdivGraph.innerHTML = "There seem to be no charts or tables we can access here.\n\nTry another place";
				return;

			}

			const s = new XMLSerializer();
			const str = s.serializeToString( ttab ).replace( /\[(.*?)\]/g, "" );

			if ( WPdivGraph ) {

				WPdivGraph.innerHTML = str;
				WPdivGraph.style.maxHeight = ( window.innerHeight - DMTdivPopUp.offsetTop - WPdivGraph.offsetTop - 15 )+ "px";

			}

		} );

}
