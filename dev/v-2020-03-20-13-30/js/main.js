// copyright 2020 Spider contributors. MIT license.
// 2020-03-20
/* globals THREE, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */
// jshint esversion: 6
// jshint loopfunc: true


const pathAssets = "../../assets/";
const path = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_daily_reports/";

aSource.href = "https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
imgIcon.src = "https://pushme-pullyou.github.io/github-mark-32.png";

sTitle.innerHTML = document.title ? document.title : location.href.split( '/' ).pop().slice( 0, - 5 ).replace( /-/g, ' ' );
const version = document.head.querySelector( "[ name=version ]" );
sVersion.innerHTML = version ? version.content : "";
//divDescription.innerHTML = document.head.querySelector( "[ name=description ]" ).content;


let lines;
let json;
let yesterday;
let linesYesterday;
let intersected;
let group = new THREE.Group();
let groupLines;
let mesh;
let renderer, camera, controls, scene;


THR.init();
THR.animate();

init();



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

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );

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

	const today = names[ names.length - 2 ];
	//console.log( today );

	yesterday = names[ names.length - 3 ];
	//console.log( 'yesterday', yesterday );

	requestFile( path + today, onLoad );

}



function onLoad ( xhr ) {

	group = new THREE.Group();
	scene.add( group );

	let response = xhr.target.response;
	response = response.replace( /"Korea, South"/, "South Korea" )
		.replace( /"Gambia, The"/, "The Gambia" )
		.replace( /"Bahamas, The"/, "The Bahamas" );
	//.replace( /"Virgin Islands,/, "Virgin Islands");

	lines = response.split( "\n" ).map( line => line.split( "," ) ).slice( 1, -1 );
	//console.log( 'lines', lines );

	const date = new Date().toISOString();

	lines.push( [ "Test Case", "Null Island", date, "abc", "", "-3.333", "0", "0" ] );

	lines.forEach( ( line, index ) => addIndicator( line, index ) );

	requestFile( path + yesterday, onLoadYesterday );

}



function onLoadYesterday ( xhr ) {

	let response = xhr.target.response;

	linesYesterday = response.split( "\n" ).map( line => line.split( "," ) ).slice( 1, -1 );
	//console.log( 'lines', lines );

	lines.forEach( ( line, index ) => addIndicatorNew( line, index ) );

	getStats();

}



