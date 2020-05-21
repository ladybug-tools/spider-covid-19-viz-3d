// three.js 3D text
/* global scene, getMatrixComposed, geoDataGlobalCsv, geoDataRegionalCsv */

const TXT = {

	group: new THREE.Group(),
	font: undefined,


};



TXT.onLoadFontRunThese = function () {

	TXT.addTextContinents();

	// TXT.addTextDataPoints( geoDataGlobalCsv );

	//TXT.addTextDataPoints( geoDataRegionalCsv );

};



TXT.init = function () {

	const loader = new THREE.FontLoader();

	const urlFont =
			"https://cdn.jsdelivr.net/gh/mrdoob/three.js@r115/examples/fonts/helvetiker_regular.typeface.json";

	loader.load( urlFont, fnt => {

		TXT.font = fnt;

		scene.remove( TXT.group );

		TXT.group = new THREE.Group();
		TXT.group.name = "txtGroup";

		TXT.onLoadFontRunThese();

		scene.add( TXT.group );

		console.log( "msTxtAll", performance.now() - timeStart );

	} );

};



TXT.addTextContinents = function () {

	TXT.addSimpleText( {
		text: "Africa\n1.2 billion people",
		color: 0x0000,
		radius: 70,
		latitude: "0",
		longitude: "0"
	} );
	TXT.addSimpleText( {
		text: "Europe\n 750 million people",
		color: 0x0085c7,
		radius: 70,
		latitude: "50",
		longitude: "50"
	} );
	TXT.addSimpleText( {
		text: "Asia\n4.5 billion people",
		color: 0xf4c300,
		radius: 75,
		latitude: "20",
		longitude: "130"
	} );
	TXT.addSimpleText( {
		text: "Oceania\n43 million people",
		color: 0x009f3d,
		radius: 75,
		latitude: "-10",
		longitude: "160"
	} );
	TXT.addSimpleText( {
		text: "Americas\n1 billion people",
		color: 0xdf0024,
		radius: 70,
		latitude: "0",
		longitude: "-100"
	} );

	console.log( "msTxtCts", performance.now() - timeStart );

};



TXT.addSimpleText = function ( {
	text = "Hello, World!\nThree.js\nabc 123",
	color = 0x006699,
	size = 3,
	radius = 70,
	latitude = 0,
	longitude = 0
} = {} ) {

	const shapes = TXT.font.generateShapes( text, size );

	const matrix = getMatrixComposed( { radius, latitude, longitude } );

	const geometry0 = new THREE.ShapeBufferGeometry( shapes );
	geometry0.computeBoundingBox();
	const xMid = - 0.5 * geometry0.boundingBox.getSize( new THREE.Vector3() ).x;
	geometry0.translate( xMid, 0, 0 );

	const geometry1 = geometry0
		.clone()
		.applyMatrix4( new THREE.Matrix4().makeRotationY( 0.5 * Math.PI ) )
		.applyMatrix4( matrix );

	const material1 = new THREE.MeshBasicMaterial( {
		color: 0xff0000,
		opacity: 0.9,
		transparent: true
	} );

	const text1 = new THREE.Mesh( geometry1, material1 );

	const geometry2 = geometry0.clone()
		.applyMatrix4( new THREE.Matrix4().makeRotationY( - 0.5 * Math.PI ) )
		.applyMatrix4( matrix );

	const material2 = new THREE.MeshBasicMaterial( {
		color: color,
		opacity: 0.9,
		transparent: true
	} );

	const text2 = new THREE.Mesh( geometry2, material2 );

	TXT.group.add( text1, text2 );

};


TXT.addTextDataPoints = function () {


	const geometriesTxt = [];

	PTS.places.forEach( place => {

		//console.log( "place", place );

		placeGeoData = place.pop();

		const txt = placeGeoData[ 1 ] ? placeGeoData[ 1 ] : placeGeoData[ 0 ];
		const siz = placeGeoData[ 1 ] ? 0.7 : 1.0;
		const shapes = TXT.font.generateShapes( txt, siz );
		const geometryTxt0 = new THREE.ShapeBufferGeometry( shapes );
		geometryTxt0.computeBoundingBox();
		const xSize = geometryTxt0.boundingBox.getSize( new THREE.Vector3() ).x;

		let height = + place[ 2 ].replace( /\,/g, "" );
		height = 0.05 * Math.sqrt( height );
		height = height < 1 ? 1 : height;
		const matrixTxt = getMatrixComposed( {
			radius: 51 + height,
			latitude: + placeGeoData[ 2 ],
			longitude: + placeGeoData[ 3 ]
		} );

		const geometryTxt1 = geometryTxt0.clone()
			.translate( - xSize, 0, 0 )
			.applyMatrix4( new THREE.Matrix4().makeRotationY( - 0.5 * Math.PI ) )
			.applyMatrix4( matrixTxt );

		const geometryTxt2 = geometryTxt0.clone()
			.applyMatrix4( new THREE.Matrix4().makeRotationY( 0.5 * Math.PI ) )
			.applyMatrix4( matrixTxt );

		geometriesTxt.push( geometryTxt1, geometryTxt2 );

	} );

	const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesTxt );
	const materialTxt = new THREE.MeshBasicMaterial( { color: "yellow", side: 0 } );
	const meshTxt = new THREE.Mesh( mergedGeometry, materialTxt );

	TXT.group.add( meshTxt );

	console.log( "msTxtPts", performance.now() - timeStart );

};

