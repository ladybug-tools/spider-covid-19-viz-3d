

const GLO = {};

let geoJsonArray = {};

GLO.onLoadGeoJson = function( xhr ) {

	let response = xhr.target.response;
	const file = xhr.target.responseURL.split( "/" ).pop();

	const geoJson = JSON.parse( response );
	//console.log( '', response );

	geoJsonArray[ file ] = geoJson;

	drawThreeGeo( geoJson, 50, "sphere", { color: "#888" } );

};



GLO.addLights = function() {

	THR.scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

	const pointLight = new THREE.PointLight( 0xffffff, 1 );
	pointLight.position.copy( THR.camera.position );
	THR.camera.add( pointLight );

	const lightDirectional = new THREE.DirectionalLight( 0xfffffff, 1 );
	lightDirectional.position.set( -50, -200, 100 );
	THR.scene.add( lightDirectional );

};



GLO.addGlobe = function() {

	const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

	// if ( iOS ) {

	GLO.loadGlobeBasic();


	const urlJsonStatesProvinces = pathAssets + "json/ne_50m_admin_1_states_provinces_lines.geojson";

	requestFile( urlJsonStatesProvinces, GLO.onLoadGeoJson );

	const urlJsonChina = pathAssets + "json/china.geojson";

	requestFile( urlJsonChina, GLO.onLoadGeoJson );

	const urlJson = pathAssets + "json/ne_110m_admin_0_countries_lakes.geojson";

	requestFile( urlJson, GLO.onLoadGeoJson );

	// } else {

	// 	GLO.loadGlobeWithMapTextures();

	// }

};




GLO.loadGlobeBasic = function ( size = 50 ) {

	const geometry = new THREE.SphereBufferGeometry( size, 32, 32);
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	const url = "https://www.ladybug.tools/spider-covid-19-viz-3d/assets/images/natural-earth-4096-2048-col.jpg";
	var texture = new THREE.TextureLoader().load( url );

	const material = new THREE.MeshBasicMaterial( { color: 0xcce0ff, map: texture } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.name = "globe";
	THR.scene.add( mesh );

	mesh.matrixAutoUpdate = false;

};



GLO.loadGlobeWithMapTextures = function() {

	const radius = 50;  // earth

	const pi = Math.PI, pi2 = 0.5 * Math.PI;
	const d2r = pi / 180;

	const xStart = 0;
	const yStart = 0;
	const xFinish = 16;
	const yFinish = 16;
	const zoom = 4;
	const deltaPhi = 2.0 * pi / Math.pow( 2, zoom );
	const steps = Math.floor( 18 / zoom );

	const loader = new THREE.TextureLoader();
	group2 = new THREE.Object3D();
	group2.rotation.x = pi2;
	group2.rotation.y = pi;

	for ( let y = yStart; y < yFinish; y++ ) {

		const lat1 = tile2lat( y, zoom );
		const lat2 = tile2lat( y + 1, zoom );
		const deltaTheta = ( lat1 - lat2 ) * d2r;
		const theta = pi2 - lat1 * d2r;

		for ( let x = xStart; x < xFinish; x++ ) {

			const src = "https://mt1.google.com/vt/lyrs=y&x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "https://mt1.google.com/vt/lyrs=t&x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "https://mt1.google.com/vt/lyrs=s&x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "https://mt1.google.com/vt/x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "http://b.tile.openstreetmap.org/" + zoom + "/" + x + "/" + y + ".png";
			//const src = "https://maps.wikimedia.org/osm-intl/" + zoom + "/" + x + "/" + y + ".png";
			//const src = "http://tile.stamen.com/terrain-background/" + zoom + "/" + x + "/" + y + ".jpg";
			//const src = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" + zoom + "/" + y + "/" + x  + ".jpg";
			// not const src = "http://s3.amazonaws.com/com.modestmaps.bluemarble/" + zoom + "-r" + y + "-c" + x + ".jpg";

			const texture = loader.load( src );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const geometry = new THREE.SphereBufferGeometry( radius, steps, steps, x * deltaPhi - pi, deltaPhi, theta, deltaTheta );
			const mesh = new THREE.Mesh( geometry, material );

			group2.add( mesh );
			group2.name = "globe";

		}
	}

	THR.scene.add( group2 );

		function tile2lat( y, z ) {

			const n = pi - 2 * pi * y / Math.pow( 2, z );
			return ( 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );

		}

};



GLO.toggleSkyBox = function ( boole = true ) {

	THR.scene.background = boole ?
		new THREE.CubeTextureLoader()
			.setPath( "https://www.ladybug.tools/spider-covid-19-viz-3d/cube-textures/" )
			.load( [ "f1.jpg", "f2.jpg", "f3.jpg", "f4.jpg", "f5.jpg", "f6.jpg" ] )
		:
		null;

};
