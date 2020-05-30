
const HRT = {}; // Easter egg

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

