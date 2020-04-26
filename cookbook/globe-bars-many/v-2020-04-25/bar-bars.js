

const BAR = {

	lat: 0,
	lon: 0,
	places: "Null Island",
	index: 0,
	color: "red",
	radius: -0.5,
	height: 50,
	offset: 0,
	radialSegments: 5,
	heightSegments: 1,
	openEnded: false

};

let cities;
let group;



BAR.addBar = function ( obj = {} ) {

	lat = obj.lat || BAR.lat;
	lon = obj.lon || BAR.lon;
	places = obj.places || BAR.places;
	index = obj.index || BAR.index;
	color = obj.color || BAR.color;
	radius = obj.radius || BAR.radius;
	height = obj.height || BAR.height;
	offset = obj.offset || BAR.offset;
	radialSegments = obj.radialSegments || BAR.radialSegments;
	heightSegments = obj.heightSegments || BAR.heightSegments;
	openEnded = obj.openEnded || BAR.openEnded ;

	const p1 = BAR.latLonToXYZ( 50 + ( offset + 0.5 * height ), lat, lon );
	const p2 = BAR.latLonToXYZ( 100, lat, lon );

	let geometry = new THREE.CylinderBufferGeometry( 0.01, radius, height, radialSegments, heightSegments, openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( - 0.5 * Math.PI ) );
	let material = new THREE.MeshNormalMaterial( { side: 2 });
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData.index = index;
	mesh.userData.places = places;

	return mesh;

};



BAR.latLonToXYZ = function ( radius, lat, lon ) {

	const pi2 = Math.PI / 2;

	const phi = Number( 90 - lat ) * Math.PI / 180;
	const theta = Number( 180 - lon ) * Math.PI / 180;
	//console.log( "lat/lon", theta, phi, index);

	const x = - radius * Math.sin( phi ) * Math.cos( theta );
	const y = radius * Math.sin( phi ) * Math.sin( theta );
	const z = radius * Math.cos( phi );

	return new THREE.Vector3( x, y, z );

};


//////////


BAR.requestFileUserData = function ( url, callback, userData ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr, userData );
	xhr.send( null );

};



BAR.onLoadWorldCities = function ( xhr ) {

	const response = xhr.target.response;
	//console.log( "response", response );

	cities = response.split( /\n/ ).map( line => line.replace( /\"/g, "" ).split( "," ) );
	//console.log( "cities", cities );

	group = new THREE.Group();

	cities.forEach( ( city, index )=> {

		let height = isNaN( Number( city[ 9 ] ) ) ? 10000 : Number( city[ 9 ] );
		height = height < 10000 ? 10000 : height;

		const mesh = BAR.addBar( { lat: + city[ 2 ], lon: + city[ 3 ], index: index, height: 0.02 * Math.sqrt( height ) } );

		group.add( mesh );

	} );

	scene.add( group );

	//setTimeout( () => { group.children.forEach( mesh => mesh.matrixAutoUpdate = false ); }, 2000 );

	DMT.init();

};
