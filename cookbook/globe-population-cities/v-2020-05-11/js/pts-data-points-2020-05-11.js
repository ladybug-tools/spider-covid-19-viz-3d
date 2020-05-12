
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



PTS.getMesh = function ( countries = geoDataGlobalCsv ) {

	//const timeStart = performance.now();

	const geometry = new THREE.CylinderBufferGeometry( 0.6, 0.1, 1, 5, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );
	geometry.applyMatrix4( new THREE.Matrix4().makeScale( - 1, - 1, - 1 ) ); // prettifies the coloring
	const material = new THREE.MeshNormalMaterial( { side: 2 } );

	const mesh = new THREE.InstancedMesh( geometry, material, countries.length );
	mesh.name = "instancedMesh";
	mesh.userData.data = countries;

	countries.forEach( ( country, i ) => {

		const matrix = getMatrixComposed( {
			latitude: + country[ 2 ],
			longitude: + country[ 3 ],
			height: 0.0000001 * country[ 6 ]
		} );

		mesh.setMatrixAt( i, matrix );

	} );

	console.log( "msPts", performance.now() - timeStart );

	return mesh;

};

