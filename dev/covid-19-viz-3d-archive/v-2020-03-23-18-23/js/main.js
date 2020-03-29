// copyright 2020 Spider contributors. MIT license.
// 2020-03-20
/* globals THREE, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */
// jshint esversion: 6
// jshint loopfunc: true


let pathAssets = "../../assets/"; // change in html of stable
const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_daily_reports/";

aSource.href = "https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
imgIcon.src = "https://pushme-pullyou.github.io/github-mark-32.png";

sTitle.innerHTML = document.title ? document.title : location.href.split( '/' ).pop().slice( 0, - 5 ).replace( /-/g, ' ' );
const version = document.head.querySelector( "[ name=version ]" );
sVersion.innerHTML = version ? version.content : "";
//divDescription.innerHTML = document.head.querySelector( "[ name=description ]" ).content;

let group = new THREE.Group();
let groupCases = new THREE.Group();
let groupNew = new THREE.Group();
let groupDeaths = new THREE.Group();
let groupRecoveries = new THREE.Group();
let groupPlacards = new THREE.Group();
let groupLines = new THREE.Group();

let geoJson;
let yesterday;
let linesYesterday;
let intersected;

let mesh;
let scene, camera, controls, renderer;

var synth = window.speechSynthesis;
var voices = [];

THR.init();
THR.animate();

//init();


function init () {

	scene = THR.scene;
	camera = THR.camera;
	controls = THR.controls;
	renderer = THR.renderer;


	const url = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports";

	requestFile( url, callbackDailyReport );


	const urlJsonStatesProvinces = pathAssets + "json/ne_50m_admin_1_states_provinces_lines.geojson";

	requestFile( urlJsonStatesProvinces, onLoadGeoJson );

	const urlJsonChina = pathAssets + "json/china.geojson";

	requestFile( urlJsonChina, onLoadGeoJson );

	const urlJson = pathAssets + "json/ne_110m_admin_0_countries_lakes.geojson";

	requestFile( urlJson, onLoadGeoJson );


	addLights();

	addGlobe();

	addSkyBox();

	getSettings();

	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );

}



function sayThis( text = "Hello world! My fingers are crossed. I hope you will be here tomorrow") {

	synth.cancel();

	const utterThis = new SpeechSynthesisUtterance( text );

	voices = voices.length ? voices : window.speechSynthesis.getVoices();

	if ( voices.length > 0 ) {

		const voice = voices.find( item => item.name === "Google UK English Female" );

		const theDefault =  voices.find( item => item.default === true );

		utterThis.voice = voice ? voice : theDefault;

	}

	synth.speak( utterThis );

}



