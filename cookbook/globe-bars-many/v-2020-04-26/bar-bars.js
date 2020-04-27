

const BAR = {

	lat: 0,
	lon: 0,
	places: "Null Island",
	index: 0,
	color: "red",
	radius: -0.4,
	height: 40,
	offset: 0,
	radialSegments: 6,
	heightSegments: 1,
	openEnded: false

};

let cities;
let group;
let timeStart;


BAR.onLoadWorldCitiesGroup = function ( xhr ) {

	const response = xhr.target.response;
	//console.log( "response", response );

	cities = response.split( /\n/ ).map( line => line.replace( /\"/g, "" ).split( "," ) );
	//console.log( "cities", cities );

	scene.remove( group )
	group = new THREE.Group();

	cities.forEach( ( city, index )=> {

		let height = isNaN( Number( city[ 9 ] ) ) ? 10000 : Number( city[ 9 ] );
		height = height < 10000 ? 10000 : height;

		const mesh = BAR.addBar( { lat: + city[ 2 ], lon: + city[ 3 ], index: index, height: 0.02 * Math.sqrt( height ) } );

		group.add( mesh );

	} );

	scene.add( group );

	addMouseMove();

	divTime.innerHTML = `
	Load data by group<br>
	${ ( performance.now() - timeStart ).toLocaleString() } ms
	`;

	//setTimeout( () => { group.children.forEach( mesh => mesh.matrixAutoUpdate = false ); }, 2000 );


};


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



BAR.requestFileUserData = function ( url, callback, userData ) {

	timeStart = performance.now();

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr, userData );
	xhr.send( null );

};



BAR.onLoadWorldCitiesInstanced = function ( xhr ) {

	const response = xhr.target.response;
	//console.log( "response", response );

	cities = response.split( /\n/ ).map( line => line.replace( /\"/g, "" ).split( "," ) );
	//console.log( "cities", cities );

	scene.remove( group );
	group = new THREE.Group();

	//const geometry = new THREE.BoxBufferGeometry( 0.1, 0.1, 10 );
	let geometry = new THREE.CylinderBufferGeometry( -0.01, BAR.radius, BAR.height, BAR.radialSegments, BAR.heightSegments );

	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	const material = new THREE.MeshNormalMaterial({side: 2 } );
	const mesh = new THREE.InstancedMesh( geometry, material, cities.length );

	for ( let i = 0; i < cities.length; i ++ ) {

		city = cities[ i ];
		let height = isNaN( Number( city[ 9 ] ) ) ? 1000 : Number( city[ 9 ] );
		height = height < 1000 ? 1000 : height;
		height = 0.01 * Math.sqrt( height );
		//console.log( "height", height );

		const matrix = getMatrixComposed( 32 + height, + city[ 2 ], + city[ 3 ] );
		mesh.setMatrixAt( i, matrix );

	}

	group.add( mesh );
	scene.add( group );

	divTime.innerHTML = `
Load data by instance<br>
${ ( performance.now() - timeStart ).toLocaleString() } ms
`;

	addMouseMove();

	// group = new THREE.Group();

	// cities.forEach( ( city, index )=> {

	// 	let height = isNaN( Number( city[ 9 ] ) ) ? 10000 : Number( city[ 9 ] );
	// 	height = height < 10000 ? 10000 : height;

	// 	const mesh = BAR.addBar( { lat: + city[ 2 ], lon: + city[ 3 ], index: index, height: 0.02 * Math.sqrt( height ) } );

	// 	group.add( mesh );

	// } );

	// scene.add( group );

	//setTimeout( () => { group.children.forEach( mesh => mesh.matrixAutoUpdate = false ); }, 2000 );

	//DMT.init();

};


function getMatrixComposed ( r = 50, lat = 0, lon = 0, size = 5 ) {

	const position = BAR.latLonToXYZ( r, lat, lon );
	//const quaternion = new THREE.Quaternion().setFromUnitVectors ( new THREE.Vector3( 1, 0, 0 ), position.normalize() );
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();
	const matrix = new THREE.Matrix4()
		.compose( position, quaternion, scale )
		.lookAt( new THREE.Vector3( 0, 0, 0 ), position, new THREE.Vector3( 0, 0, 1 ) );

	return matrix;

}



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




function addMouseMove() {

	window.addEventListener( 'mousemove', onMouseMove, false );

}



function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	let intersects = raycaster.intersectObjects( group.children );

	if ( intersects.length  ) {

		//console.log( "int", intersects[ 0 ] );

		const intersected = intersects[ 0 ];
		const index = intersected.instanceId ? intersected.instanceId : intersected.object.userData.index;

		divLog.innerHTML = `
index: ${ index }<br>
city: ${ cities[ index ].join( "<br>") }
`;

	}

}
