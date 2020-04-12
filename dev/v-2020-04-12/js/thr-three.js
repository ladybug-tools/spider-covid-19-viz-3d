/* globals THREE, divContents */
// jshint esversion: 6
// jshint loopfunc: true

//let mesh, meshGroup;

let THR = {};

THR.group = new THREE.Group();


THR.init = function () {

	const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 120, 0, 65 );
	camera.up.set( 0, 0, 1 );

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcce0ff );
	//scene.fog = new THREE.Fog( 0xcce0ff, 9999, 999999 );
	scene.add( camera );

	//const distance = 25;
	//scene.fog.near = distance * 1.8;
	//scene.fog.far = distance * 2.5;

	const renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	// renderer.outputEncoding = THREE.sRGBEncoding;
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	document.body.appendChild( renderer.domElement );

	const controls = new THREE.OrbitControls( camera, renderer.domElement );
	//controls.maxPolarAngle = Math.PI * 0.5;
	controls.enablePan = false;
	controls.minDistance = 30;
	controls.maxDistance = 300;
	controls.autoRotate = true;

	window.addEventListener( 'resize', THR.onWindowResize, false );
	window.addEventListener( 'orientationchange', THR.onWindowResize, false );

	window.addEventListener( 'keydown', THR.onStart );

	renderer.domElement.addEventListener( 'mousedown', THR.onStart );
	//renderer.domElement.addEventListener( 'mousemove', THR.onStart );
	renderer.domElement.addEventListener( 'wheel', THR.onStart );

	renderer.domElement.addEventListener( 'touchstart', THR.onStart );
	renderer.domElement.addEventListener( 'touchmove', THR.onStart );
	renderer.domElement.addEventListener( 'touchend', THR.onStart );

	THR.camera = camera; THR.scene = scene; THR.renderer = renderer; THR.controls = controls;

	let event = new Event( "onloadthree", { "bubbles": true, "cancelable": false, detail: true } );

	//window.addEventListener( "onloadthree", THR.onLoad, false );

	window.dispatchEvent( event );

};



THR.onLoad = function ( event ) {

	console.log( 'event thr', event );

};


THR.onStart = function () {

	THR.controls.autoRotate = false;

	window.removeEventListener( 'keydown', THR.onStart );
	renderer.domElement.removeEventListener( 'mousedown', THR.onStart );
	renderer.domElement.removeEventListener( 'mousemove', THR.onStart );
	renderer.domElement.removeEventListener( 'wheel', THR.onStart );

	renderer.domElement.removeEventListener( 'touchstart', THR.onStart );
	renderer.domElement.removeEventListener( 'touchmove', THR.onStart );
	renderer.domElement.removeEventListener( 'touchend', THR.onStart );

	DMT.init();

};



THR.latLonToXYZ = function ( radius, lat, lon ) {

	const pi2 = Math.PI / 2;

	const theta = Number( lat ) * Math.PI / 180;
	const phi = Number( lon ) * Math.PI / 180;
	//console.log( "lat/lon", theta, phi, index);

	const x = radius * Math.sin( theta + pi2 ) * Math.cos( phi );
	const y = radius * Math.sin( theta + pi2 ) * Math.sin( phi );
	const z = radius * Math.cos( theta - pi2 );

	return new THREE.Vector3( x, y, z );

};



THR.drawPlacard = function ( text = [ "abc", "testing 123" ], scale = "0.2", color = 20, x = 20, y = 20, z = 20 ) {

	// [text], scale, color, x, y, z )
	const placard = new THREE.Object3D();
	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );

	const texture = canvasMultilineText( text, { backgroundColor: color } );
	//const spriteMaterial = new THREE.SpriteMaterial( { map: texture, opacity: 0.9, transparent: true } );
	const spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
	const sprite = new THREE.Sprite( spriteMaterial );
	sprite.position.set( x, y, z );
	sprite.scale.set( scale * texture.image.width, scale * texture.image.height );

	const geometry = new THREE.Geometry();
	geometry.vertices = [ v( 0, 0, z ), v( x, 0, z ) ];
	const material = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );
	const line = new THREE.Line( geometry, material );

	placard.add( sprite );

	return placard;


	function canvasMultilineText ( textArray, parameters ) {

		parameters = parameters || {};

		const canvas = document.createElement( 'canvas' );
		const context = canvas.getContext( '2d' );
		let width = parameters.width ? parameters.width : 0;
		const font = parameters.font ? parameters.font : '48px monospace';
		const color = parameters.backgroundColor ? parameters.backgroundColor : 120;

		if ( typeof textArray === 'string' ) textArray = [ textArray ];

		context.font = font;

		for ( let i = 0; i < textArray.length; i++ ) {

			width = context.measureText( textArray[ i ] ).width > width ? context.measureText( textArray[ i ] ).width : width;

		}

		canvas.width = width + 20;
		canvas.height = parameters.height ? parameters.height : textArray.length * 60;

		context.fillStyle = 'hsl( ' + color + ', 80%, 50% )';
		context.fillRect( 0, 0, canvas.width, canvas.height );

		context.lineWidth = 1;
		context.strokeStyle = '#000';
		context.strokeRect( 0, 0, canvas.width, canvas.height );

		context.fillStyle = '#000';
		context.font = font;

		for ( let i = 0; i < textArray.length; i++ ) {

			context.fillText( textArray[ i ], 10, 48 + i * 60 );

		}

		const texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		return texture;

	}

};



THR.onWindowResize = function () {

	THR.camera.aspect = window.innerWidth / window.innerHeight;
	THR.camera.updateProjectionMatrix();

	THR.renderer.setSize( window.innerWidth, window.innerHeight );

	//THR.controls.handleResize(); // Trackball only

	//console.log( 'onWindowResize  window.innerWidth', window.innerWidth );

};



THR.animate = function () {

	requestAnimationFrame( THR.animate );
	THR.renderer.render( THR.scene, THR.camera );
	THR.controls.update();

};