function addIndicator ( line, index ) {

	const height = 0.2 * Math.sqrt( Number( line[ 3 ] ) || 1 );
	const heightDeaths = 0.2 * Math.sqrt( Number( line[ 4 ] ) || 1 );
	const heightRecoveries = 0.2 * Math.sqrt( Number( line[ 5 ] ) || 1 );

	let p1 = latLonToXYZ( 50 + 0.5 * height, Number( line[ 6 ] ), Number( line[ 7 ] ), index );
	let p2 = latLonToXYZ( 100, Number( line[ 6 ] ), Number( line[ 7 ] ), index );

	let geometry = new THREE.CylinderGeometry( 0.4, 0.4, height );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: "red" } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	group.add( mesh );


	p1 = latLonToXYZ( 50 + 0.5 * heightDeaths, Number( line[ 6 ] ), Number( line[ 7 ] ), index );
	p2 = latLonToXYZ( 100, Number( line[ 6 ] ), Number( line[ 7 ] ), index );

	let dToC = Number( line[ 3 ] ) > 0 ? 5 * Number( line[ 4 ] ) / Number( line[ 3 ] ) : 0;
	dToC = dToC < 1 ? dToC : 1;
	//console.log( 'dc', dToC );

	geometry = new THREE.CylinderBufferGeometry( 0.5, 0.5 + dToC, heightDeaths, 12, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	material = new THREE.MeshPhongMaterial( { color: "black", side: 2 } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;


	group.add( mesh );

	p1 = latLonToXYZ( 50 + 0.5 * heightRecoveries, Number( line[ 6 ] ), Number( line[ 7 ] ), index );
	p2 = latLonToXYZ( 100, Number( line[ 6 ] ), Number( line[ 7 ] ), index );

	geometry = new THREE.CylinderBufferGeometry( 0.45, 0.45, heightRecoveries, 12, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	material = new THREE.MeshPhongMaterial( { color: "green" } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	group.add( mesh );

}



function addIndicatorNew ( line, index ) {

	const state = line[ 0 ];
	const country = line[ 1 ];

	const lineNew = linesYesterday.filter( line => line[ 0 ] === state && line[ 1 ] === country );
	//console.log( 'ln',line[ 3 ]);

	//if ( !lineNew.length ){ return; };

	const str = lineNew.length ? lineNew[ 0 ][ 3 ] : "";

	const num = str ? Number( str ) : Number( line[ 3 ] );

	const casesNew = Math.abs( Number( line[ 3 ] ) - num );

	lines[ index ].push( casesNew );
	//console.log( 'casesNew', casesNew, line );

	group.add( mesh );

	if ( casesNew < 1 ) { return; }

	const heightCases = 0.2 * Math.sqrt( Number( line[ 3 ] ) || 0 );
	//	const heightNew = 0.2 * Math.sqrt( casesNew || 1 );

	const cases = Number( line[ 3 ] );
	const heightRatio = cases ? casesNew / cases : 0;
	//console.log( 'heightRatio', heightRatio );

	const height = heightCases * heightRatio;
	//console.log( 'height', height );

	const p1 = latLonToXYZ( 50 + heightCases - 0.5 * height, Number( line[ 6 ] ), Number( line[ 7 ] ), index );
	const p2 = latLonToXYZ( 100, Number( line[ 6 ] ), Number( line[ 7 ] ), index );

	const geometry = new THREE.CylinderBufferGeometry( 0.45, 0.45 + heightRatio, height, 12, 1, true );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	const material = new THREE.MeshPhongMaterial( { color: "cyan", opacity: 0.8, side: 2, transparent: true } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;

	group.add( mesh );

}



function latLonToXYZ ( radius, lat, lon, index ) {

	const pi2 = Math.PI / 2;

	lat = Number( lat ) * Math.PI / 180;
	lon = Number( lon ) * Math.PI / 180;
	//console.log( "lat/lon", lat, lon, index);

	const x = radius * Math.sin( lat + pi2 ) * Math.cos( lon );
	const y = radius * Math.sin( lat + pi2 ) * Math.sin( lon );
	const z = radius * Math.cos( lat - pi2 );

	return new THREE.Vector3( x, y, z );

}


/////////

function getStats () {

	const europe = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "EstoniaF", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Holy See" ];

	const globalCases = lines.reduce( ( sum, line ) => {
		let cases = Number( line[ 3 ] );
		cases = isNaN( cases ) ? 0 : cases;
		return sum + cases;
	}, 0 );
	//console.log( '', globalCases);

	const globalCasesNew = lines.reduce( ( sum, line ) => {
		let caseNew = Number( line[ 8 ] );
		caseNew = isNaN( caseNew ) ? 0 : caseNew;
		return sum + caseNew;
	}, 0 );


	const globalDeaths = lines.reduce( ( sum, line ) => sum + Number( line[ 4 ] ), 0 );
	const globalRecoveries = lines.reduce( ( sum, line ) => sum + Number( line[ 5 ] ), 0 );
	const globalDeathsToCases = 100 * ( globalDeaths / globalCases );

	const chinaDeaths = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ 4 ] ) : 0, 0 );
	const chinaCasesNew = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? line[ 8 ] : 0, 0 );
	const chinaCases = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ 3 ] ) : 0, 0 );
	const chinaRecoveries = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ 5 ] ) : 0, 0 );
	const chinaDeathsToCases = 100 * chinaDeaths / chinaCases;

	const europeDeaths = lines.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ?
	Number( line[ 4 ] ) : 0, 0 );
	const europeCasesNew = lines.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? line[ 8 ] : 0, 0 );
	const europeCases = lines.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? Number( line[ 3 ] ) : 0, 0 );
	const europeRecoveries = lines.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? Number( line[ 5 ] ) : 0, 0 );
	const europeDeathsToCases = 100 * europeDeaths / europeCases;

	const usaCases = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ 3 ] ) : 0, 0 );
	const usaCasesNew = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? line[ 8 ] : 0, 0 );
	const usaDeaths = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ 4 ] ) : 0, 0 );
	const usaRecoveries = lines.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ 5 ] ) : 0, 0 );
	const usaDeathsToCases = 100 * ( usaDeaths / usaCases );

	const rowCases = globalCases - chinaCases - europeCases - usaCases;
	const rowCasesNew = globalCasesNew - chinaCasesNew - europeCasesNew - usaCasesNew;
	const rowDeaths = globalDeaths - chinaDeaths - europeDeaths - usaDeaths;
	const rowRecoveries = globalRecoveries - chinaRecoveries - europeRecoveries - usaRecoveries;
	const rowDeathsToCases = 100 * ( rowDeaths / rowCases );

	divStats.innerHTML = `<details id=detStats>

	<summary><b>global statistics</b></summary>
	<p>
		<b>global totals</b><br>
		cases: ${ globalCases.toLocaleString() }<br>
		cases new: ${ globalCasesNew.toLocaleString() }<br>
		deaths: ${ globalDeaths.toLocaleString() }<br>
		recoveries: ${ globalRecoveries.toLocaleString() }<br>
		deaths/cases %: ${ globalDeathsToCases.toLocaleString() }<br>
	</p>

	<p>
		<b>China totals</b><br>
		cases: ${ chinaCases.toLocaleString() }<br>
		cases new: ${ chinaCasesNew.toLocaleString() }<br>
		deaths: ${ chinaDeaths.toLocaleString() }<br>
		recoveries: ${ chinaRecoveries.toLocaleString() }<br>
		deaths/cases %: ${ chinaDeathsToCases.toLocaleString() }<br>
	</p>

	<p>
	<b>Europe totals</b><br>
		cases: ${ europeCases.toLocaleString() }<br>
		cases new: ${ europeCasesNew.toLocaleString() }<br>
		deaths: ${ chinaDeaths.toLocaleString() }<br>
		recoveries: ${ europeRecoveries.toLocaleString() }<br>
		deaths/cases %: ${ europeDeathsToCases.toLocaleString() }<br>
	</p>

	<p>
		<b>USA totals</b><br>
		cases: ${ usaCases.toLocaleString() }<br>
		cases new: ${ usaCasesNew.toLocaleString() }<br>
		deaths: ${ usaDeaths.toLocaleString() }<br>
		recoveries: ${ usaRecoveries.toLocaleString() }<br>
		deaths/cases %: ${ usaDeathsToCases.toLocaleString() }<br>
	</p>

	<p>
		<b>rest of world totals</b><br>
		cases: ${ rowCases.toLocaleString() }<br>
		cases new: ${ rowCasesNew.toLocaleString() }<br>
		deaths: ${ rowDeaths.toLocaleString() }<br>
		recoveries: ${ rowRecoveries.toLocaleString() }<br>
		deaths/cases %: ${ rowDeathsToCases.toLocaleString() }<br>
	</p>

	</details>`;

	detStats.open = window.innerWidth > 640;

}



