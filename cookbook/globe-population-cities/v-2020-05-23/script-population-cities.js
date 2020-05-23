/* global */

const version = "2020-05-23";

const description = 
`
An online interactive 3D globe presenting the population data for 15,494 cities as curated and supplied by
<a href="https://simplemaps.com/data/world-cities " target="_blank">simplemaps.com - world-cities </a>

with real-time interactive 3D graphics in your browser using the WebGL and the 
<a href="https://threejs.org" target="_blank">Three.js</a> JavaScript library
`;

let timeStart;


function init () {

	timeStart = performance.now();

	divDescription.innerHTML = description;

	aGlitch.href = "https://glitch.com/~2020-05-08-globe-template";

	aGithub.href = 
	"https://github.com/ladybug-tools/spider-covid-19-viz-3d/tree/master/cookbook/globe-template/";
	
	aTitle.innerHTML += ` ${ version }`;
	

	THR.init();

	THR.animate();

	GLO.initGlobeWithBitmap();

	GJS.initGeoJson();

	TXT.init();

	PTS.init();

	//RAY.intersectObjects = [ ... PTS.group.children, GLO.globe ];

	RAY.addMouseMove();

	HRT.initHeart();


	const urlWorldCitiesCsv =
	"https://cdn.glitch.com/7af242e2-0cf2-4179-8c41-b2f2cb982c5a%2Fworldcities.csv";

	requestFile( urlWorldCitiesCsv, onLoadWorldCities );


	console.log( "msInit", performance.now() - timeStart );

}




function onLoadWorldCities ( response ) {

	cities = response.split( /\n/ ).map( line => line.replace( /\"/g, "" ).split( "," ) );
	//console.log( "cities", cities );

	PTS.group.add( PTS.getPoints( cities ) );

	RAY.intersectObjects = [ ... PTS.group.children, GLO.globe ];

	divTime.innerHTML = `Time to load data<br> ${ ( performance.now() - timeStart ).toLocaleString() } ms`;

}



TXT.onLoadFontRunThese = function () {

	TXT.addTextContinents();

};



// following is in place of RAY.getHtm() in script.js

RAY.getHtm = function ( intersected ) {

	const index = intersected.instanceId;

	const row0 = cities[ 0 ];
	const city = cities[ index ];
	const htm = city.map( ( item, i ) => {

		item = i === 0 ? `<a href="https://en.wikipedia.org/w/index.php?search=${ item }" target="_blank">${ item }</a>` : item;
		item = i === 9 ? ( + item ).toLocaleString() : item;
		return `${ row0[ i ] }: ${ item } `;

	} ).join( "<br>" );


	return htm;

};





////////// Matrix updates. used by PTS & TXT

function getMatrixComposed ( { radius: r = 50, latitude: lat = 0, longitude: lon = 0, sclX = 1, sclY = 1, height: sclZ = 1 } = {} ) {

	const position = latLonToXYZ( r + 0.5 * sclZ, lat, lon );
	const matrix = new THREE.Matrix4();
	const quaternion = new THREE.Quaternion().setFromRotationMatrix(
		matrix.lookAt(
			new THREE.Vector3( 0, 0, 0 ),
			position,
			new THREE.Vector3( 0, 0, 1 )
		)
	);
	const scale = new THREE.Vector3( sclX, sclY, sclZ );

	matrix.compose(
		position,
		quaternion,
		scale
	);

	return matrix;

}



function latLonToXYZ ( radius = 50, lat = 0, lon = 0 ) {

	const phi = ( ( 90 - lat ) * Math.PI ) / 180;
	const theta = ( ( 180 - lon ) * Math.PI ) / 180;
	//console.log( "lat/lon", theta, phi, index);

	const x = radius * Math.sin( phi ) * Math.cos( theta );
	const y = radius * Math.sin( phi ) * Math.sin( theta );
	const z = radius * Math.cos( phi );

	return new THREE.Vector3( - x, y, z );

}



////////// DOM utilities

// https://threejs.org/docs/#api/en/loaders/FileLoader
// set response type to JSON

function requestFile ( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

}
