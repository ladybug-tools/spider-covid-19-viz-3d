


const SCC = {};

SCC.frames = 240;

SCC.delta = 2 * Math.PI / SCC.frames;
SCC.phi = 0;


SCC.init = function () {

	SCC.CCapture = document.body.appendChild( document.createElement( 'script' ) );
	SCC.CCapture.onload = SCC.onLoadScript;
	SCC.CCapture.src = "https://raw.githack.com/spite/ccapture.js/master/build/CCapture.all.min.js";

};


SCC.onLoadScript = function () {

	function animate () { }

	controls.reset();
	controls.autoRotate = false;

	SCC.recorder = new CCapture( {
		verbose: false,
		display: true,
		framerate: 30,
		quality: 50,
		format: 'webm',
		timeLimit: 24,
		frameLimit: SCC.frames,
		autoSaveTime: 0,
		name: "globe"
	} );

	SCC.animate();

	SCC.recorder.start();

};



SCC.animate = function() {

	SCC.phi -= SCC.delta
	camera.position.x = - 200 * Math.cos( SCC.phi );
	camera.position.y = - 200 * Math.sin( SCC.phi );

	requestAnimationFrame( SCC.animate );
	renderer.render( scene, camera );
	SCC.recorder.capture(renderer.domElement);
	controls.update();

};