function requestFile ( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onerror = ( xhr ) => console.log( 'error:', xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = callback;
	xhr.send( null );

}



function callbackDailyReport ( xhr ) {

	const json = JSON.parse( xhr.target.response );

	const names = json.map( json => json.name );

	today = names[ names.length - 2 ];
	//console.log( today );

	yesterday = names[ names.length - 3 ];
	//console.log( 'yesterday', yesterday );

	//requestFile( dataJhu + today, onLoad );

	requestFile( "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-23-2020.csv", onLoad );

}



function onLoad ( xhr ) {

	group = new THREE.Group();
	groupCases = new THREE.Group();
	groupNew = new THREE.Group();
	groupDeaths = new THREE.Group();
	groupRecoveries = new THREE.Group();
	groupPlacards = new THREE.Group();
	groupLines = new THREE.Group();

	scene.add( group, groupCases, groupNew, groupDeaths, groupRecoveries, groupPlacards, groupLines );

	let response = xhr.target.response;
	// response = response.replace( /"Korea, South"/, "South Korea" )
	// 	.replace( /"Gambia, The"/, "The Gambia" )
	// 	.replace( /"Bahamas, The"/, "The Bahamas" );
	// //.replace( /"Virgin Islands,/, "Virgin Islands");

	lines = response.split( "\n" ).map( line => line.split( "," ) )
	//console.log( 'lines', lines );

	const date = new Date().toISOString();

	//FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key
	lines.push( [ "Test Case", "Null Island", date, "abc", "", "-3.333", "0", "0" ] );

	lines.forEach( ( line, index ) => addIndicator( line, index ) );

	//requestFile( dataJhu + yesterday, onLoadYesterday );

	getStats();

}



function onLoadYesterday ( xhr ) {

	let response = xhr.target.response;

	linesYesterday = response.split( "\n" ).map( line => line.split( "," ) ).slice( 1, -1 );
	//console.log( 'lines', lines );

	lines.forEach( ( line, index ) => addIndicatorNew( line, index ) );

	//getStats();

}



function addIndicator ( line, index ) {

	const lat = Number( line[ 5 ] )
	//const lat = isNaN( l5 ) ? 0 : l5;

	const lon= Number( line[ 6 ] )
	//const lon = isNaN( l6 ) ? 0 : l6;

	const cases = Number( line[ 7 ] );
	//cases = isNaN( l7 ) ? 0 : l7;

	const deaths = Number( line[ 8 ] );
	//const deaths = isNaN( l8 ) ? 0 : l8;

	const recoveries = Number( line[ 9 ] );
	//const recoveries = isNaN( l9 ) ? 0 : l9;

	const active = Number( line[ 10 ] );

	const heightCases = 0.2 * Math.sqrt( cases || 1 );
	const heightDeaths = cases > 0 ? heightCases * ( deaths / cases ) : 0;
	const heightRecoveries = 0.2 * Math.sqrt( recoveries );


	let p1 = latLonToXYZ( 50 + 0.5 * heightCases, lat, lon, index );
	let p2 = latLonToXYZ( 100, lat, lon, index );

	let geometry = new THREE.CylinderGeometry( 0.4, 0.4, heightCases );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: "red" } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	groupCases.add( mesh );


	//if ( heightDeaths > 0 ) {

		p1 = latLonToXYZ( 50 + 0.5 * heightDeaths, lat, lon, index );
		p2 = latLonToXYZ( 100, lat, lon, index );

		let dToC = cases > 0 ? 5 * ( deaths / cases ) : 0;
		dToC = dToC < 1 ? dToC : 1;
		//console.log( 'dc', dToC );
		geometry = new THREE.CylinderBufferGeometry( 0.5, 0.5 + dToC, heightDeaths, 12, 1, true );

		geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
		material = new THREE.MeshPhongMaterial( { color: "black", side: 2 } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy( p1 );
		mesh.lookAt( p2 );
		mesh.userData = index;

		groupDeaths.add( mesh );

	//}

	p1 = latLonToXYZ( 50 + 0.5 * heightRecoveries, lat, lon, index );
	p2 = latLonToXYZ( 100, lat, lon, index );

	geometry = new THREE.CylinderBufferGeometry( 0.45, 0.45, heightRecoveries, 12, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	material = new THREE.MeshPhongMaterial( { color: "green" } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	groupRecoveries.add( mesh );

}



function addIndicatorNew ( line, index ) {

	const state = line[ 0 ];
	const country = line[ 1 ];

	const l3 = Number( line[ 3 ] );
	cases = isNaN( l3 ) ? 0 : l3;

	//const l4 = Number( line[ 4 ] );
	//const deaths = isNaN( l4 ) ? 0 : l4;

	//const l5 = Number( line[ 5 ] );
	//const recoveries = isNaN( l5 ) ? 0 : l5;

	const l6 = Number( line[ 6 ] )
	const lat = isNaN( l6 ) ? 0 : l6;

	const l7 = Number( line[ 7 ] )
	const lon = isNaN( l7 ) ? 0 : l7;

	const lineNew = linesYesterday.filter( lineNew => lineNew[ 0 ] === state && lineNew[ 1 ] === country );
	//console.log( 'ln',line[ 3 ]);

	const str = lineNew.length ? lineNew[ 0 ][ 3 ] : "";

	const num = str ? Number( str ) : Number( line[ 3 ] );

	const casesNew = Math.abs( Number( line[ 3 ] ) - num );

	lines[ index ].push( casesNew );

	//if ( casesNew > 0 ) console.log( 'casesNew', casesNew, line );

	if ( casesNew < 1 ) { return; }

	const heightCases = 0.2 * Math.sqrt( Number( line[ 3 ] ) || 0 );
	//	const heightNew = 0.2 * Math.sqrt( casesNew || 1 );

	//const cases = Number( line[ 3 ] );
	const heightRatio = cases ? casesNew / cases : 0;
	//console.log( 'heightRatio', heightRatio );

	const height = heightCases * heightRatio;
	//console.log( 'height', height );

	const p1 = latLonToXYZ( 50 + heightCases - 0.5 * height, lat, lon, index );
	const p2 = latLonToXYZ( 100, lat, lon, index );

	const geometry = new THREE.CylinderBufferGeometry( 0.45, 0.45 + heightRatio, height, 12, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	const material = new THREE.MeshPhongMaterial( { color: "cyan", opacity: 0.8, side: 2, transparent: true } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	groupNew.add( mesh );

}



function latLonToXYZ ( radius, lat, lon, index ) {

	const pi2 = Math.PI / 2;

	const theta = Number( lat ) * Math.PI / 180;
	const phi = Number( lon ) * Math.PI / 180;
	//console.log( "lat/lon", theta, phi, index);

	const x = radius * Math.sin( theta + pi2 ) * Math.cos( phi );
	const y = radius * Math.sin( theta + pi2 ) * Math.sin( phi );
	const z = radius * Math.cos( theta - pi2 );

	return new THREE.Vector3( x, y, z );

}


/////////

function getStats () {

	const europe = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "EstoniaF", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Holy See" ];

	const globalCases = lines.reduce( ( sum, line ) => {
		let cases = Number( line[ 7 ] );
		//cases = isNaN( cases ) ? 0 : cases;
		return sum + cases;
	}, 0 );

	const globalCasesNew = 999999; // lines.reduce( ( sum, line ) => {
	// 	let caseNew = Number( line[ 8 ] );
	// 	caseNew = isNaN( caseNew ) ? 0 : caseNew;
	// 	return sum + caseNew;
	// }, 0 );
	console.log( 'globalCasesNew', globalCasesNew );

	// const lat = Number( line[ 5 ] )
	// //const lat = isNaN( l5 ) ? 0 : l5;

	// const lon= Number( line[ 6 ] )
	// //const lon = isNaN( l6 ) ? 0 : l6;

	// const cases = Number( line[ 7 ] );
	// //cases = isNaN( l7 ) ? 0 : l7;

	// const deaths = Number( line[ 8 ] );
	// //const deaths = isNaN( l8 ) ? 0 : l8;

	// const recoveries = Number( line[ 9 ] );
	// //const recoveries = isNaN( l9 ) ? 0 : l9;

	// 	const active = Number( line[ 10 ] );

	const globalDeaths = lines.reduce( ( sum, line ) => sum + Number( line[ 8 ] ), 0 );
	const globalRecoveries = lines.reduce( ( sum, line ) => sum + Number( line[ 9 ] ), 0 );
	const globalDeathsToCases = 100 * ( globalDeaths / globalCases );

	const chinaDeaths = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ 8 ] ) : 0, 0 );
	const chinaCasesNew = 0; //lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? line[ 8 ] : 0, 0 );
	const chinaCases = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ 7 ] ) : 0, 0 );
	const chinaRecoveries = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ 9 ] ) : 0, 0 );
	const chinaDeathsToCases = 100 * chinaDeaths / chinaCases;

	const europeDeaths = lines.reduce( ( sum, line ) => sum += europe.includes( line[ 3 ] ) ?
		Number( line[ 8 ] ) : 0, 0 );
	const europeCasesNew = 0; //lines.reduce( ( sum, line ) => sum += europe.includes( line[ 3 ] ) ? line[ 8 ] : 0, 0 );
	const europeCases = lines.reduce( ( sum, line ) => sum += europe.includes( line[ 3 ] ) ? Number( line[ 7 ] ) : 0, 0 );
	const europeRecoveries = lines.reduce( ( sum, line ) => sum += europe.includes( line[ 3 ] ) ? Number( line[ 9 ] ) : 0, 0 );
	const europeDeathsToCases = 100 * europeDeaths / europeCases;

	const usaCases = lines.reduce( ( sum, line ) => sum += line[ 3 ] === "US" ? Number( line[ 7 ] ) : 0, 0 );
	const usaCasesNew = 0; //lines.reduce( ( sum, line ) => sum += line[ 3 ] === "US" ? line[ 8 ] : 0, 0 );
	const usaDeaths = lines.reduce( ( sum, line ) => sum += line[ 3 ] === "US" ? Number( line[ 8 ] ) : 0, 0 );
	const usaRecoveries = lines.reduce( ( sum, line ) => sum += line[ 3 ] === "US" ? Number( line[ 9 ] ) : 0, 0 );
	const usaDeathsToCases = 100 * ( usaDeaths / usaCases );

	const rowCases = globalCases - chinaCases - europeCases - usaCases;
	const rowCasesNew = globalCasesNew - chinaCasesNew - europeCasesNew - usaCasesNew;
	const rowDeaths = globalDeaths - chinaDeaths - europeDeaths - usaDeaths;
	const rowRecoveries = globalRecoveries - chinaRecoveries - europeRecoveries - usaRecoveries;
	const rowDeathsToCases = 100 * ( rowDeaths / rowCases );

	// butNew.innerHTML += globalCasesNew.toLocaleString();
	// butCases.innerHTML += globalCases.toLocaleString();
	// butDeaths.innerHTML += globalDeaths.toLocaleString();
	// butRecoveries.innerHTML += globalRecoveries.toLocaleString();

	// [text], scale, color, x, y, z )
	groupPlacards.add( THR.drawPlacard( "Null Island", "0.01", 1, 60, 0, 0 ) );

	const totalsGlobal = [
		`Global`,
		`cases: ${ globalCases.toLocaleString() }`,
		`cases today: ${ globalCasesNew.toLocaleString() }`,
		`deaths: ${ globalDeaths.toLocaleString() }`,
		`recoveries: ${ globalRecoveries.toLocaleString() }`,
		`deaths/cases: ${ globalDeathsToCases.toLocaleString() }%`
	];
	vGlo = latLonToXYZ( 75, 65, -20 );
	groupPlacards.add( THR.drawPlacard( totalsGlobal, "0.02", 200, vGlo.x, vGlo.y, vGlo.z ) );

	const totalsChina = [
		`China`,
		`cases: ${ chinaCases.toLocaleString() }`,
		`cases today: ${ chinaCasesNew.toLocaleString() }`,
		`deaths: ${ chinaDeaths.toLocaleString() }`,
		`recoveries: ${ chinaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ chinaDeathsToCases.toLocaleString() }%`
	];
	vChi = latLonToXYZ( 85, 50, 110 );
	groupPlacards.add( THR.drawPlacard( totalsChina, "0.02", 1, vChi.x, vChi.y, vChi.z ) );

	const totalsEurope = [
		`Europe`,
		`cases: ${ europeCases.toLocaleString() }`,
		`cases today: ${ europeCasesNew.toLocaleString() }`,
		`deaths: ${ europeDeaths.toLocaleString() }`,
		`recoveries: ${ europeRecoveries.toLocaleString() }`,
		`deaths/cases: ${ europeDeathsToCases.toLocaleString() }%`
	];
	const vEur = latLonToXYZ( 80, 60, 20 );
	groupPlacards.add( THR.drawPlacard( totalsEurope, "0.02", 120, vEur.x, vEur.y, vEur.z ) );

	const totalsUsa = [
		`USA`,
		`cases: ${ usaCases.toLocaleString() }`,
		`cases today: ${ usaCasesNew.toLocaleString() }`,
		`deaths: ${ usaDeaths.toLocaleString() }`,
		`recoveries: ${ usaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ usaDeathsToCases.toLocaleString() }%`
	];
	const vUsa = latLonToXYZ( 80, 40, -120 );
	groupPlacards.add( THR.drawPlacard( totalsUsa, "0.02", 60, vUsa.x, vUsa.y, vUsa.z ) );

	const totalsRow = [
		`Rest of World`,
		`cases: ${ rowCases.toLocaleString() }`,
		`cases today: ${ rowCasesNew.toLocaleString() }`,
		`deaths: ${ rowDeaths.toLocaleString() }`,
		`recoveries: ${ rowRecoveries.toLocaleString() }`,
		`deaths/cases: ${ rowDeathsToCases.toLocaleString() }%`
	];
	const vRow = latLonToXYZ( 90, 30, 180 );
	groupPlacards.add( THR.drawPlacard( totalsRow, "0.02", 180, vRow.x, vRow.y, vRow.z ) );


	divStats.innerHTML = `<details id=detStats>

	<summary><b>global data ${ today.slice( 0, -4 ) }</b></summary>

	<p>
		<b>global totals </b><br>
		cases: ${ globalCases.toLocaleString() }<br>
		cases today: ${ globalCasesNew.toLocaleString() }<br>
		deaths: ${ globalDeaths.toLocaleString() }<br>
		recoveries: ${ globalRecoveries.toLocaleString() }<br>
		deaths/cases: ${ globalDeathsToCases.toLocaleString() }%<br>
	</p>

	<p>
		<b>China totals</b><br>
		cases: ${ chinaCases.toLocaleString() }<br>
		cases today: ${ chinaCasesNew.toLocaleString() }<br>
		deaths: ${ chinaDeaths.toLocaleString() }<br>
		recoveries: ${ chinaRecoveries.toLocaleString() }<br>
		deaths/cases: ${ chinaDeathsToCases.toLocaleString() }%<br>
	</p>

	<p>
	<b>Europe totals</b><br>
		cases: ${ europeCases.toLocaleString() }<br>
		cases today: ${ europeCasesNew.toLocaleString() }<br>
		deaths: ${ chinaDeaths.toLocaleString() }<br>
		recoveries: ${ europeRecoveries.toLocaleString() }<br>
		deaths/cases: ${ europeDeathsToCases.toLocaleString() }%<br>
	</p>

	<p>
		<b>USA totals</b><br>
		cases: ${ usaCases.toLocaleString() }<br>
		cases today: ${ usaCasesNew.toLocaleString() }<br>
		deaths: ${ usaDeaths.toLocaleString() }<br>
		recoveries: ${ usaRecoveries.toLocaleString() }<br>
		deaths/cases: ${ usaDeathsToCases.toLocaleString() }%<br>
	</p>

	<p>
		<b>rest of world totals</b><br>
		cases: ${ rowCases.toLocaleString() }<br>
		cases today: ${ rowCasesNew.toLocaleString() }<br>
		deaths: ${ rowDeaths.toLocaleString() }<br>
		recoveries: ${ rowRecoveries.toLocaleString() }<br>
		deaths/cases: ${ rowDeathsToCases.toLocaleString() }%<br>
	</p>

	</details>`;

	//detStats.open = window.innerWidth > 640;

}