function getSettings () {

	divSettings.innerHTML = `<details id=detSettings>

		<summary><b>notes & settings</b></summary>

		<p>Black bar flare indicates high deaths to cases ratio.</p>

		<p>Cyan bar flare indicates rapid increase in new cases compared to number of previous cases.</p>

		<p>Not all populations and GDPs are reported.
			<!--
			Some GDPs are in trillions and some are in billions.
			<a href="https://github.com/nvkelso/natural-earth-vector/tree/master/geojson" target="_blank">Go figure.</a></p>
			-->
			<p>
			<button onclick=controls.reset() >reset view</button>
			<button onclick="controls.autoRotate=!controls.autoRotate">rotation</button>
		</p>

	</details>`;

}




/////////


function onLoadGeoJson ( xhr ) {

	let response = xhr.target.response;

	json = JSON.parse( response );
	//console.log( '', response );

	drawThreeGeo( json, 50, 'sphere', { color: '#888' } );

}



function addLights () {

	scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

	const pointLight = new THREE.PointLight( 0xffffff, 1 );
	pointLight.position.copy( camera.position );
	camera.add( pointLight );

	const lightDirectional = new THREE.DirectionalLight( 0xfffffff, 1 );
	lightDirectional.position.set( -50, -200, 100 );

}



