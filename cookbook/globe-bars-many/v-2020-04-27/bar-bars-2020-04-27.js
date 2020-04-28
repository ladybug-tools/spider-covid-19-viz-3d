

const BAR = {

	lat: 0,
	lon: 0,
	places: "Null Island",
	index: 0,
	color: "red",
	radius: 0.4,
	height: 40,
	offset: 0,
	radialSegments: 5,
	heightSegments: 1,
	openEnded: true

};

let cities;
let group;
let timeStart;


BAR.requestFileUserData = function ( url, callback ) {

	timeStart = performance.now();

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = callback;
	xhr.send( null );

};



BAR.onLoadWorldCitiesInstanced = function ( xhr ) {

	const response = xhr.target.response;
	//console.log( "response", response );

	cities = response.split( /\n/ ).map( line => line.replace( /\"/g, "" ).split( "," ) );
	//console.log( "cities", cities );

	scene.remove( group );
	group = new THREE.Group();

	//const geometry = new THREE.BoxBufferGeometry( 0.3, 0.3, 1 );
	let geometry = new THREE.CylinderBufferGeometry( 0.1, BAR.radius, 1, BAR.radialSegments, BAR.heightSegments, BAR.openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
	geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, -1, -1 ) );

	const material = new THREE.MeshNormalMaterial({ side: 2 } );
	const mesh = new THREE.InstancedMesh( geometry, material, cities.length );

	for ( let i = 0; i < cities.length; i ++ ) {

		city = cities[ i ];
		let height = isNaN( Number( city[ 9 ] ) ) ? 1000 : Number( city[ 9 ] );
		height = height < 1000 ? 1000 : height;
		height = 0.008 * Math.sqrt( height );
		//console.log( "height", height );

		const matrix = BAR.getMatrixComposed( 50, + city[ 2 ], + city[ 3 ], height );
		mesh.setMatrixAt( i, matrix );

	}

	group.add( mesh );
	scene.add( group );

	divTime.innerHTML = `Load data by instance<br> ${ ( performance.now() - timeStart ).toLocaleString() } ms`;

	renderer.domElement.addEventListener( 'mousemove', BAR.onMouseMove, false );

};



BAR.getMatrixComposed = function( r = 50, lat = 0, lon = 0, height = 5 ) {

	const position = BAR.latLonToXYZ( r + 0.5 * height, lat, lon );
	const quaternion = new THREE.Quaternion().setFromUnitVectors (
		new THREE.Vector3( 0, 0, 1 ), position.clone().normalize() )
	const scale = new THREE.Vector3( 1, 1, height );
	const matrix = new THREE.Matrix4();
	matrix.compose( position, quaternion, scale );

	return matrix;

}



BAR.latLonToXYZ = function ( radius, lat, lon ) {

	const phi = ( 90 - lat ) * Math.PI / 180;
	const theta = ( 180 - lon ) * Math.PI / 180;
	//console.log( "lat/lon", theta, phi, index);

	const x = radius * Math.sin( phi ) * Math.cos( theta );
	const y = radius * Math.sin( phi ) * Math.sin( theta );
	const z = radius * Math.cos( phi );

	return new THREE.Vector3( - x, y, z );

};



BAR.onMouseMove = function( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	let intersects = raycaster.intersectObjects( [ globe, group.children[ 0 ] ] );

	if ( intersects.length ) {

		const intersected = intersects[ 0 ];

		if ( intersected.object.id !== globe.id ) {

			const index = intersected.instanceId; // ? intersected.instanceId : intersected.object.userData.index;

			const row0 = cities[ 0 ];
			const city = cities[ index ];
			const str = city.map( ( item, i ) => {

				item = i === 0 ? `<a href="https://en.wikipedia.org/w/index.php?search=${ item }" target="_blank">${ item }</a>` : item;
				item = i === 9 ? ( + item ).toLocaleString() : item;
				return `${ row0[ i ] }: ${ item } `;

			} ).join( "<br>" );

			divLog.innerHTML = `${ str }<br>index: ${ index }<br>`;

		}

	}

}
