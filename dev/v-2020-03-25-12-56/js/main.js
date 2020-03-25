// copyright 2020 Spider contributors. MIT license.
// 2020-03-20
/* globals THREE, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */
// jshint esversion: 6
// jshint loopfunc: true


let pathAssets = "../../assets/"; // change in html of stable


aSource.href = "https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
imgIcon.src = "https://pushme-pullyou.github.io/github-mark-32.png";

sTitle.innerHTML = document.title ? document.title : location.href.split( '/' ).pop().slice( 0, - 5 ).replace( /-/g, ' ' );
const version = document.head.querySelector( "[ name=version ]" );
sVersion.innerHTML = version ? version.content : "";
//divDescription.innerHTML = document.head.querySelector( "[ name=description ]" ).content;

let group = new THREE.Group();
let groupCases = new THREE.Group();
let groupCasesNew = new THREE.Group();
let groupDeaths = new THREE.Group();
let groupDeathsNew = new THREE.Group();
let groupPlacards = new THREE.Group();
let groupLines = new THREE.Group();

let geoJson;
let yesterday;
let linesYesterday;
let intersected;

let mesh;
let scene, camera, controls, renderer;


THR.init();
THR.animate();

//init();


function init () {

	scene = THR.scene;
	camera = THR.camera;
	controls = THR.controls;
	renderer = THR.renderer;


	// const url = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports";

	//const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	const dataJhu = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

	requestFile( dataJhu, onLoadCases );


	//const dataJhuDeaths = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
	const dataJhuDeaths = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

	requestFile( dataJhuDeaths, onLoadDeaths );


	const urlJsonStatesProvinces = pathAssets + "json/ne_50m_admin_1_states_provinces_lines.geojson";

	requestFile( urlJsonStatesProvinces, onLoadGeoJson );

	const urlJsonChina = pathAssets + "json/china.geojson";

	requestFile( urlJsonChina, onLoadGeoJson );

	const urlJson = pathAssets + "json/ne_110m_admin_0_countries_lakes.geojson";

	requestFile( urlJson, onLoadGeoJson );


	addLights();

	addGlobe();

	addSkyBox();

	getNotes();


	//NCD.init();

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

	scene.remove( group, groupCases, groupCasesNew, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

	group = new THREE.Group();
	groupCases = new THREE.Group();
	groupCasesNew = new THREE.Group();
	groupDeaths = new THREE.Group();
	groupDeathsNew = new THREE.Group();
	groupPlacards = new THREE.Group();
	groupLines = new THREE.Group();

	scene.add( group, groupCases, groupCasesNew, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

}



function onLoadCases ( xhr ) {

	resetGroups();

	divDates.innerHTML = `<select id=selDate onchange=updateBars(this.selectedIndex); size=10 style=width:100%; ></select>`;

	response = xhr.target.response;

	response = response.replace( /"Korea, South"/, "South Korea" );
	// 	.replace( /"Gambia, The"/, "The Gambia" )
	// 	.replace( /"Bahamas, The"/, "The Bahamas" );
	// .replace( /"Virgin Islands,/, "Virgin Islands");

	linesCases = response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'lines', lines );

	const dates = linesCases[ 0 ].slice( 4 );

	selDate.innerHTML = dates.map( date => `<option>${ date }</option>` );

	selDate.selectedIndex = dates.length - 1;

}



function onLoadDeaths ( xhr ) {

	linesDeaths = xhr.target.response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'linesDeaths', linesDeaths );

	updateBars( linesDeaths[ 0 ].length - 1 );

	getStats();

}



