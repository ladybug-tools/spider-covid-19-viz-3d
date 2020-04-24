'use strict';
/* global THREE */
/* global CCapture */
/* eslint-disable init-declarations */

let renderer;
let scene;
let camera;
let sphere;

const recorder = new CCapture({
	verbose: false,
	display: true,
	framerate: 60,
	quality: 100,
	format: 'webm',
	timeLimit: 4,
	frameLimit: 0,
	autoSaveTime: 0
});


function render(){
	sphere.rotation.x += 0.005;
	sphere.rotation.y += 0.005;
	renderer.render(scene, camera);
	recorder.capture(renderer.domElement);
	requestAnimationFrame(render);
}


function resize(width, height){
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}


function setupButtons(){
	const $start = document.getElementById('start');
	const $stop = document.getElementById('stop');
	$start.addEventListener('click', e => {
		e.preventDefault();
		recorder.start();
		$start.style.display = 'none';
		$stop.style.display = 'block';
	}, false);

	$stop.addEventListener('click', e => {
		e.preventDefault();
		recorder.stop();
		$stop.style.display = 'none';
		recorder.save();
	}, false);
}


function setupScene(width, height){
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);
	camera.position.set(0, 0, 8);

	const light0 = new THREE.PointLight(0xffffff, 1, 0);
	light0.position.set(0, 200, 0);
	scene.add(light0);

	const light1 = new THREE.PointLight(0xffffff, 1, 0);
	light1.position.set(100, 200, 100);
	scene.add(light1);

	const light2 = new THREE.PointLight(0xffffff, 1, 0);
	light2.position.set(-100, -200, -100);
	scene.add(light2);

	scene.add(new THREE.AmbientLight(0x000000));

	sphere = new THREE.Mesh(
		new THREE.SphereGeometry(5, 16, 16),
		new THREE.MeshPhongMaterial({
			color: 0x156289,
			emissive: 0x072534,
			side: THREE.DoubleSide,
			flatShading: true
		})
	);
	scene.add(sphere);
}


function start(width, height){
	setupScene(width, height);
	setupButtons();
	resize(width, height);
	render();
}


start(600, 400);