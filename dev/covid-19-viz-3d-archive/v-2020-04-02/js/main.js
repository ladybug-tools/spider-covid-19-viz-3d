// copyright 2020 Spider contributors. MIT license.
// 2020-04-02
/* global THREE, controls, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */


//let build = "stable";
let build = "dev";

let timeStamp = "18-03";

let versionStable = "v-2020-04-02";
let versionDev = "v-2020-04-03";

let messageOfTheDayStable = `
<mark>New for 2020-04-02<br>
* Clearer and more defined map with place names<br>
* Menu now uses links to load chart web pages</mark>
`;

let messageOfTheDayDev = `
<mark>New for 2020-04-03<br>
* No new features yet<br>
* What would *you* like to see here?
`;


let pathAssets = "../../../assets/";

aSource.href = "https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
imgIcon.src = pathAssets + "images/github-mark-32.png";

sTitle.innerHTML = document.title; // ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " );
const versionStr = versionDev + "-" + timeStamp + "-" + build;
sVersion.innerHTML = versionStr;
//divDescription.innerHTML = document.head.querySelector( "[ name=description ]" ).content;

let group = new THREE.Group();
let groupCases = new THREE.Group();
let groupCasesNew = new THREE.Group();
let groupCasesNewGrounded = new THREE.Group();
let groupRecoveries = new THREE.Group();
let groupDeaths = new THREE.Group();
let groupDeathsNew = new THREE.Group();
let groupPlacards = new THREE.Group();
let groupLines = new THREE.Group();
let groupPrevious;

let geoJsonArray = {};

let linesCases;
let linesCasesNew;
let linesRecoveries;
let linesDeaths;
let linesDeathsNew;

let today;

let intersected;

//let mesh;
let scene, camera, controls, renderer;


let scaleHeights = 0.0003;

THR.init();
THR.animate();

//init(); // see html



function init() {

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

	//addGlobe();

	loadGlobeWithMapTextures();

	addSkyBox();

	getNotes();

	// For Three.js intersected;

	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( "mousedown", onDocumentMouseMove, false );
	renderer.domElement.addEventListener( "touchstart", onDocumentTouchStart, false );

}



function loadGlobeWithMapTextures() {

	const radius = 50;  // earth

	const pi = Math.PI, pi2 = 0.5 * Math.PI;
	const d2r = pi / 180;

	const xStart = 0
	const yStart = 0;
	const xFinish = 32;
	const yFinish = 32;
	const zoom = 5;
	const deltaPhi = 2.0 * pi / Math.pow( 2, zoom );
	const steps = Math.floor( 18 / zoom );

	const loader = new THREE.TextureLoader();
	group2 = new THREE.Object3D();
	group2.rotation.x = pi2;
	group2.rotation.y = pi;

	for ( let y = yStart; y < yFinish; y++ ) {

		const lat1 = tile2lat( y, zoom );
		const lat2 = tile2lat( y + 1, zoom );
		const deltaTheta = ( lat1 - lat2 ) * d2r;
		const theta = pi2 - lat1 * d2r;

		for ( let x = xStart; x < xFinish; x++ ) {

			const src = "https://mt1.google.com/vt/lyrs=y&x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "https://mt1.google.com/vt/lyrs=t&x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "https://mt1.google.com/vt/lyrs=s&x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "https://mt1.google.com/vt/x=" + x + "&y=" + y + "&z=" + zoom;
			//const src = "http://b.tile.openstreetmap.org/" + zoom + "/" + x + "/" + y + ".png";
			//const src = "https://maps.wikimedia.org/osm-intl/" + zoom + "/" + x + "/" + y + ".png";
			//const src = "http://tile.stamen.com/terrain-background/" + zoom + "/" + x + "/" + y + ".jpg";
			//const src = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" + zoom + "/" + y + "/" + x  + ".jpg";
			// not const src = "http://s3.amazonaws.com/com.modestmaps.bluemarble/" + zoom + "-r" + y + "-c" + x + ".jpg";

			const texture = loader.load( src );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const geometry = new THREE.SphereBufferGeometry( radius, steps, steps, x * deltaPhi - pi, deltaPhi, theta, deltaTheta );
			const mesh = new THREE.Mesh( geometry, material );

			group2.add( mesh );
			group2.name = "globe"

		}
	}
	THR.scene.add( group2 );

		function tile2lat( y, z ) {

			const n = pi - 2 * pi * y / Math.pow( 2, z );
			return ( 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );

		}

}