function getSettings () {

	divSettings.innerHTML = `<details id=detSettings ontoggle=getSettingsContent() >

		<summary><b>notes & settings</b></summary>

		<div id=divNoteSettings ></div>

	</details>`;

}



function getSettingsContent () {


	divNoteSettings.innerHTML =`

	<p><i>Why are there messages in the background?</i></p>
	<p>
		An early visitor to our tracker raised this issue
		"<a href="https://github.com/ladybug-tools/spider-covid-19-viz-3d/issues/5" target="_blank">Expressions of Hope</a>"<br>
		Oleg askeg "I wonder if we could show positive tweets and expressions of hope and gratitude for the courage of health workers around the world."
	</p>

	<p>
		What you see is our first attempt to give Oleg some delight.<br>
		&bull; Zoom out then rotate. Trying to read the messages on a phone is a little guessing game.<br>
		&bull; The text is huge and leaves much white space. This is so you are not totally distracted while looking at the data.
	</p>

	<hr>

	<p>US States new cases data coming soon</p>

	<p>Black bar flare indicates high deaths to cases ratio.</p>

	<p>Cyan bar flare indicates rapid increase in new cases compared to number of previous cases.</p>

	<p>
		Not all populations and GDPs are reported.
	</p>`;

}



/////////


function onLoadGeoJson ( xhr ) {

	let response = xhr.target.response;

	geoJson = JSON.parse( response );
	//console.log( '', response );

	drawThreeGeo( geoJson, 50, 'sphere', { color: "#888" } );

}



