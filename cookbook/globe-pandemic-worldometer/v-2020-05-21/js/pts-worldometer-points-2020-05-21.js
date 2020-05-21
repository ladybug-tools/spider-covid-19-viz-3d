
/* global scene */

const PTS = {}; // data points. Each point is displayed as a cylindrical 3D object rising perpendicularly from the surface of the globe.



PTS.init = function () {

	scene.remove(PTS.group);
	PTS.group = new THREE.Group();
	PTS.group.name = "instances";
	scene.add(PTS.group);

	//PTS.group.add( PTS.getPoints( geoDataGlobalCsv ) );

	//PTS.group.add( PTS.getPoints( geoDataRegionalCsv ) );

};



// following is in place of PTS() in script.js

PTS.getPoints = function (places, index = 2, color = "red", ) {

	let geometry = new THREE.CylinderBufferGeometry(0.5, 0.2, 1, 5, 1, true);
	geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(0.5 * Math.PI));
	geometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, -1, -1));

	const material = new THREE.MeshPhongMaterial({ color: color, side: 2 });
	const mesh = new THREE.InstancedMesh(geometry, material, places.length);

	for (let i = 0; i < places.length; i++) {

		place = places[i];

		//console.log( "place", place );

		place[1] = place[1].trim()
			.replace(/Cabo Verde/, "Cape Verde")
			.replace(/CAR/, "Central African Republic")
			.replace(/Channel Islands/, "Guernsey")
			.replace(/Congo/, "Republic of the Congo")
			.replace(/Czechia/, "Czech Republic")
			.replace(/DRC/, "Democratic Republic of the Congo")
			.replace(/Macao/, "Macau")
			.replace(/S. Korea/, "South Korea")
			.replace(/Saint Pierre Miquelon/, "Saint Pierre and Miquelon")
			.replace(/UAE/, "United Arab Emirates")
			.replace(/USA/, "United States")
			.replace(/UK/, "United Kingdom");

		let find = geoDataGlobalCsv.find(country => country[0] === place[1])

		if (!find) {

			find = geoDataRegionalCsv.find(country => country[1] === place[1])

		}

		if (find) {

			//console.log( "find", find );

			let height = + place[index].replace(/\,/g, "");
			height = 0.05 * Math.sqrt(height);
			height = height < 1 ? 1 : height;
			//console.log( "height", height );

			const matrix = getMatrixComposed({ radius: 50, latitude: + find[2], longitude: + find[3], height: height });
			mesh.setMatrixAt(i, matrix);

			place.push(find);

		} else {

			//console.log( "no find",i, place[ 0 ] );

		}

	}

	return mesh;

};