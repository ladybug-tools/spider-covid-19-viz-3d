
/* global scene */

const PTS = {}; // data points. Each point is displayed as a cylindrical 3D object rising perpendicularly from the surface of the globe.



PTS.init = function () {

	scene.remove( PTS.group );
	PTS.group = new THREE.Group();
	PTS.group.name = "instances";
	scene.add( PTS.group );

	//PTS.group.add( PTS.getMesh( geoDataGlobalCsv ) );

	//PTS.group.add( PTS.getMesh( geoDataRegionalCsv ) );

};



PTS.getPoints = function ( countries = geoDataGlobalCsv ) {

	let geometry = new THREE.CylinderBufferGeometry( 0.3, 0.1, 1, 5, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeScale( -1, -1, -1 ) );

	const material = new THREE.MeshNormalMaterial({ side: 2 } );
	const mesh = new THREE.InstancedMesh( geometry, material, cities.length );

	for ( let i = 0; i < cities.length; i ++ ) {

		const city = cities[ i ];
		let height = isNaN( Number( city[ 9 ] ) ) ? 1000 : Number( city[ 9 ] );
		height = height < 1000 ? 1000 : height;
		height = 0.005 * Math.sqrt( height );
		//console.log( "height", height );

		const matrix = getMatrixComposed( { radius: 50, latitude: + city[ 2 ], longitude: + city[ 3 ],
			sclX: 0.2 * height, sclY: 0.2 * height, height: height } );
		mesh.setMatrixAt( i, matrix );

	}

	//group = new THREE.Group();

	return mesh;

};