function addLights () {

	scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

	const pointLight = new THREE.PointLight( 0xffffff, 1 );
	pointLight.position.copy( camera.position );
	camera.add( pointLight );

	const lightDirectional = new THREE.DirectionalLight( 0xfffffff, 1 );
	lightDirectional.position.set( -50, -200, 100 );
	scene.add( lightDirectional );

}



function addGlobe ( size = 50 ) {

	const geometry = new THREE.SphereGeometry( size, 50, 25 );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	const url = pathAssets + "images/earth_atmos_4096.jpg";
	var texture = new THREE.TextureLoader().load( url );

	const material = new THREE.MeshBasicMaterial( { color: 0xcce0ff, map: texture } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.name = "globe";
	scene.add( mesh );

}



function addSkyBox () {

	scene.background = new THREE.CubeTextureLoader()
		.setPath( pathAssets + "cube-textures/" )
		.load( [ 'f1.jpg', 'f2.jpg', 'f3.jpg', 'f4.jpg', 'f5.jpg', 'f6.jpg' ] );

}


/////////

function toggleCases ( group = groupCases ) {

	if ( group === window.groupPrevious ) {

		groupCases.visible = true;
		groupNew.visible = true;
		groupDeaths.visible = true;
		groupRecoveries.visible = true;

	} else {

		groupCases.visible = false;
		groupNew.visible = false;
		groupDeaths.visible = false;
		groupRecoveries.visible = false;
		//groupLines.visible = false;

		group.visible = true;

	}

	groupPrevious = group;

}



function onDocumentTouchStart ( event ) {

	//event.preventDefault();

	event.clientX = event.touches[ 0 ].clientX;
	event.clientY = event.touches[ 0 ].clientY;

	onDocumentMouseMove( event );

}



function onDocumentMouseMove ( event ) {

	//event.preventDefault();

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( groupCases.children );

	if ( intersects.length > 0 ) {

		if ( intersected !== intersects[ 0 ].object ) {

			intersected = intersects[ 0 ].object;

			const index = intersected.userData;

			const line = lines[ index ];

			const country = line[ 1 ];

			const place = line[ 0 ];
			//console.log( 'place', place );

			const tots = NCD.getDates( country, place );
			//console.log( 'tots', tots );
			const bars = NCD.bars;

			const arr = geoJson.features.filter( feature => feature.properties.NAME === country );
			//console.log( 'arr', arr );

			const feature = arr.length ? arr[ 0 ] : undefined;
			//console.log( 'feature', feature );

			let d2Pop, d2Gdp;

			if ( feature ) {

				const population = feature.properties.POP_EST;
				const gdp = feature.properties.GDP_MD_EST;
				const name = feature.properties.NAME;

				//console.log( 'gdp/pop', 1000000 * gdp / population  );
				d2Pop = ( 100 * ( Number( line[ 4 ] ) / population ) ).toLocaleString() + "%";
				d2Gdp = ( ( Number( line[ 3 ] ) / (1000000 *  gdp / population ) ) ).toLocaleString() + "";

			} else {

				d2Pop = "not available";
				d2Gdp = "not available";

			}

			const casesNew = line[ 8 ] ? line[ 8 ] : 0;

			//detNCD.hidden = false;
			divMessage.hidden = false;
			divMessage.style.left = event.clientX + "px";
			divMessage.style.top = event.clientY + "px";
			divMessage.innerHTML = `<a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data" target="_blank">JHU data</a> - updates daily<br>
			${ ( line[ 0 ] ? "place: " + line[ 0 ] + "<br>" : "" ) }
country: ${ country }<br>
update: ${ line[ 2 ] }<br>
cases: ${ Number( line[ 3 ] ).toLocaleString() }<br>
cases today: <mark>${ Number( casesNew ).toLocaleString() }</mark><br>
deaths: ${ Number( line[ 4 ] ).toLocaleString() }<br>
recoveries: ${ Number( line[ 5 ] ).toLocaleString() }<br>
deaths/cases: ${ ( 100 * ( Number( line[ 4 ] ) / Number( line[ 3 ] ) ) ).toLocaleString() }%<br>
deaths/population: ${ d2Pop }<br>
cases/(gdp/pop): ${ d2Gdp }<br>
<hr>
<a href="https://mmediagroup.fr/covid-19" target="_blank">MMG data</a> - updates hourly<br>
${ tots }
${ bars }
`;

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";
		//detNCD.hidden = true;

	}

}