function updateBars ( indexDate ) {

	resetGroups();

	heightsCases = linesCases.map( line => line[ indexDate ] );
	//console.log( 'heights', heightsCases );

	meshesCases = linesCases.map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "red", 0.4, heightsCases[ index ] ) );

	groupCases.add( ...meshesCases.slice( 1 ) );


	casesNew = linesCases.slice( 1 ).map( line => line[ indexDate ] - line[ indexDate - 1 ] );
	heightsCasesNew = linesCases.map( line => Math.sqrt( line[ indexDate ] - line[ indexDate - 1 ] ) );

	//line[ indexDate] * ( line[ indexDate ] - line[ indexDate - 1 ] ) / line[ indexDate ] );

	//console.log( 'heightsCasesNew ', heightsCasesNew );

	offsetsCasesNew = heightsCases.map( ( height, index ) => 0.2 * Math.sqrt( height ) - 0.2 * Math.sqrt( heightsCasesNew[ index ] ) );

	meshesCasesNew = linesCases.map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "cyan", 0.6, heightsCasesNew[ index ], offsetsCasesNew[ index ] ) );

	groupCasesNew.add( ...meshesCasesNew.slice( 1 ) );


	heightsDeaths = linesDeaths.map( line => line[ indexDate ] );
	//console.log( 'heightsDeaths', heightsDeaths );

	meshesDeath = linesDeaths.map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeath.slice( 1 ) );


	heightsDeathsNew = linesDeaths.map( line => line[ indexDate ] - line[ indexDate - 1 ] );

	offsetsDeathsNew = heightsDeaths.map( ( height, index ) => 0.2 * Math.sqrt( height ) - 0.2 * Math.sqrt( heightsDeathsNew[ index ] ) );

	meshesDeathsNew = linesDeaths.map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "gray", 0.6, heightsDeathsNew[ index ], offsetsDeathsNew[ index ] ) );

	groupDeathsNew.add( ...meshesDeathsNew.slice( 1 ) );

}



