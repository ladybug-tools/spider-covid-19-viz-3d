
////////// Screen CCapture ~ Thank you Jaume Sanchez https://github.com/spite/ccapture.js/

const SCC = {}; // screen capture to a WebM video


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
