
const txt = {};


let groupText = new THREE.Group();

txt.loader = undefined;

txt.font = undefined;



txt.init = function () {

	txt.loader = txt.loader ? txt.loader : new THREE.FontLoader();

	const url = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r115/examples/fonts/helvetiker_regular.typeface.json";

	txt.loader.load( url, ( font ) => { txt.font = font; txt.addTextContinents(); } );


};



txt.addTextContinents = function () {

	THR.scene.remove( groupText );

	groupText = new THREE.Group();

	txt.getSimpleText( { text: "Africa", color: "black", latitude: "-10", longitude: "0" } );
	txt.getSimpleText( { text: "Europe", color: 0x0085C7, latitude: "0", longitude: "40" } );
	txt.getSimpleText( { text: "Asia", color: 0xF4C300, latitude: "20", longitude: "120" } );
	txt.getSimpleText( { text: "Oceania", color: 0x009F3D, latitude: "-10", longitude: "150" } );
	txt.getSimpleText( { text: "Americas", color: 0xDF0024, radius: "70", latitude: "0", longitude: "-100" } );

	THR.scene.add( groupText );

};


txt.getSimpleText = function ( {

	text = "Hello, World!\nThree.js\nabc 123",
	radius = 65,
	latitude = 0,
	longitude = 0,
	size = 3,
	color = 0x006699
	} = {} ) {

	radius = Number( radius );
	latitude = Number( latitude );
	longitude = Number( longitude );

	const shapes = txt.font.generateShapes( text, size );

	const p1 = THR.latLonToXYZ( radius, latitude, longitude );
	const p2 = axesHelper.position; //THR.latLonToXYZ( 0, latitude, longitude );
	const p3 = THR.latLonToXYZ( radius + 100, latitude, longitude );

	let geometry = new THREE.ShapeBufferGeometry( shapes );
	geometry.computeBoundingBox();
	let xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
	geometry.translate( xMid, 0, 0 );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( -0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( -0.5 * Math.PI ) );

	let material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 1, side: 0, transparent: true } );

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	groupText.add( mesh );



	geometry = new THREE.ShapeBufferGeometry( shapes );
	geometry.computeBoundingBox();
	xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
	geometry.translate( xMid, 0, 0 );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	material = new THREE.MeshBasicMaterial( { color: color, opacity: 1, side: 0, transparent: true } );

	const mesh2 = new THREE.Mesh( geometry, material );
	mesh2.position.copy( p1 );

	groupText.add( mesh2 );

};