function addBar ( lat, lon, index, color = "red", radius = 0.4, height = 1, offset = 0 ) {

	heightScaled = 0.2 * Math.sqrt( height );

	let p1 = latLonToXYZ( 50 + ( offset + 0.5 * heightScaled ), lat, lon );
	let p2 = latLonToXYZ( 100, lat, lon );

	let geometry = new THREE.CylinderGeometry( radius, radius, heightScaled, 12, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	return mesh;

}



function latLonToXYZ ( radius, lat, lon ) {

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

	const index = 4 + selDate.selectedIndex;

	const globalCases = linesCases.slice( 1 ).reduce( ( sum, line ) => {
		let cases = Number( line[ index ] );
		return sum + cases;
	}, 0 );
	//console.log( 'globalCases', globalCases );

	const globalCasesNew = linesCases.slice( 1 ).reduce( ( sum, line ) => sum + ( line[ index ] - line[ index - 1 ] ), 0 );
	//console.log( 'globalCasesNew', globalCasesNew );
	const globalDeaths = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum + Number( line[ index ] ), 0 );
	const globalDeathsNew = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum + ( line[ index ] - line[ index - 1 ] ), 0 );
	const globalDeathsToCases = 100 * ( globalDeaths / globalCases );

	const chinaCases = linesCases.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ index ] ) : 0, 0 );
	const chinaCasesNew = linesCases.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const chinaDeaths = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ index ] ) : 0, 0 );
	const chinaDeathsNew = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const chinaDeathsToCases = 100 * chinaDeaths / chinaCases;

	const europeCases = linesCases.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? Number( line[ index ] ) : 0, 0 );
	const europeCasesNew = linesCases.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const europeDeaths = linesDeaths.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? Number( line[ index ] ) : 0, 0 );
	const europeDeathsNew = linesDeaths.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? ( line[ index ] - line[ index - 1 ] ) : 0, 0 );
	const europeDeathsToCases = 100 * europeDeaths / europeCases;

	const usaCases = linesCases.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ index ] ) : 0, 0 );
	const usaCasesNew = linesCases.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const usaDeaths = linesDeaths.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ index ] ) : 0, 0 );
	const usaDeathsNew = linesDeaths.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? ( line[ index ] - line[ index - 1 ] ) : 0, 0 );
	const usaDeathsToCases = 100 * ( usaDeaths / usaCases );

	const rowCases = globalCases - chinaCases - europeCases - usaCases;
	const rowCasesNew = globalCasesNew - chinaCasesNew - europeCasesNew - usaCasesNew;
	const rowDeaths = globalDeaths - chinaDeaths - europeDeaths - usaDeaths;
	const rowDeathsNew = globalDeathsNew - chinaDeathsNew - europeDeathsNew - usaDeathsNew;
	const rowDeathsToCases = 100 * ( rowDeaths / rowCases );


	// [text], scale, color, x, y, z )
	groupPlacards.add( THR.drawPlacard( "Null Island", "0.01", 1, 80, 0, 0 ) );

	const totalsGlobal = [
		`Global`,
		`cases: ${ globalCases.toLocaleString() }`,
		`cases new: ${ globalCasesNew.toLocaleString() }`,
		`deaths: ${ globalDeaths.toLocaleString() }`,
		`deaths new: ${ globalDeathsNew.toLocaleString() }`,
		`deaths/cases: ${ globalDeathsToCases.toLocaleString() }%`
	];
	vGlo = latLonToXYZ( 75, 65, -20 );
	groupPlacards.add( THR.drawPlacard( totalsGlobal, "0.02", 200, vGlo.x, vGlo.y, vGlo.z ) );

	const totalsChina = [
		`China`,
		`cases: ${ chinaCases.toLocaleString() }`,
		`cases today: ${ chinaCasesNew.toLocaleString() }`,
		`deaths: ${ chinaDeaths.toLocaleString() }`,
		`deaths new: ${ chinaDeathsNew.toLocaleString() }`,
		`deaths/cases: ${ chinaDeathsToCases.toLocaleString() }%`
	];
	vChi = latLonToXYZ( 85, 50, 110 );
	groupPlacards.add( THR.drawPlacard( totalsChina, "0.02", 1, vChi.x, vChi.y, vChi.z ) );

	const totalsEurope = [
		`Europe`,
		`cases: ${ europeCases.toLocaleString() }`,
		`cases today: ${ europeCasesNew.toLocaleString() }`,
		`deaths: ${ europeDeaths.toLocaleString() }`,
		`deaths new: ${ europeDeathsNew.toLocaleString() }`,
		`deaths/cases: ${ europeDeathsToCases.toLocaleString() }%`
	];
	const vEur = latLonToXYZ( 80, 60, 20 );
	groupPlacards.add( THR.drawPlacard( totalsEurope, "0.02", 120, vEur.x, vEur.y, vEur.z ) );

	const totalsUsa = [
		`USA`,
		`cases: ${ usaCases.toLocaleString() }`,
		`cases today: ${ usaCasesNew.toLocaleString() }`,
		`deaths: ${ usaDeaths.toLocaleString() }`,
		`deaths new: ${ usaDeathsNew.toLocaleString() }`,
		`deaths/cases: ${ usaDeathsToCases.toLocaleString() }%`
	];
	const vUsa = latLonToXYZ( 80, 40, -120 );
	groupPlacards.add( THR.drawPlacard( totalsUsa, "0.02", 60, vUsa.x, vUsa.y, vUsa.z ) );

	const totalsRow = [
		`Rest of World`,
		`cases: ${ rowCases.toLocaleString() }`,
		`cases today: ${ rowCasesNew.toLocaleString() }`,
		`deaths: ${ rowDeaths.toLocaleString() }`,
		`deaths new: ${ rowDeathsNew.toLocaleString() }`,
		`deaths/cases: ${ rowDeathsToCases.toLocaleString() }%`
	];
	const vRow = latLonToXYZ( 90, 30, 180 );
	groupPlacards.add( THR.drawPlacard( totalsRow, "0.02", 180, vRow.x, vRow.y, vRow.z ) );


	divStats.innerHTML = `<details id=detStats>

	<summary><b>global data </b></summary>

	<p>
		<b>global totals </b><br>
		cases: ${ globalCases.toLocaleString() }<br>
		cases new: ${ globalCasesNew.toLocaleString() }<br>
		deaths: ${ globalDeaths.toLocaleString() }<br>
		deaths new: ${ globalDeathsNew.toLocaleString() }<br>
		deaths/cases: ${ globalDeathsToCases.toLocaleString() }%<br>
	</p>

	<p>
		<b>China totals</b><br>
		cases: ${ chinaCases.toLocaleString() }<br>
		cases new: ${ chinaCasesNew.toLocaleString() }<br>
		deaths: ${ chinaDeaths.toLocaleString() }<br>
		deaths new: ${ chinaDeathsNew.toLocaleString() }<br>
		deaths/cases: ${ chinaDeathsToCases.toLocaleString() }%<br>
	</p>

	<p>
		<b>Europe totals</b><br>
		cases: ${ europeCases.toLocaleString() }<br>
		cases new: ${ europeCasesNew.toLocaleString() }<br>
		deaths: ${ europeDeaths.toLocaleString() }<br>
		deaths new: ${ europeDeathsNew.toLocaleString() }<br>
		deaths/cases: ${ europeDeathsToCases.toLocaleString() }%<br>
	</p>

	<p>
		<b>USA totals</b><br>
		cases: ${ usaCases.toLocaleString() }<br>
		cases new: ${ usaCasesNew.toLocaleString() }<br>
		deaths: ${ usaDeaths.toLocaleString() }<br>
		deaths new: ${ usaDeathsNew.toLocaleString() }<br>
		deaths/cases: ${ usaDeathsToCases.toLocaleString() }%<br>
	</p>

		<p>
		<b>rest of world totals</b><br>
		cases: ${ rowCases.toLocaleString() }<br>
		cases today: ${ rowCasesNew.toLocaleString() }<br>
		deaths: ${ rowDeaths.toLocaleString() }<br>
		deaths new: ${ rowDeathsNew.toLocaleString() }<br>
		deaths/cases: ${ rowDeathsToCases.toLocaleString() }%<br>
	</p>

	</details>`;

	//detStats.open = window.innerWidth > 640;

}



