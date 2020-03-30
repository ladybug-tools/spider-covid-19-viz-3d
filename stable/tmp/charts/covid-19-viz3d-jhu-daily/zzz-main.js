// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* globals THREE, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */
// jshint esversion: 6
// jshint loopfunc: true


let pathAssets = "../../../assets/"; // change in html of stable


aSource.href = "https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
imgIcon.src = pathAssets + "images/github-mark-32.png";

sTitle.innerHTML = document.title ? document.title : location.href.split( '/' ).pop().slice( 0, - 5 ).replace( /-/g, ' ' );
const version = document.head.querySelector( "[ name=version ]" );
sVersion.innerHTML = version ? version.content : "";
//divDescription.innerHTML = document.head.querySelector( "[ name=description ]" ).content;

let group = new THREE.Group();
let groupCases = new THREE.Group();
let groupCasesNew = new THREE.Group();
let groupRecoveries = new THREE.Group();
let groupDeaths = new THREE.Group();
let groupDeathsNew = new THREE.Group();
let groupPlacards = new THREE.Group();
let groupLines = new THREE.Group();

let geoJsonArray = {};
let linesCases;
let linesCasesNew;
let linesRecoveries;
let linesDeaths;
let linesDeathsNew;

let intersected;

let mesh;
let scene, camera, controls, renderer;


THR.init();
THR.animate();

//init(); // see html



function init () {

	scene = THR.scene;
	camera = THR.camera;
	controls = THR.controls;
	renderer = THR.renderer;




	const urlJsonStatesProvinces = pathAssets + "json/ne_50m_admin_1_states_provinces_lines.geojson";

	requestFile( urlJsonStatesProvinces, onLoadGeoJson );

	const urlJsonChina = pathAssets + "json/china.geojson";

	requestFile( urlJsonChina, onLoadGeoJson );

	const urlJson = pathAssets + "json/ne_110m_admin_0_countries_lakes.geojson";

	requestFile( urlJson, onLoadGeoJson );


	addLights();

	addGlobe();

	addSkyBox();

	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );

}



function requestFile ( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onerror = ( xhr ) => console.log( 'error:', xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = callback;
	xhr.send( null );

}



function resetGroups () {

	scene.remove( group, groupCases, groupCasesNew, groupRecoveries, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

	group = new THREE.Group();
	groupCases = new THREE.Group();
	groupCasesNew = new THREE.Group();
	groupDeaths = new THREE.Group();
	groupDeathsNew = new THREE.Group();
	groupRecoveries = new THREE.Group();
	groupPlacards = new THREE.Group();
	groupLines = new THREE.Group();

	scene.add( group, groupCases, groupCasesNew, groupRecoveries, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

}


//////////

function toggleBars ( group = groupCases ) {

	if ( group === window.groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;
		groupRecoveries.visible = true;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;

		group.visible = true;
	}

	groupPrevious = group;

}



function addBar ( lat, lon, index, color = "red", radius = 0.4, height = 0, offset = 0 ) {

	heightScaled = 0.2 * Math.sqrt( height );

	if ( !heightScaled || heightScaled < 0.0001 ) {

		//console.log( '', color, linesCases[ index ] );

		return new THREE.Mesh();

	}

	let p1 = THR.latLonToXYZ( 50 + ( offset + 0.5 * heightScaled ), lat, lon );
	let p2 = THR.latLonToXYZ( 100, lat, lon );

	let geometry = new THREE.CylinderBufferGeometry( radius, radius, heightScaled, 5, 1, false );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	return mesh;

}


/////////


function displayStats ( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow ) {

	// [text], scale, color, x, y, z )
	// groupPlacards.add( THR.drawPlacard( "Null Island", "0.01", 1, 80, 0, 0 ) );

	vGlo = THR.latLonToXYZ( 75, 65, - 20 );
	groupPlacards.add( THR.drawPlacard( totalsGlobal, "0.02", 200, vGlo.x, vGlo.y, vGlo.z ) );

	vChi = THR.latLonToXYZ( 85, 50, 110 );
	groupPlacards.add( THR.drawPlacard( totalsChina, "0.02", 1, vChi.x, vChi.y, vChi.z ) );

	const vEur = THR.latLonToXYZ( 80, 60, 20 );
	groupPlacards.add( THR.drawPlacard( totalsEurope, "0.02", 120, vEur.x, vEur.y, vEur.z ) );

	const vUsa = THR.latLonToXYZ( 80, 40, - 120 );
	groupPlacards.add( THR.drawPlacard( totalsUsa, "0.02", 60, vUsa.x, vUsa.y, vUsa.z ) );

	const vRow = THR.latLonToXYZ( 90, 30, 180 );
	groupPlacards.add( THR.drawPlacard( totalsRow, "0.02", 180, vRow.x, vRow.y, vRow.z ) );


	divStats.innerHTML = `
<details id=detStats open>

	<summary><b>global data </b></summary>

	<p>
		${ totalsGlobal.join( "<br>" ).replace( /Global totals/, "<b>Global totals</b>" ) }
	</p>

	<p>
		${ totalsChina.join( "<br>" ).replace( /China/, "<b>China</b>" ) }
	</p>

	<p>
		${ totalsEurope.join( "<br>" ).replace( /Europe/, "<b>Europe</b>" ) }
	</p>

	<p>
		${ totalsUsa.join( "<br>" ).replace( /USA/, "<b>USA</b>" ) }
	</p>

	<p>
		${ totalsRow.join( "<br>" ).replace( /Rest of World/, "<b>Rest of World</b>" ) }
	</p>

</details>`;

	//detStats.open = window.innerWidth > 640;

}



function getCountries () {

	let countries = linesCases.map( line => line[ 1 ] );

	countries = [ ...new Set( countries ) ];

	//console.log( 'countries', countries );

	const options = countries.map( country => `<option>${ country }</option>` );

	divCountries.innerHTML = `
<select id=selCountries onchange=getProvince(this.value) >${ options }</select>
<div id=divProvinces > </div>
`;
}



function getProvince ( country ) {

	THR.controls.autoRotate = false;

	divMessage.hidden = true;
	divMessage.innerHTML = "";

	let provinces = linesCases.filter( line => line[ 1 ] === country );
	//console.log( 'provinces', provinces );


	if ( provinces[ 0 ][ 0 ] === "" ) {

		camera.position.copy( THR.latLonToXYZ( 70, provinces[ 0 ][ 2 ], provinces[ 0 ][ 3 ] ) );

		divProvinces.innerHTML = "";

	} else {

		const options = provinces.map( province => `<option>${ province[ 0 ] || province[ 1 ] }</option>` );

		divProvinces.innerHTML = `<p><select id=selProvinces onchange=getPlace(this.value) >${ options }</select></p>`;

	}
}



function getPlace ( province ) {

	const place = linesCases.find( line => line[ 0 ] === province );
	//console.log( 'place', place );

	camera.position.copy( THR.latLonToXYZ( 70, place[ 2 ], place[ 3 ] ) );


}



//////////

function onDocumentTouchStart ( event ) {

	//event.preventDefault();

	event.clientX = event.touches[ 0 ].clientX;
	event.clientY = event.touches[ 0 ].clientY;

	onDocumentMouseMove( event );

}


