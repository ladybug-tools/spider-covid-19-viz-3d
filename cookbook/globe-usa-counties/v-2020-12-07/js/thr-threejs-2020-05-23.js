
let axesHelper, lightDirectional, cameraHelper;
let renderer, camera, controls, scene;


const THR = {};


THR.init = function () {


	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set(-20, -80, 65);
	camera.up.set(0, 0, 1);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcce0ff);
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	//renderer.outputEncoding = THREE.sRGBEncoding;

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 40;
	controls.maxDistance = 500;
	//controls.autoRotate = true;
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.enablePan = false;
	controls.autoRotateSpeed = 5;

	axesHelper = new THREE.AxesHelper(100);
	axesHelper.name = "axesHelper";
	scene.add(axesHelper);

	THR.addLights();

	window.addEventListener("resize", THR.onWindowResize, false);
	window.addEventListener("orientationchange", THR.onWindowResize, false);

	window.addEventListener("keyup", THR.onStart);
	renderer.domElement.addEventListener("click", THR.onStart);
	renderer.domElement.addEventListener("touchstart", THR.onStart);
	renderer.domElement.addEventListener("touchmove", THR.onStart);
	renderer.domElement.addEventListener("touchend", THR.onStart);

	THR.renderer = renderer; THR.camera = camera; THR.controls = controls; THR.scene = scene;

};



THR.onStart = function () {

	controls.autoRotate = false;

	window.removeEventListener("keyup", THR.onStart);
	renderer.domElement.removeEventListener("click", THR.onStart);
	renderer.domElement.removeEventListener("touchstart", THR.onStart);
	renderer.domElement.removeEventListener("touchmove", THR.onStart);
	renderer.domElement.removeEventListener("touchend", THR.onStart);

};


////////// three.js

THR.addLights = function () {

	//scene.add( new THREE.AmbientLight( 0x404040 ) );
	scene.add(new THREE.AmbientLight(0xaaaaaa));

	const pointLight = new THREE.PointLight(0xffffff, 1);
	pointLight.position.copy(camera.position);
	camera.add(pointLight);

	// lightDirectional = new THREE.DirectionalLight( 0xdffffff, 0 );
	// lightDirectional.position.set( -50, -200, 100 );
	// scene.add( lightDirectional );

};



THR.setStats = function () {

	const script = document.head.appendChild(document.createElement("script"));
	script.onload = () => {

		const stats = new Stats();
		const statsDom = document.body.appendChild(stats.dom);
		statsDom.style.left = "";
		statsDom.style.right = "0px";
		requestAnimationFrame(function loop() {

			stats.update(); requestAnimationFrame(loop);

		});

	};

	script.src = "https://mrdoob.github.io/stats.js/build/stats.min.js";


	const render = renderer.info.render;

	divInfo.innerHTML = `
	<p>
	Renderer<br>
	Calls: ${render.calls}<br>
	Triangles: ${render.triangles.toLocaleString()}<br>
	</p>
	`;

};



THR.onWindowResize = function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	//console.log( 'onWindowResize  window.innerWidth', window.innerWidth );

};



THR.animate = function () {

	requestAnimationFrame(THR.animate);
	renderer.render(scene, camera);
	controls.update();

};
