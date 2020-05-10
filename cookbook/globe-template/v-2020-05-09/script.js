/* global THREE, aSource, svgOcticon, spnIcon, sTitle, sVersion, divDescription,divLog, geoDataGlobalCsv, geoDataRegionalCsv, CCapture */


aSource.href =
		"https://github.com/ladybug-tools/spider-covid-19-viz-3d/tree/master/cookbook/globe-template";

svgOcticon = `<svg height="18" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="18" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>`;
spnIcon.innerHTML = svgOcticon;

sTitle.innerHTML = document.title;
const version = document.head.querySelector( "[ name=version ]" );
sVersion.innerHTML = version ? version.content : "";

divDescription.innerHTML = document.head.querySelector(
	"[ name=description ]"
).content;

const GLO = {
	globe: undefined,
	size: 50,
	url: "https://cdn.glitch.com/7af242e2-0cf2-4179-8c41-b2f2cb982c5a%2Fnatural-earth-4096-2048-col.jpg?v=1588126762356",
	urlHeightmap: "https://cdn.glitch.com/2250d667-1452-448b-8cd3-e0bdfd5adb3c%2Fbathymetry_bw_composite_2k.png?v=1588983848664"

	 };

const GJS = { groupGeoJson: undefined }; // GeoJson lines

const PTS = {}; // data points. Each point is displayed as a cylindrical 3D object rising perpendicularly from the surface of the globe.

const TXT = {}; // three.js 3D text

const RAY = { // three.js mouse interaction with scene

	raycaster: new THREE.Raycaster(),
	mouse: new THREE.Vector2()

};

const HRT = {}; // Easter egg

const SCC = {}; // screen capture to a WebM video

let timeStart;
let mesh, axesHelper, lightDirectional, cameraHelper;
let renderer, camera, controls, scene;

// at bottom of this file:
// init();
// animate();



function init () {

	timeStart = performance.now();

	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set( 150, 0, 50 );
	camera.up.set( 0, 0, 1 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcce0ff );
	scene.add( camera );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//renderer.outputEncoding = THREE.sRGBEncoding;

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 40;
	controls.maxDistance = 500;
	controls.autoRotate = true;
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.enablePan = false;
	controls.autoRotateSpeed = 5;

	axesHelper = new THREE.AxesHelper( 100 );
	axesHelper.name = "axesHelper";
	scene.add( axesHelper );

	addLights();

	window.addEventListener( "resize", onWindowResize, false );
	window.addEventListener( "orientationchange", onWindowResize, false );

	window.addEventListener( "keyup", onStart );
	renderer.domElement.addEventListener( "click", onStart );
	renderer.domElement.addEventListener( "touchstart", onStart );
	renderer.domElement.addEventListener( "touchmove", onStart );
	renderer.domElement.addEventListener( "touchend", onStart );

	GLO.initGlobeWithBitmap();

	GJS.initGeoJson();

	PTS.init();

	TXT.init();

	HRT.initHeart();

	RAY.addMouseMove();

	console.log( "msInit", performance.now() - timeStart );

}



function onStart () {

	controls.autoRotate = false;

	window.removeEventListener( "keyup", onStart );
	renderer.domElement.removeEventListener( "click", onStart );
	renderer.domElement.removeEventListener( "touchstart", onStart );
	renderer.domElement.removeEventListener( "touchmove", onStart );
	renderer.domElement.removeEventListener( "touchend", onStart );

}



//////////

GLO.initGlobeWithBitmap = function () {

	scene.remove( GLO.globe );

	const geometry = new THREE.SphereBufferGeometry( GLO.size, 32, 32 );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	const loader = new THREE.TextureLoader();
	const texture = loader.load( GLO.url );
	const material = new THREE.MeshPhongMaterial( {
		map: texture
	} );

	GLO.globe = new THREE.Mesh( geometry, material );
	GLO.globe.matrixAutoUpdate = false;
	GLO.globe.name = "globeFlat";

	scene.add( GLO.globe );

	console.log( "msGlo", performance.now() - timeStart );

};



GLO.setGlobeElevation3D = function ( value = 50 ) {

	const scale = + value / 5;

	if ( GLO.globe.name === "globeFlat" ) {

		scene.remove( GLO.globe );

		const geometry = new THREE.SphereBufferGeometry( GLO.size, 2048, 1024 );
		geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

		const loader = new THREE.TextureLoader();
		const texture = loader.load( GLO.url );
		const heightmap = loader.load( GLO.urlHeightmap, );
		const material = new THREE.MeshPhongMaterial( {
			map: texture,
			displacementMap: heightmap,
			displacementScale: scale
		} );

		GLO.globe = new THREE.Mesh( geometry, material );
		GLO.globe.matrixAutoUpdate = false;
		GLO.globe.name = "globe";

		scene.add( GLO.globe );

	} else {

		GLO.globe.material.displacementScale = scale;

	}

};



