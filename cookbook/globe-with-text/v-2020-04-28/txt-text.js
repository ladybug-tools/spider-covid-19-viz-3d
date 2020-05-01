/* Global THR */

var THR = {}

const TXT = {};

TXT.group = new THREE.Group();

let font;


TXT.init = function () {

	const loader = new THREE.FontLoader();

	const url = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r115/examples/fonts/helvetiker_regular.typeface.json";

	loader.load( url, ( fnt ) => {

		font = fnt;
		TXT.addTextContinents();

	} );

};



TXT.addTextContinents = function () {

	THR.scene.remove( TXT.group );

	TXT.group = new THREE.Group();

	TXT.addBox();

	TXT.getSimpleText( { text: "Africa\n123", color: 0x0000, radius: 65, latitude: "0", longitude: "0" } );
	TXT.getSimpleText( { text: "Europe", color: 0x0085C7, radius: 65, latitude: "50", longitude: "50" } );
	TXT.getSimpleText( { text: "Asia", color: 0xF4C300, radius: 60, latitude: "20", longitude: "130" } );
	TXT.getSimpleText( { text: "Oceania", color: 0x009F3D, latitude: "-10", longitude: "160" } );
	TXT.getSimpleText( { text: "Americas", color: 0xDF0024, radius: "70", latitude: "0", longitude: "-100" } );

	THR.scene.add( TXT.group );

};


TXT.getSimpleText = function ( {
	text = "Hello, World!\nThree.js\nabc 123",
	color = 0x006699,
	size = 3,
	radius = 70,
	latitude = 0,
	longitude = 0
} = {} ) {

	const shapes = font.generateShapes( text, size );

	const geometry = new THREE.ShapeBufferGeometry( shapes );
	geometry.computeBoundingBox();
	const xMid = - 0.5 * ( geometry.boundingBox.getSize( new THREE.Vector3() ).x );
	geometry.translate( xMid, 0, 0 );
	//geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( 0.5 * Math.PI ) );

	const material = new THREE.MeshBasicMaterial( { color: 0x888888, opacity: 0.8, side: 0, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );

	TXT.updatePosition( mesh, radius, latitude, longitude );
	TXT.group.add( mesh );


	const geometry2 = geometry.clone();
	geometry2.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI ) );
	const material2 = new THREE.MeshBasicMaterial( { color: color, opacity: 0.8, side: 0, transparent: true } );

	const mesh2 = new THREE.Mesh( geometry2, material2 );

	TXT.updatePosition( mesh2, radius, latitude, longitude );
	TXT.group.add( mesh2 );

};






TXT.updatePosition = function ( obj3D = group, radius = 70, latitude = 0, longitude = 0 ) {

	obj3D.up.set( 0, 0, 1 );
	obj3D.position.copy( THR.latLonToXYZ( radius, latitude, longitude ) );
	obj3D.lookAt( new THREE.Vector3() );

};



THR.latLonToXYZ = function ( radius, lat, lon ) {

	const theta = ( 90 - lat ) * Math.PI / 180;
	const phi = ( 180 - lon ) * Math.PI / 180;

	const x = radius * Math.sin( theta ) * Math.cos( phi );
	const y = radius * Math.sin( theta ) * Math.sin( phi );
	const z = radius * Math.cos( theta  );

	return new THREE.Vector3( - x, y, z );

};



TXT.addBox = function ( size = 10 ) {

	const geometry = new THREE.BoxGeometry( 1, 5, 20 );
	const material = new THREE.MeshNormalMaterial();
	const box = new THREE.Mesh( geometry, material );

	TXT.updatePosition( box, 65, 30, 60 );

	const shapes = font.generateShapes( "abc\n123\nxyz", 10 );

	const geometryTxt = new THREE.ShapeBufferGeometry( shapes );
	geometryTxt.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI ) );
	const materialTxt = new THREE.MeshNormalMaterial( { opacity: 0.8, side: 2, transparent: true } );
	const mesh = new THREE.Mesh( geometryTxt, materialTxt );

	box.add( mesh );

	TXT.group.add( box );

};
