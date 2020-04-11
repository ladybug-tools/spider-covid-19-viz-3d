// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THR, resetGroups , THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */
/* globals */
// jshint esversion: 6
// jshint loopfunc: true

const WP = {};

WP.cors = "https://cors-anywhere.herokuapp.com/";

WP.api = "https://en.wikipedia.org/w/api.php?";

WP.query = "action=parse&format=json&page=";

WP.articleUsa = "Template:2019–20_coronavirus_pandemic_data/United_States_medical_cases_by_state";

WP.articleGlobal = "Template:2019–20_coronavirus_pandemic_data";

WP.init = function () {

	resetGroups();

	const timeStartAll = performance.now();

	WP.getPandemicData(c19GeoDataUsa, WP.articleUsa );

	WP.getPandemicData( c19GeoDataGlobal, WP.articleGlobal );

	console.log( "time start all", performance.now() - timeStartAll  );

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

	const vals = Array.from( trs ).slice( 2, -2 ).map( tr => tr.innerText.trim().replace( /\[(.*?)\]/g, "" ).split( "\n" ) ).sort();
	//console.log( 'vals', vals );

	if ( c19GeoData === c19GeoDataUsa ) {

		WP.parseUsa( vals );

	} else {

		WP.parseGlobal( vals );

	}

};



WP.parseUsa = function ( vals ) {

	c19GeoDataUsa.forEach( state => {

		const find = vals.find( items => items[ 0 ] === state.region );

		state.cases = find[ 2 ].replace( /,/g, "" );
		state.deaths = find[ 4 ].replace( /,/g, "" );
		state.recoveries = find[ 6 ].replace( /,/g, "" );

	} );


	console.log( "time", performance.now() - WP.timeStart );

	WP.updateBars( c19GeoDataUsa );

};



WP.parseGlobal = function ( vals ) {
	//console.log( "", vals );


	vals[ 43 ][ 0 ] = "China";

	c19GeoDataGlobal.forEach( country => {

		const find = vals.find( items => items[ 0 ] === country.country && country.region === "" );

		if ( find ) {

			country.cases = find[ 2 ].replace( /,/g, "" );
			country.deaths = find[ 4 ].replace( /,/g, "" );
			country.recoveries = find[ 6 ].replace( /,/g, "" );

		} else {

			const find2 = vals.find( items => items[ 0 ] === country.region );

			if ( find2 ) {

				country.cases = find2[ 2 ].replace( /,/g, "" );
				country.deaths = find2[ 4 ].replace( /,/g, "" );
				country.recoveries = find2[ 6 ].replace( /,/g, "" );

			}

		}

	} );

	console.log( "time", performance.now() - WP.timeStart );

	WP.updateBars( c19GeoDataGlobal );

};



WP.updateBars = function ( items ) {
	//console.log( "", items );

	const heightsCases = items.map( line => Number( line.cases ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = items.map( ( line, index ) =>
	WP.addBar( line.latitude, line.longitude, items, index, "red", 0.4, heightsCases[ index ], 0, 12, 1, false ) );

	groupCases.add( ...meshesCases );


	const heightsDeaths = items.map( line => Number( line.deaths ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = items.map( ( line, index ) =>
	WP.addBar( line.latitude, line.longitude, items, index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeaths );


	const heightsRecoveries = items.map( line => Number( line.recoveries ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = items.map( ( line, index ) =>
		WP.addBar( line.latitude, line.longitude, items, index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveries.add( ...meshesRecoveries );

};


WP.addBar = function ( lat, lon, items, index, color = "red", radius = 0.4, height = 0, offset = 0, radialSegments = 12, heightSegments = 1, openEnded = false ) {

	//console.log( 'rad', radius );
	if ( !height || height === 0 ) { return new THREE.Mesh(); }

	const heightScaled = 0.05 * Math.sqrt( height );

	const p1 = THR.latLonToXYZ( 50 + ( offset + 0.5 * heightScaled ), lat, lon );
	const p2 = THR.latLonToXYZ( 100, lat, lon );

	let geometry = new THREE.CylinderGeometry( 0.2, radius, heightScaled, radialSegments, heightSegments, openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData.index = index;
	mesh.userData.items = items;
	//mesh.name = rows[ index ][ 0 ];

	return mesh;

};