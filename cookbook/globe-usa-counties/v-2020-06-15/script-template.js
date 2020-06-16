/* global */

const version = "2020-06-15";

const description = 
`
An online interactive 3D Globe designed to be forked, hacked and remixed with real-time
interactive 3D graphics in your browser using the WebGL and the 
<a href="https://threejs.org" target="_blank">Three.js</a> JavaScript library
`;

let timeStart;

function init () {

	timeStart = performance.now();

	divDescription.innerHTML = description;

	//aGlitch.href = "https://glitch.com/~2020-05-08-globe-template";

	aGithub.href = 
	"https://github.com/ladybug-tools/spider-covid-19-viz-3d/tree/master/cookbook/globe-template/";
	
	aTitle.innerHTML += ` ${ version }`;
	
	THR.init();;

	THR.animate();

	GLO.initGlobeWithBitmap();

	GJS.initGeoJson();

	JTV.root = undefined;
	JTV.json = undefined;


JTV.onLoad = function ( text ) {

	console.log( "text", text.slice( 0, 1000) );

	json = JSON.parse( text );

	JTV.root = "500 Cities";
	JTV.json =  json;
	
	data = json.data;

	places = [];


	for ( let i = 0; i < data.length; i++ ) {
		
		item = data[ i ][ 26 ];

		if ( item ) {

			lat = item[ 1 ];
			lon = item[ 2 ];

			if( ! places.includes( lat+lon) ) {
			places.push( lat+lon)

			PTS.getMesh( lat, lon) 
			//console.log( "lat", item[ 1 ], "lon", item[ 2 ] );

			}


		}


	}


	// JTH.init();
	// JTF.init();
	// //JTE.init();

	// JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );

	// const details = JTVdivJsonTree.querySelectorAll( "details" );

	// details[ 0 ].open = true;

};
	url= "../../../../500-cities.json";

	requestFile ( url, JTV.onLoad  ) ;


	PTS.getMesh()


	//TXT.init();

	//PTS.scale=false;

	//PTS.init();

	//RAY.intersectObjects = [ ... PTS.group.children, GLO.globe ];

	//RAY.addMouseMove();

	HRT.initHeart();

	console.log( "msInit", performance.now() - timeStart );

	divTime.innerHTML = `Time to load data<br> ${ ( performance.now() - timeStart ).toLocaleString() } ms`;

}



PTS.getMesh = function ( lat = 0,  lon = 0 ) {

	//const timeStart = performance.now();

	const geometry = new THREE.CylinderBufferGeometry( 0.1, 0.01, 1, 5, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeScale( - 1, - 1, - 1 ) ); // prettifies the coloring
	const material = new THREE.MeshNormalMaterial( { side: 2 } );



	const matrix = getMatrixComposed( {
		latitude: + lat,
		longitude: + lon,
		height: 5
	} );

	geometry.applyMatrix4( matrix );

	const mesh = new THREE.Mesh( geometry, material, 50 );
	//mesh.name = "instancedMesh";
	//console.log( "msPts", performance.now() - timeStart );

	THR.scene.add( mesh )

};



TXT.onLoadFontRunThese = function () {

	TXT.addTextContinents();

	TXT.addTextDataPoints( geoDataGlobalCsv );

	TXT.addTextDataPoints( geoDataRegionalCsv );

};



RAY.getHtm = function ( intersected ) {

	const country = intersected.object.userData.data[ intersected.instanceId ];
	//console.log( "country", country );

	const name = country[ 1 ] ? country[ 1 ] : country[ 0 ];

	// htm = JSON.stringify( country, null, "<br>" ).slice( 1, -1 ).replace( /[",]/g, "");

	htm = `
		<a href="https://en.wikipedia.org/wiki/${ name }" title="Go to ${ name } Wikipedia article" target="_blank">${ name }</a><br>
		${ ( + country[ 6 ] ).toLocaleString() } people
		`;

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