//////////

GJS.initGeoJson = function () {

	scene.remove( GJS.groupGeoJson );
	GJS.groupGeoJson = new THREE.Group();
	GJS.groupGeoJson.name = "geoJson";

	const pathGeoJson = "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/";

	const urlJsonCountries = pathGeoJson + "ne_50m_admin_0_scale_rank.geojson";

	requestFile( urlJsonCountries, GJS.onLoadGeoJson );

	const urlJsonRegions = pathGeoJson + "ne_50m_admin_1_states_provinces_lines.geojson";

	requestFile( urlJsonRegions, GJS.onLoadGeoJson );

	scene.add( GJS.groupGeoJson );

	console.log( "msGeoJ", performance.now() - timeStart );

};



GJS.onLoadGeoJson = function ( string ) {

	const json = JSON.parse( string );

	let geometries = json.features.map( feature => feature.geometry );
	//console.log( "geometries", geometries );

	let points = geometries.flatMap( geometry => {

		if ( [ "MultiPolygon", "Polygon", "MultiLineString" ].includes( geometry.type ) ) {

			return [ ... geometry.coordinates ];

		} else if ( geometry.type === "LineString" ) {

			return [ geometry.coordinates ];

		}

	} );
	//console.log( "points", points );

	const vertices = points.map( pairs => pairs.map( pair => latLonToXYZ( 50, pair[ 1 ], pair[ 0 ] ) ) );
	//console.log( "vertices", vertices );

	const line = GJS.addLineSegments( vertices );

	GJS.groupGeoJson.add( line );

};



GJS.addLineSegments = function ( segments ) {

	//console.log( "segments", segments );

	const geometry = new THREE.BufferGeometry();

	const positions = segments.flatMap( vertices =>

		vertices.slice( 0, - 1 ).flatMap( ( v0, i ) => {

			const v1 = vertices[ i + 1 ];
			return [ v0.x, v0.y, v0.z, v1.x, v1.y, v1.z ];

		} )

	);

	geometry.setAttribute( "position", new THREE.Float32BufferAttribute( positions, 3 ) );

	const material = new THREE.LineBasicMaterial( { color: 0x000ff } );

	return new THREE.LineSegments( geometry, material );

};



//////////

PTS.init = function () {

	scene.remove( PTS.group );

	PTS.group = new THREE.Group();
	PTS.group.name = "instances";

	PTS.addPoints( geoDataGlobalCsv );

	PTS.addPoints( geoDataRegionalCsv );

	scene.add( PTS.group );

};



PTS.addPoints = function ( countries = geoDataGlobalCsv ) {

	//const timeStart = performance.now();

	const geometry = new THREE.CylinderBufferGeometry( 0.6, 0.1, 1, 5, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeScale( - 1, - 1, - 1 ) ); // prettifies the coloring
	const material = new THREE.MeshNormalMaterial( { side: 2 } );

	const mesh = new THREE.InstancedMesh( geometry, material, countries.length );
	mesh.name = "instancedMesh";
	mesh.userData.data = countries;

	countries.forEach( ( country, i ) => {

		const matrix = getMatrixComposed( {
			latitude: + country[ 2 ],
			longitude: + country[ 3 ],
			height: 0.0000001 * country[ 6 ]
		} );

		mesh.setMatrixAt( i, matrix );

	} );

	PTS.group.add( mesh );

	console.log( "msPts", performance.now() - timeStart );

};



//////////

TXT.group = new THREE.Group();
TXT.font = undefined;

TXT.init = function () {

	const loader = new THREE.FontLoader();

	const urlFont =
			"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r115/examples/fonts/helvetiker_regular.typeface.json";

	loader.load( urlFont, fnt => {

		TXT.font = fnt;

		scene.remove( TXT.group );

		TXT.group = new THREE.Group();
		TXT.group.name = "txtgroup";

		TXT.addTextContinents();

		TXT.addTextDataPoints( geoDataGlobalCsv );

		TXT.addTextDataPoints( geoDataRegionalCsv );

		scene.add( TXT.group );

		console.log( "msTxtAll", performance.now() - timeStart );

	} );

};



