
const txt = {};

groupText = new THREE.Group();



txt.init = function () {

	const loader = new THREE.FontLoader();

	const url = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r115/examples/fonts/helvetiker_regular.typeface.json";

	loader.load( url, ( fnt ) => { font = fnt; txt.addTextContinents(); } );

};



txt.addTextContinents = function () {

	THR.scene.remove( groupText );

	groupText = new THREE.Group();

	txt.addBox();

	txt.getSimpleText( { text: "Africa\n123", color: 0x0000, radius: 65, latitude: "0", longitude: "0" } );
	txt.getSimpleText( { text: "Europe", color: 0x0085C7, radius: 65, latitude: "50", longitude: "50" } );
	txt.getSimpleText( { text: "Asia", color: 0xF4C300, radius: 60, latitude: "20", longitude: "130" } );
	txt.getSimpleText( { text: "Oceania", color: 0x009F3D, latitude: "-10", longitude: "160" } );
	txt.getSimpleText( { text: "Americas", color: 0xDF0024, radius: "70", latitude: "0", longitude: "-100" } );

	THR.scene.add( groupText );

};


txt.getSimpleText = function ( {
		text = "Hello, World!\nThree.js\nabc 123",
		color = 0x006699,
		size = 5,
		radius = 70,
		latitude = 0,
		longitude = 0
	} = {} ) {

	const shapes = font.generateShapes( text, size );

	const geometry = new THREE.ShapeBufferGeometry( shapes );
	geometry.computeBoundingBox();
	const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
	geometry.translate( xMid, 0, 0 );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( 0.5 * Math.PI ) );

	const material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.8, side: 0, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );

	txt.updatePosition( mesh, radius, latitude, longitude );

	groupText.add( mesh );

	//txt.updatePosition( mesh, radius, latitude, longitude );
	mesh.lookAt( new THREE.Vector3() );
	mesh.up.set( 0, 0, 1 );

	const geometry2 = geometry.clone();
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI ) );

	material2 = new THREE.MeshBasicMaterial( { color: color, opacity: 0.8, side: 0, transparent: true } );

	const mesh2 = new THREE.Mesh( geometry2, material2 );

	txt.updatePosition( mesh2, radius, latitude, longitude );

	groupText.add( mesh2 );

	//txt.updatePosition( mesh2, radius, latitude, longitude );
	mesh2.lookAt( new THREE.Vector3() );
	mesh2.up.set( 0, 0, 1 );

}



txt.addBox = function ( size = 10 ) {

	const geometry = new THREE.BoxGeometry( 1, 2, 40 );
	const material = new THREE.MeshNormalMaterial();

	box = new THREE.Mesh( geometry, material );

	txt.updatePosition( box, 60, 30, 60 );

	groupText.add( box );

	box.lookAt( new THREE.Vector3() );
	box.up.set( 0, 0, 1 );

	//txt.updatePosition( box, 60, 30, 60  );

};



txt.updatePosition = function ( obj3D = group, radius = 70, latitude = 0, longitude = 0 ) {

	obj3D.position.copy( THR.latLonToXYZ( radius, latitude, longitude ) );
	obj3D.lookAt( new THREE.Vector3() );
	obj3D.up.set( 0, 0, 1 );

};