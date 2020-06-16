
/* global timeStart, scene */

const GLO = {
	globe: undefined,
	size: 50,
	url: "https://cdn.glitch.com/7af242e2-0cf2-4179-8c41-b2f2cb982c5a%2Fnatural-earth-4096-2048-col.jpg?v=1588126762356",
	urlHeightmap: "https://cdn.glitch.com/2250d667-1452-448b-8cd3-e0bdfd5adb3c%2Fbathymetry_bw_composite_2k.png?v=1588983848664"

};



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
		GLO.globe.name = "globe3d";

		scene.add( GLO.globe );

	} else {

		GLO.globe.material.displacementScale = scale;

	}

};
