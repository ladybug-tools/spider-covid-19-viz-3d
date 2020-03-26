function onLoadGeoJson ( xhr ) {

	let response = xhr.target.response;

	const geoJson = JSON.parse( response );
	//console.log( '', response );

	geoJsonArray.push( geoJson );

	drawThreeGeo( geoJson, 50, 'sphere', { color: "#888" } );

}



function addLights () {

	scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

	const pointLight = new THREE.PointLight( 0xffffff, 1 );
	pointLight.position.copy( camera.position );
	camera.add( pointLight );

	const lightDirectional = new THREE.DirectionalLight( 0xfffffff, 1 );
	lightDirectional.position.set( -50, -200, 100 );
	scene.add( lightDirectional );

}



function addGlobe ( size = 50 ) {

	const geometry = new THREE.SphereGeometry( size, 50, 25 );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	const url = pathAssets + "images/earth_atmos_4096.jpg";
	var texture = new THREE.TextureLoader().load( url );

	const material = new THREE.MeshBasicMaterial( { color: 0xcce0ff, map: texture } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.name = "globe";
	scene.add( mesh );

}



function addSkyBox () {

	scene.background = new THREE.CubeTextureLoader()
		.setPath( pathAssets + "cube-textures/" )
		.load( [ 'f1.jpg', 'f2.jpg', 'f3.jpg', 'f4.jpg', 'f5.jpg', 'f6.jpg' ] );

}