function getNotes () {

	divSettings.innerHTML = `<details id=detSettings ontoggle=getNotesContent() >

		<summary><b>notes & settings</b></summary>

		<div id=divNoteSettings ></div>

	</details>`;

}



function getNotesContent () {


	divNoteSettings.innerHTML = `

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


function toggleBars ( group = groupCases ) {

	if ( group === window.groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
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

			const line = linesCases[ index ];
			//console.log( 'line', line );

			const lineDeaths = linesDeaths[ index ];

			const casesNew = line.slice( 5 ).map( ( cases, index ) => cases - line[ 5 + index - 1 ] );
			//console.log( 'cb', casesNew );

			const dateIndex = selDate.selectedIndex > -1 ? 4 + selDate.selectedIndex : line.length - 1;

			let country = line[ 1 ];
			const place = line[ 0 ];

			if ( country === "US" ) { country = "United States of America"; }
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
				d2Pop = ( ( lineDeaths[ dateIndex ] * 100000 / population ) ).toLocaleString();
				d2Gdp = ( line[ dateIndex ] / ( 1000000 * gdp / population ) ).toLocaleString() + "";

			} else {

				d2Pop = "not available";
				d2Gdp = "not available";

			}

			//detNCD.hidden = false;
			divMessage.hidden = false;
			divMessage.style.left = event.clientX + "px";
			divMessage.style.top = event.clientY + "px";
			divMessage.innerHTML = `
<a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data" target="_blank">JHU data</a> - updates daily<br>
${ ( place ? "place: " + place + "<br>" : "" ) }
country: ${ country }<br>
cases: ${ Number( line[ dateIndex ] ).toLocaleString() }<br>
cases today: <mark>${ ( line[ dateIndex ] - line[ dateIndex - 1 ] ).toLocaleString() }</mark><br>
deaths: ${ Number( lineDeaths[ dateIndex ] ).toLocaleString() }<br>
deaths new: ${  ( lineDeaths[ dateIndex ] - lineDeaths[ dateIndex - 1 ] ).toLocaleString() }<br>
deaths/cases: ${ ( 100 * ( Number( lineDeaths[ dateIndex ] ) / Number( line[ dateIndex ] ) ) ).toLocaleString() }%<br>
<hr>
deaths/100K persons: ${ d2Pop }<br>
cases/(gdp/pop): ${ d2Gdp }<br>
<b title="Latest day at top" >New cases per day</b><br>
${ getBars( casesNew ) }
`;

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";
		//detNCD.hidden = true;

	}

}


function getBars ( arr ) {

	arr.reverse();

	const max = Math.max( ...arr );
	const scale = 200 / max;
	const dateStrings = linesCases[ 0 ].slice( 4 ).reverse();

	const bars = arr.map( ( item, index ) =>
		`<div style="background-color: cyan; color: black; margin-top:1px; height:0.5ch; width:${ scale * item }px;"
	title="date: ${ dateStrings[ index ] } new cases : ${ item.toLocaleString() }">&nbsp;</div>` ).join( "" );

	return `<div style=background-color:#ddd title="New cases per day. The curve you hope to see flatten!" >${ bars }</div>`;

}