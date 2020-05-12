/* global THREE, aSource, svgOcticon, spnIcon, sTitle, sVersion, divDescription,divLog, geoDataGlobalCsv, geoDataRegionalCsv, CCapture */



const HRT = {}; // Easter egg

const SCC = {}; // screen capture to a WebM video

let timeStart;
let mesh, axesHelper, lightDirectional, cameraHelper;
let renderer, camera, controls, scene;




function initThreejs () {

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

}



function onStart () {

	controls.autoRotate = false;

	window.removeEventListener( "keyup", onStart );
	renderer.domElement.removeEventListener( "click", onStart );
	renderer.domElement.removeEventListener( "touchstart", onStart );
	renderer.domElement.removeEventListener( "touchmove", onStart );
	renderer.domElement.removeEventListener( "touchend", onStart );

}



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



////////// Screen CCapture ~ Thank you Jaume Sanchez https://github.com/spite/ccapture.js/

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



////////// DOM utilities

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

		const stats = new Stats();
		const statsDom = document.body.appendChild( stats.dom );
		statsDom.style.left = "";
		statsDom.style.right = "0px";
		requestAnimationFrame( function loop () {

			stats.update(); requestAnimationFrame( loop );

		} );

	};

	script.src = "https://raw.githack.com/mrdoob/stats.js/master/build/stats.min.js";


	const render = renderer.info.render;

	//divInfo.classList.add( "navText" );
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
