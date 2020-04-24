

const JTS = {};

JTS.rowsCases = undefined;

JTS.init = function () {


// https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series

	//const dataJhu = "https://raw.githack.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

	const dataJhu = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

	//resetGroups();

	requestFile( dataJhu, onLoadCases );

};

function onLoadCases ( xhr ) {

	let response = xhr.target.response;

	response = response.replace( /"Korea, South"/, "South Korea" );
	response = response.replace( /US/, "United States" );
	response = response.replace( /Taiwan\*/, "Taiwan" );
	// 	.replace( /"Gambia, The"/, "The Gambia" )
	// 	.replace( /"Bahamas, The"/, "The Bahamas" );
	// .replace( /"Virgin Islands,/, "Virgin Islands");

	JTS.rowsCases = response.split( "\n" ).map( line => line.split( "," ) ).slice( 0, -1 );
	//console.log( "JTS.rowsCases", JTS.rowsCases );

	updateBars( JTS.rowsCases[ 0 ].length );

}




function updateBars ( index ) {
	//console.log( 'index ', index );

	if ( !JTS.rowsCases ) { console.log( "JTS.rowsCases", JTS.rowsCases ); }

	const heightsCases = JTS.rowsCases.slice( 1, -1 ).map( line => Number( line[ index - 1 ] ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = JTS.rowsCases.slice( 1, -1 ).map( ( line, index ) =>
		JTS.addBar( line[ 2 ], line[ 3 ], index, "blue", 0.4, heightsCases[ index ], 0, 12, 1, false ) );

	groupCasesJTS.add( ...meshesCases );

};



JTS.addBar = function ( lat, lon, index, color = "red", radius = 0.4, height = 0, offset = 0, radialSegments = 12, heightSegments = 1, openEnded = false ) {

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
	//mesh.userData.items = items;
	//mesh.name = rows[ index ][ 0 ];

	return mesh;

};