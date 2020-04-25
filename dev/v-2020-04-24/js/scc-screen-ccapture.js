


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

	THR.animate = function () { }

	THR.controls.reset();
	THR.controls.autoRotate = false;
	THR.scene.background = new THREE.Color( 0xcce0ff );

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
	THR.camera.position.x = - 120 * Math.cos( SCC.phi );
	THR.camera.position.y = - 120 * Math.sin( SCC.phi );

	requestAnimationFrame( SCC.animate );
	THR.renderer.render( THR.scene, THR.camera );
	SCC.recorder.capture( THR.renderer.domElement );
	THR.controls.update();

};