function requestFile( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = callback;
	xhr.send( null );

}



function resetGroups () {

	scene.remove( group, groupCases, groupCasesNew, groupCasesNewGrounded, groupRecoveries, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

	group = new THREE.Group();
	groupCases = new THREE.Group();
	groupCasesNew = new THREE.Group();
	groupCasesNewGrounded = new THREE.Group();
	groupDeaths = new THREE.Group();
	groupDeathsNew = new THREE.Group();
	groupRecoveries = new THREE.Group();
	groupPlacards = new THREE.Group();
	groupLines = new THREE.Group();

	scene.add( group, groupCases, groupCasesNew, groupCasesNewGrounded, groupRecoveries, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

}




//////////

function toggleBars( group = groupCases ) {

	if ( group === window.groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;
		groupRecoveries.visible = true;

		groupCasesNewGrounded.visible = false;

		group = undefined;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;
		groupCasesNewGrounded.visible = false;

		group.visible = true;

	}

	groupPrevious = group;

}



function toggleNewCases ( group = groupCases ) {

	if ( group === groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;
		groupRecoveries.visible = true;

		groupCasesNewGrounded.visible = false;

		group = undefined;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;
		groupCasesNewGrounded.visible = true;
		if ( ! groupCasesNewGrounded.children.length ) {

			const heightsCasesNewGrounded = linesCases.slice( 1 ).map( line => + line[ line.length - 1 ] - line[ line.length - 2 ] );

			const meshesCasesNewGrounded = linesCases.slice( 1 ).map( ( line, index ) =>
				addBar( line[ 2 ], line[ 3 ], index, "cyan", 0.6, heightsCasesNewGrounded[ index ], 0, 12, 1, false ) );

			groupCasesNewGrounded.add( ...meshesCasesNewGrounded );

		}

	}

	groupPrevious = group;

}



function addBar( lat, lon, index, color = "red", radius = 0.4, height = 0, offset = 0, radialSegments = 12, heightSegments = 1, openEnded = true ) {

	//console.log( 'rad', radius );
	if ( ! height || height === 0 ) { return new THREE.Mesh(); }

	const heightScaled = scaleHeights * height;

	let p1 = THR.latLonToXYZ( 50 + ( offset + 0.5 * heightScaled ), lat, lon );
	let p2 = THR.latLonToXYZ( 100, lat, lon );

	let geometry = new THREE.CylinderGeometry( radius, radius, heightScaled, radialSegments, heightSegments, openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;
	//mesh.name = rows[ index ][ 0 ];

	return mesh;

}



/////////

function displayStats ( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow ) {

	// [text], scale, color, x, y, z )
	// groupPlacards.add( THR.drawPlacard( "Null Island", "0.01", 1, 80, 0, 0 ) );

	vGlo = THR.latLonToXYZ( 65, 50, -20 );
	groupPlacards.add( THR.drawPlacard( totalsGlobal, "0.02", 200, vGlo.x, vGlo.y, vGlo.z ) );

	vChi = THR.latLonToXYZ( 70, 45, 110 );
	groupPlacards.add( THR.drawPlacard( totalsChina, "0.02", 1, vChi.x, vChi.y, vChi.z ) );

	const vEur = THR.latLonToXYZ( 60, 55, 20 );
	groupPlacards.add( THR.drawPlacard( totalsEurope, "0.02", 120, vEur.x, vEur.y, vEur.z ) );

	const vUsa = THR.latLonToXYZ( 60, 40, -120 );
	groupPlacards.add( THR.drawPlacard( totalsUsa, "0.02", 60, vUsa.x, vUsa.y, vUsa.z ) );

	const vRow = THR.latLonToXYZ( 55, 30, 180 );
	groupPlacards.add( THR.drawPlacard( totalsRow, "0.02", 180, vRow.x, vRow.y, vRow.z ) );


	divStats.innerHTML = `
<details id=detStats >

	<summary id=sumStats ><b>global data ${ today || "" }</b></summary>

	<p>
		${ totalsGlobal.join( "<br>" ).replace( /Global totals/, "<b>Global totals</b>" ) }
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

	<p>
		${ totalsChina.join( "<br>" ).replace( /China/, "<b>China</b>" ) }
	</p>

</details>`;

	detStats.open = window.innerWidth > 640;

}



//////////

function getCountries () {

	let countries = linesCases.map( line => line[ 1 ] );

	countries = [ ...new Set( countries ) ];

	//console.log( 'countries', countries );

	const options = countries.map( country => `<option>${ country }</option>` );

	divCountries.innerHTML = `
<select id=selCountries onchange=getProvince(this.value) style=width:100%; >${ options }</select>
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

function getNotes () {

	divSettings.innerHTML = `<details id=detSettings ontoggle=getNotesContent() >

		<summary><b>notes & settings</b></summary>

		<div id=divNoteSettings ></div>

	</details>`;

}



function getNotesContent () {

	DMTdragParent.hidden = !DMTdragParent.hidden;

	divMessage.innerHTML = `

	<div >

		<p>
			<i>Why are there messages in the background?</i></p>
		<p>
			An early visitor to our tracker raised this issue
			"<a href="https://github.com/ladybug-tools/spider-covid-19-viz-3d/issues/5" target="_blank">Expressions of Hope</a>"<br>
			Oleg asked "I wonder if we could show positive tweets and expressions of hope and gratitude for the courage of health workers around the world."
		</p>

		<p>
			What you see is our first attempt to provide Oleg with some delight.<br>
			&bull; Zoom out then rotate. Trying to read the messages on a phone is a little guessing game.<br>
			&bull; The text is huge and leaves much white space. This is so you are not totally distracted while looking at the data.
		</p>

		<hr>

		<p>US States new cases data coming soon</p>

		<p>Black bar flare indicates high deaths to cases ratio.</p>

		<p>Cyan bar flare indicates rapid increase in new cases compared to number of previous cases.</p>

		<p>
			Not all populations and GDPs are reported.
		</p>

	</div>`;

}



//////////

function onDocumentTouchStart ( event ) {

	//event.preventDefault();

	event.clientX = event.touches[ 0 ].clientX;
	event.clientY = event.touches[ 0 ].clientY;

	onDocumentMouseMove( event );

}


function onDocumentMouseMove ( event ) {
	//console.log( 'event THR ', event.target, event.target.id );

	//event.preventDefault();

	if ( event.target.id ) { return; }

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( groupCases.children );

	if ( intersects.length > 0 ) {

		if ( intersected !== intersects[ 0 ].object ) {

			intersected = intersects[ 0 ].object;

			DMTdragParent.style.overflow = "auto";
			DMTdragParent.hidden = false;

			DMT.setTranslate( 0, 0, DMTdragItem );

			DMTdragParent.style.left = ( event.clientX ) + "px";
			DMTdragParent.style.top = event.clientY + "px";

			DMTdragParent.style.width = "40ch";

			displayMessage();

		}

	} else {

		intersected = null;
		DMTdragParent.hidden = true;
		divMessage.innerHTML = "";

	}

}



function getBars2D ( arr ) {

	arr.reverse();

	const max = Math.max( ...arr );
	const scale = 100 / max;
	const dateStrings = linesCases[ 0 ].slice( 4 ).reverse();

	const bars = arr.map( ( item, index ) =>
		`<div style="background-color: cyan; color: black; margin-top:1px; height:1ch; width:${ scale * item }%;"
			title="date: ${ dateStrings[ index ] } new cases : ${ item.toLocaleString() }">&nbsp;</div>`
	).join( "" );

	return `<div style="background-color:pink;width:95%;"
		title="New cases per day. Latest at top.The curve you hope to see flatten!" >${ bars }
	</div>`;

}