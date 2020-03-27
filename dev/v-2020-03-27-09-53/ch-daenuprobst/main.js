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


	//const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	//const dataJhu = "https://raw.githack.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv";
	//const dataJhu = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv";

	const dataChTemplate = "https://raw.githubusercontent.com/daenuprobst/covid19-cases-switzerland/master/template.csv"

	requestFile( dataChTemplate, onLoadChTemplate );



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
	// renderer.domElement.addEventListener( 'mousedown', onDocumentMouseMove, false );
	// renderer.domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );

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