TXT.addTextContinents = function () {

	TXT.addSimpleText( {
		text: "Africa",
		color: 0x0000,
		radius: 70,
		latitude: "0",
		longitude: "0"
	} );
	TXT.addSimpleText( {
		text: "Europe",
		color: 0x0085c7,
		radius: 70,
		latitude: "50",
		longitude: "50"
	} );
	TXT.addSimpleText( {
		text: "Asia",
		color: 0xf4c300,
		radius: 75,
		latitude: "20",
		longitude: "130"
	} );
	TXT.addSimpleText( {
		text: "Oceania",
		color: 0x009f3d,
		radius: 75,
		latitude: "-10",
		longitude: "160"
	} );
	TXT.addSimpleText( {
		text: "Americas",
		color: 0xdf0024,
		radius: 70,
		latitude: "0",
		longitude: "-100"
	} );

	console.log( "msTxtCts", performance.now() - timeStart );

};



TXT.addSimpleText = function ( {
	text = "Hello, World!\nThree.js\nabc 123",
	color = 0x006699,
	size = 3,
	radius = 70,
	latitude = 0,
	longitude = 0
} = {} ) {

	const shapes = TXT.font.generateShapes( text, size );

	const matrix = getMatrixComposed( { radius, latitude, longitude } );

	const geometry0 = new THREE.ShapeBufferGeometry( shapes );
	geometry0.computeBoundingBox();
	const xMid = - 0.5 * geometry0.boundingBox.getSize( new THREE.Vector3() ).x;
	geometry0.translate( xMid, 0, 0 );

	geometry1 = geometry0
		.clone()
		.applyMatrix4( new THREE.Matrix4().makeRotationY( 0.5 * Math.PI ) )
		.applyMatrix4( matrix );

	const material1 = new THREE.MeshBasicMaterial( {
		color: 0xff0000,
		opacity: 0.9,
		transparent: true
	} );

	const text1 = new THREE.Mesh( geometry1, material1 );

	const geometry2 = geometry0.clone()
		.applyMatrix4( new THREE.Matrix4().makeRotationY( - 0.5 * Math.PI ) )
		.applyMatrix4( matrix );

	const material2 = new THREE.MeshBasicMaterial( {
		color: color,
		opacity: 0.9,
		transparent: true
	} );

	const text2 = new THREE.Mesh( geometry2, material2 );

	TXT.group.add( text1, text2 );

};


TXT.addTextDataPoints = function ( places ) {

	const geometriesTxt = [];

	places.forEach( place => {

		const txt = place[ 1 ] ? place[ 1 ] : place[ 0 ];
		const siz = place[ 1 ] ? 0.7 : 1.0;
		const shapes = TXT.font.generateShapes( txt, siz );
		const geometryTxt0 = new THREE.ShapeBufferGeometry( shapes );
		geometryTxt0.computeBoundingBox();
		const xSize = geometryTxt0.boundingBox.getSize( new THREE.Vector3() ).x;

		const matrixTxt = getMatrixComposed( {
			radius: 51 + 0.0000001 * place[ 6 ],
			latitude: + place[ 2 ],
			longitude: + place[ 3 ]
		} );

		const geometryTxt1 = geometryTxt0.clone()
			.translate( - xSize, 0, 0 )
			.applyMatrix4( new THREE.Matrix4().makeRotationY( - 0.5 * Math.PI ) )
			.applyMatrix4( matrixTxt );

		const geometryTxt2 = geometryTxt0.clone()
			.applyMatrix4( new THREE.Matrix4().makeRotationY( 0.5 * Math.PI ) )
			.applyMatrix4( matrixTxt );

		geometriesTxt.push( geometryTxt1, geometryTxt2 );

	} );

	const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesTxt );
	const materialTxt = new THREE.MeshBasicMaterial( { color: "yellow", side: 0 } );
	const meshTxt = new THREE.Mesh( mergedGeometry, materialTxt );

	TXT.group.add( meshTxt );

	console.log( "msTxtPts", performance.now() - timeStart );

};



////////// raycasting

RAY.addMouseMove = function () {

	renderer.domElement.addEventListener( "mousemove", RAY.onMouseMove );
	renderer.domElement.addEventListener( "touchstart", RAY.onMouseMove );
	renderer.domElement.addEventListener( "touchmove", RAY.onMouseMove );

	//divInfo.innerHTML = "";

};



RAY.onMouseMove = function ( event ) {

	if ( event.type === "touchmove" || event.type === "touchstart" ) {

		event.clientX = event.touches[ 0 ].clientX;
		event.clientY = event.touches[ 0 ].clientY;

	}

	RAY.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	RAY.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	RAY.raycaster.setFromCamera( RAY.mouse, camera );

	let intersects = RAY.raycaster.intersectObjects( [ ...PTS.group.children, GLO.globe ] );

	if ( intersects.length ) {

		const intersected = intersects[ 0 ];

		if ( intersected.instanceId ) {

			//console.log( "int", intersected );

			const country = intersected.object.userData.data[ intersected.instanceId ];
			//console.log( "country", country );

			divLog.hidden = false;
			divLog.innerHTML = RAY.getHtm( country );
			divLog.style.left = event.clientX + "px";
			divLog.style.top = event.clientY + "px";

			renderer.domElement.addEventListener( "click", RAY.onClick );

		}


	} else {

		intersected = null;

		if ( [ "touchstart", "touchmove" ].includes( event.type ) ) {

			divLog.hidden = true;

		}

	}

};



