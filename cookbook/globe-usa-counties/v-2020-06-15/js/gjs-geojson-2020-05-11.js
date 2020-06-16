

const GJS = {

	groupGeoJson: undefined

}; // GeoJson lines



GJS.initGeoJson = function () {

	scene.remove( GJS.groupGeoJson );
	GJS.groupGeoJson = new THREE.Group();
	GJS.groupGeoJson.name = "geoJson";

	const pathGeoJson = "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/";

	const urlJsonCounties = "../../../assets/json/gz_2010_us_050_00_20m.json"

	requestFile( urlJsonCounties, GJS.onLoadGeoJson );

	// const urlJsonRegions = pathGeoJson + "ne_50m_admin_1_states_provinces_lines.geojson";

	// requestFile( urlJsonRegions, GJS.onLoadGeoJson );

	scene.add( GJS.groupGeoJson );

	console.log( "msGeoJ", performance.now() - timeStart );

};



GJS.onLoadGeoJson = function ( string ) {

	const json = JSON.parse( string );

	let geometries = json.features.map( feature => feature.geometry );
	//console.log( "geometries", geometries );

	let points = geometries.flatMap( geometry => {

		if ( [ "MultiPolygon", "Polygon", "MultiLineString" ].includes( geometry.type ) ) {

			return [ ... geometry.coordinates ];

		} else if ( geometry.type === "LineString" ) {

			return [ geometry.coordinates ];

		}

	} );
	//console.log( "points", points );

	const vertices = points.map( pairs => pairs.map( pair => latLonToXYZ( 50, pair[ 1 ], pair[ 0 ] ) ) );
	//console.log( "vertices", vertices );

	const line = GJS.addLineSegments( vertices );

	GJS.groupGeoJson.add( line );

};



GJS.addLineSegments = function ( segments ) {

	//console.log( "segments", segments );

	const geometry = new THREE.BufferGeometry();

	const positions = segments.flatMap( vertices =>

		vertices.slice( 0, - 1 ).flatMap( ( v0, i ) => {

			const v1 = vertices[ i + 1 ];
			return [ v0.x, v0.y, v0.z, v1.x, v1.y, v1.z ];

		} )

	);

	geometry.setAttribute( "position", new THREE.Float32BufferAttribute( positions, 3 ) );

	const material = new THREE.LineBasicMaterial( { color: 0x000ff } );

	return new THREE.LineSegments( geometry, material );

};