function addGlobe ( size = 50 ) {

	const geometry = new THREE.SphereGeometry( size, 50, 25 );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

	const url = pathAssets + "images/earth_atmos_4096.jpg";
	var texture = new THREE.TextureLoader().load( url );

	const material = new THREE.MeshBasicMaterial( { color: 0xcce0ff, map: texture } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

}



function addSkyBox () {

	scene.background = new THREE.CubeTextureLoader()
		.setPath( pathAssets + "cube-textures/" )
		.load( [ 'f1.jpg', 'f2.jpg', 'f3.jpg', 'f4.jpg', 'f5.jpg', 'f6.jpg' ] );

}


/////////

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

	const intersects = raycaster.intersectObjects( group.children );

	if ( intersects.length > 0 ) {

		if ( intersected !== intersects[ 0 ].object ) {

			intersected = intersects[ 0 ].object;

			const index = intersected.userData;

			const line = lines[ index ];

			const country = line[ 1 ];

			const arr = json.features.filter( feature => feature.properties.NAME === country );

			const feature = arr.length ? arr[ 0 ] : undefined;
			//console.log( 'feature', feature );

			let d2Pop, d2Gdp;

			if ( feature ) {

				const population = feature.properties.POP_EST;
				const gdp = feature.properties.GDP_MD_EST;
				const name = feature.properties.NAME;

				d2Pop = ( 100 * ( Number( line[ 4 ] ) / population ) ).toLocaleString() + "%";
				d2Gdp = ( 100 * ( Number( line[ 4 ] ) / gdp ) ).toLocaleString() + "%";

			} else {

				d2Pop = "not available";
				d2Gdp = "not available";

			}

			const casesNew = line[ 8 ] ? line[ 8 ] : 0;

			divMessage.hidden = false;
			divMessage.style.left = event.clientX + "px";
			divMessage.style.top = event.clientY + "px";
			divMessage.innerHTML = `
			${ ( line[ 0 ] ? "place: " + line[ 0 ] + "<br>" : "" ) }
country: ${ line[ 1 ] }<br>
update: ${ line[ 2 ] }<br>
cases: ${ Number( line[ 3 ] ).toLocaleString() }<br>
cases new: <mark>${ Number( casesNew ).toLocaleString() }</mark><br>
deaths: ${ Number( line[ 4 ] ).toLocaleString() }<br>
recoveries: ${ Number( line[ 5 ] ).toLocaleString() }<br>
deaths/cases: ${ ( 100 * ( Number( line[ 4 ] ) / Number( line[ 3 ] ) ) ).toLocaleString() }%<br>
deaths/population: ${ d2Pop }<br>
deaths/gdp: ${ d2Gdp }<br>
`;

//<hr>
//geoJSON name: ${ name }<br>
//population: ${ population.toLocaleString() }<br>
//</br>gdp: ${ gdp.toLocaleString() }<br>

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";

	}

}