RAY.onClick = function () {

	divLog.hidden = true;

	renderer.domElement.removeEventListener( "click", RAY.onClick );

};



RAY.getHtm = function ( country ) {

	const name = country[ 1 ] ? country[ 1 ] : country[ 0 ];
	//JSON.stringify( country, null, "<br>" ).slice( 1, -1 ).replace( /[",]/g, "");

	htm = `
		<a href="https://en.wikipedia.org/wiki/${ name }" target="_blank">${ name }</a><br>
		${ ( + country[ 6 ] ).toLocaleString() } people
		`;

	return htm;

};


////////// Easter egg

HRT.initHeart = function () {

	const x = 0, y = 0;

	const heartShape = new THREE.Shape() // From http://blog.burlock.org/html5/130-paths
		.moveTo( x + 25, y + 25 )
		.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y )
		.bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 )
		.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 )
		.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 )
		.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y )
		.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

	const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 3, bevelThickness: 1 };

	const geometry = new THREE.ExtrudeBufferGeometry( heartShape, extrudeSettings );

	const heart = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xf00000 } ) );
	heart.position.set( - 5, 0, 10 );
	heart.rotation.set( - 0.5 * Math.PI, 0, 0 );
	heart.scale.set( 0.2, 0.2, 0.2 );
	//heart.instanceId = 999;
	scene.add( heart );

};



////////// Screen CCapture ~ Thank you Jaume Sancchez https://github.com/spite/ccapture.js/

SCC.frames = 240;
SCC.delta = ( 2 * Math.PI ) / ( SCC.frames - 1 );
SCC.phi = Math.PI;
SCC.radius = 120;

SCC.init = function () {

	GLO.loadGlobeWithBitmap(
		"https://cdn.glitch.com/7af242e2-0cf2-4179-8c41-b2f2cb982c5a%2Fnat-earth-800.jpg?v=1588217961784"
	);

	SCC.CCapture = document.body.appendChild(
		document.createElement( "script" )
	);
	SCC.CCapture.onload = SCC.onLoadScript;
	SCC.CCapture.src =
			"https://raw.githack.com/spite/ccapture.js/master/build/CCapture.all.min.js";

};



SCC.onLoadScript = function () {

	animate = function () { };

	controls.reset();
	controls.autoRotate = false;
	scene.background = new THREE.Color( 0xcce0ff );

	SCC.recorder = new CCapture( {
		verbose: false,
		display: true,
		framerate: 20,
		quality: 99,
		format: "webm",
		timeLimit: 100,
		frameLimit: SCC.frames,
		autoSaveTime: 0,
		name: "globe"
	} );

	SCC.animate();

	SCC.recorder.start();

};



SCC.animate = function () {

	SCC.phi -= SCC.delta;
	camera.position.x = - SCC.radius * Math.cos( SCC.phi );
	camera.position.y = - SCC.radius * Math.sin( SCC.phi );

	requestAnimationFrame( SCC.animate );
	renderer.render( scene, camera );
	SCC.recorder.capture( renderer.domElement );
	controls.update();

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




//////////

function requestFile ( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

}



////////// three.js



function addLights () {

	//scene.add( new THREE.AmbientLight( 0x404040 ) );
	scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

	const pointLight = new THREE.PointLight( 0xffffff, 1 );
	pointLight.position.copy( camera.position );
	camera.add( pointLight );

	// lightDirectional = new THREE.DirectionalLight( 0xdffffff, 0 );
	// lightDirectional.position.set( -50, -200, 100 );
	// scene.add( lightDirectional );

}



function setStats () {

	const script = document.head.appendChild( document.createElement( "script" ) );
	script.onload = () => {

		const stats = new Stats(); document.body.appendChild( stats.dom );
		requestAnimationFrame( function loop () {

			stats.update(); requestAnimationFrame( loop );

		} );

	};

	script.src = "https://raw.githack.com/mrdoob/stats.js/master/build/stats.min.js";


	const render = renderer.info.render;

	divInfo.classList.add( "navText" );
	divInfo.innerHTML = `
		Renderer<br>
		Calls: ${render.calls }<br>
		Triangles: ${render.triangles.toLocaleString() }<br>
		`;

}



function onWindowResize () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	//console.log( 'onWindowResize  window.innerWidth', window.innerWidth );

}



function animate () {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();

}


init();
animate();
