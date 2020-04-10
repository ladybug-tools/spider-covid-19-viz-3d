// copyright 2020 Spider contributors. MIT license.
// 2020-04-05
/* global THREE, controls, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */


////////// Deployment

let build = "stable";
//let build = "dev";

let timeStamp = "23:56";

let versionStable = "v-2020-04-05";
let versionDev = "v-2020-04-09";

////////// Menu title

let version = build === "dev" ? versionDev : versionStable;

let pathAssets = "../../../assets/";
imgIcon.src = pathAssets + "images/github-mark-32.png";

aSource.href = "https://github.com/ladybug-tools/spider-covid-19-viz-3d/";

spnTitle.innerHTML = document.title; // ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " );
const versionStr = version + "-" + timeStamp + "-" + build;
spnVersion.innerHTML = versionStr;
//divDescription.innerHTML = document.head.querySelector( "[ name=description ]" ).content;

spnDescription.innerHTML = `
View and track <a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic" target="_blank">COVID-19</a> pandemic data for the entire world
sourced from multiple authoritative providers
in interactive 3D using JavaScript <a href="https://threeja.org" target="_blank">Three.js</a> WebGL tools.
`

////////// Info messages



////////// Pop-up messages

let messageInfo = `
<ul>
	<li title="Or press any key or scroll mouse">Touch the screen to stop rotating</li>
	<li title="Press left mouse or drag touch to rotate" >Two fingers or mouse wheel to zoom</li>
	<li title="It may take a few seconds for data to arrive" >Touch the bars to pop-up statistics</li>
</ul>`;

let messageOfTheDayStable = `
<mark>
New for 2020-04-05
	<li>Left menu reorganized, code cleaned</li>
	<li>Add more info boxes</li>
	<li>JHU TimeSeries: calculates and shows new percentages</li>
</ul>
</mark>
`;

let messageOfTheDayDev = `
<mark>
New for 2020-04-06
<ul>
	<li>Nothing new yet</li>
	<li>What would *you* like to see here?</li>
</ul>
</mark>`;


//////////


let group = new THREE.Group();
let groupCases = new THREE.Group();
let groupCasesNew = new THREE.Group();
let groupCasesNewGrounded = new THREE.Group();
let groupRecoveries = new THREE.Group();
let groupDeaths = new THREE.Group();
let groupDeathsNew = new THREE.Group();
let groupDeathsNewGrounded = new THREE.Group();
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

//let intersected;

let scene, camera, controls, renderer;

let scaleHeights = 0.0003;

THR.init();
THR.animate();



//initMain(); // see html

function initMain() {

	scene = THR.scene;
	camera = THR.camera;
	controls = THR.controls;
	renderer = THR.renderer;


	GLO.addLights();

	GLO.addGlobe();

	GLO.addSkyBox();

	getNotes();

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );

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

	scene.remove( group, groupCases, groupCasesNew, groupCasesNewGrounded, groupRecoveries,
		groupDeaths, groupDeathsNew, groupDeathsNewGrounded, groupPlacards, groupLines );

	group = new THREE.Group();
	groupCases = new THREE.Group();
	groupCasesNew = new THREE.Group();
	groupCasesNewGrounded = new THREE.Group();
	groupDeaths = new THREE.Group();
	groupDeathsNew = new THREE.Group();
	groupDeathsNewGrounded = new THREE.Group();
	groupRecoveries = new THREE.Group();
	groupPlacards = new THREE.Group();
	groupLines = new THREE.Group();

	scene.add( group, groupCases, groupCasesNew, groupCasesNewGrounded, groupRecoveries,
		groupDeaths, groupDeathsNew, groupDeathsNewGrounded, groupPlacards, groupLines );

}




////////// Interactive Legend

function toggleBars ( group = groupCases ) {
	//console.log( 'group', group  );

	if ( group === groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;
		groupRecoveries.visible = true;

		groupCasesNewGrounded.visible = false;
		groupDeathsNewGrounded.visible = false;

		group = undefined;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;

		groupCasesNewGrounded.visible = false;
		groupDeathsNewGrounded.visible = false;

		group.visible = true;

		groupPrevious = group;

	}

}



function toggleNewCases ( group = groupCases ) {

	if ( group === groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;
		groupRecoveries.visible = true;

		groupCasesNewGrounded.visible = false;
		groupDeathsNewGrounded.visible = false;

		group = undefined;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;

		groupCasesNewGrounded.visible = group === groupCasesNewGrounded ? true : false;
		groupDeathsNewGrounded.visible = group === groupDeathsNewGrounded ? true : false;

		if ( ! groupCasesNewGrounded.children.length ) {

			const heightsCasesNewGrounded = linesCases.slice( 1 ).map( line => + line[ line.length - 1 ] - line[ line.length - 2 ] );

			const meshesCasesNewGrounded = linesCases.slice( 1 ).map( ( line, index ) =>
				addBar( line[ 2 ], line[ 3 ], index, "cyan", 0.6, heightsCasesNewGrounded[ index ], 0, 12, 1, false ) );

			groupCasesNewGrounded.add( ...meshesCasesNewGrounded );

		}

		if ( ! groupDeathsNewGrounded.children.length ) {

			const heightsCasesDeathsNewGrounded = linesDeaths.slice( 1 ).map( line => + line[ line.length - 1 ] - line[ line.length - 2 ] );
			console.log( 'heightsCasesDeathsNewGrounded', heightsCasesDeathsNewGrounded );

			const meshesCasesDeathsNewGrounded = linesDeaths.slice( 1 ).map( ( line, index ) =>
				addBar( line[ 2 ], line[ 3 ], index, "gray", 0.6, heightsCasesDeathsNewGrounded[ index ], 0, 12, 1, false ) );

			groupDeathsNewGrounded.add( ...meshesCasesDeathsNewGrounded );

		}

		groupPrevious = group;

	}

}



//////////

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

	<summary id=sumStats >global data

	<span class="couponcode">&#x24d8;<span id=spnDescription class="coupontooltip">
		Data below is calculated by the script running in your browser and may not be accurate.
	</span></span>

	</summary>

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

function getNotes () {

	divSettings.innerHTML = `<details id=detSettings ontoggle=getNotesContent() >

		<summary>
			notes & settings
		</summary>

		<div id=divNoteSettings >Nothing much here yet. Work-in-progress.</div>

	</details>`;

}



function getNotesContent () {

	DMTdivParent.hidden = false

	DMTdivContent.innerHTML = `

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

function getBars2D ( arr ) {

	arr.reverse();

	const max = Math.max( ...arr );
	const scale = 100 / max;
	const dateStrings = linesCases[ 0 ].slice( 4 ).reverse();

	const bars = arr.map( ( item, index ) =>
		`<div style="background-color: cyan; color: black; margin-top:1px; height:1ch; width:${ scale * item }%;"
			title="date: ${ dateStrings[ index ] } new cases : ${ item.toLocaleString() }">&nbsp;</div>`
	).join( "" );

	//ht = DMTdivContainer.clientHeight - 00 + "px";

	return `<div style="background-color:pink;width:100%;"
		title="New cases per day. Latest at top.The curve you hope to see flatten!" >${ bars }
	</div>`;

}