
const txt = {};


txt.loader = undefined;



txt.init = function() {

	txt.loader = txt.loader ? txt.loader : new THREE.FontLoader();

	const url = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r115/examples/fonts/helvetiker_regular.typeface.json";

	txt.loader.load( url, txt.onLoadFont );


}



txt.onLoadFont = function( fnt ) {

	console.log( 'font', fnt );

	font = fnt;

	mesh = txt.getSimpleText( );

	//drawTextMultiple( mesh );

}


txt.getSimpleText = function ( text = "Hello, World!\nThree.js\nabc 123", size = 3, color = 0x006699 ) {

	const shapes = font.generateShapes( text, size );

	// const geometry = new THREE.ShapeBufferGeometry( shapes );

	// geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( -0.5 * Math.PI ) );

	// const material = new THREE.MeshBasicMaterial( { color: color, opacity: 0.5, side: 2, transparent: true } );

	grp = new THREE.Group();

	//const mesh = source.clone();

	const lat = 0; //180 * Math.random() - 90;
	const lon = 0; //360 * Math.random() - 180;

	const p1 = THR.latLonToXYZ( 65, lat, lon );
	const p2 = THR.latLonToXYZ( 30, lat, lon );
	const p3 = THR.latLonToXYZ( 150, lat, lon );

	let geometry = new THREE.ShapeBufferGeometry( shapes );

	geometry.computeBoundingBox();

	let xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

	geometry.translate( xMid, 0, 0 );

	geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( -0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( -0.5 * Math.PI ) );

	let material = new THREE.MeshBasicMaterial( { color: 0x006699, opacity: 0.5, side: 0, transparent: true } );

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	grp.add( mesh );

	geometry = new THREE.ShapeBufferGeometry( shapes );



	geometry.computeBoundingBox();

	xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

	geometry.translate( xMid, 0, 0 );

	//geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( -0.5 * Math.PI ) );

	geometry.applyMatrix4( new THREE.Matrix4().makeRotationY( -0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( 0.5 * Math.PI ) );


	material = new THREE.MeshBasicMaterial( { color: 0x990066, opacity: 0.5, side: 0, transparent: true } );

	const mesh2 = new THREE.Mesh( geometry, material );
	mesh2.position.copy( p1 );
	mesh2.lookAt( p3 );
	grp.add( mesh2 );

	THR.scene.add( grp );

	return mesh;

};
