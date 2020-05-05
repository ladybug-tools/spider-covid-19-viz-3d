// copyright 2020 Spider contributors. MIT license.
// 2020-04-05
/* global THREE, controls, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */


////////// Deployment

let build = "stable";
//let build = "dev";

let timeStamp = "1919";

let versionStable = "v-2020-05-04";
let versionDev = "v-2020-05-04";

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
`;

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
New for 2020-05-04
<ul>
		<li>In process of moving this project to <a href="https://glitch.com/@theo-armour" target="_blank">Glitch</a></li>
	<li>See <a href="https://dev.to/theoarmour" target="_blank">posts on Dev.to</a> for details</li>
	<li>Statistics are from <a href="https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data" target="_blank">wikipedia:Template:COVID-19_pandemic_data</a></li>
</ul>
</mark>
`;

let messageOfTheDayDev = `
<mark>
New for 2020-05-04
<ul>
	<li>Nothing new yet</li>
	<li>In process of moving this project to <a href="https://glitch.com/@theo-armour" target="_blank">Glitch</a></li>
	<li>See <a href="https://dev.to/theoarmour" target="_blank">posts on Dev.to</a> for details</li>
	<li>Statistics are from <a href="https://en.wikipedia.org/wiki/Template:COVID-19_pandemic_data" target="_blank">wikipedia:Template:COVID-19_pandemic_data</a></li>
</ul>
</mark>`;

// <li>Nothing new yet</li>

//////////


let group = new THREE.Group();

let groupCasesWP = new THREE.Group();
let groupRecoveriesWP = new THREE.Group();
let groupDeathsWP = new THREE.Group();

let groupCasesJTS = new THREE.Group();
let groupPrevious;

// let today;

//let scene, camera, controls, renderer;

let scaleHeights = 0.0002;


//initMain(); // see html


function requestFile ( url, callback ) { // Or use Three.js util

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = callback;
	xhr.send( null );

}



function resetGroups () {

	THR.scene.remove( group, groupCasesWP, groupRecoveriesWP, groupDeathsWP, groupCasesJTS );


	groupCasesWP = new THREE.Group();
	groupRecoveriesWP = new THREE.Group();
	groupDeathsWP = new THREE.Group();

	groupCasesJTS = new THREE.Group();


	THR.scene.add( group, groupCasesWP, groupRecoveriesWP, groupDeathsWP, groupCasesJTS );

}




////////// Interactive Legend

function toggleBars ( group = groupCases ) {

	//console.log( 'group', group  );

	if ( group === groupPrevious ) {

		groupCasesWP.visible = true;
		groupDeathsWP.visible = true;
		groupRecoveriesWP.visible = true;
		groupCasesJTS.visible = true;

		group = undefined;

	} else {

		groupCasesWP.visible = false;
		groupDeathsWP.visible = false;
		groupRecoveriesWP.visible = false;
		groupCasesJTS.visible = false;

		group.visible = true;

		groupPrevious = group;

	}

}



function toggleNewCases ( group = groupCases ) {

	if ( group === groupPrevious ) {

		groupCasesWP.visible = true;
		groupDeathsWP.visible = true;
		groupRecoveriesWP.visible = true;
		groupCasesJTS.visible = true;

		group = undefined;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;

		groupCasesNewGrounded.visible = group === groupCasesNewGrounded ? true : false;
		groupDeathsNewGrounded.visible = group === groupDeathsNewGrounded ? true : false;


		groupPrevious = group;

	}

}





//////////

function getNotes () {

	divSettings.innerHTML = `
<details id=detSettings >

		<summary> notes & settings </summary>

		<p>
			<button onclick=getNotesContent()>show notes</button>
		</p>

		<p title="View the frames per second and memory used by this page" >
			<a href="javascript:( () => { const script=document.head.appendChild( document.createElement('script') ); script.onload=() => {const stats=new Stats();document.body.appendChild(stats.dom); requestAnimationFrame( function loop(){ stats.update(); requestAnimationFrame(loop) } ); } ; script.src='https://raw.githack.com/mrdoob/stats.js/master/build/stats.min.js'; })()" >load stats.js</a>
		</p>

		<p title="View the number of objects that need rendering and the total number of triangles used to create the objects">
			<button onclick="getRendererInfo()" >getRendererInfo</button>
		</p>

		<div id=divInfo ></div>

		<p>
			<label><input id=SETinpSpyBox type=checkbox onchange=GLO.toggleSkyBox(this.checked)> toggle skybox</label>
		</p>

		<p>
			<button onclick="SCC.init()" >start screen capture</button><br>
			<i>Experimental feature. Work-in-progress. In JavaScript developer console, select a small screen before using.</i>
		</p>

</details>`;

}


function getRendererInfo () {

	const render = THR.renderer.info.render;

	divInfo.innerHTML = `
Renderer<br>
Calls: ${ render.calls }<br>
Triangles: ${ render.triangles.toLocaleString() }<br>
`;

}

function getNotesContent () {


	//if ( detSettings.open === false ) { return }


	DMTdivPopUp.innerHTML = DMT.htmlPopUp;


	DMTdivContent.innerHTML = `
<div id=DMTdivMore></div>
<div id="DMTdivMoreButtons" ></div>
<div id=DMTdivMoreContent  >
</div>
`;


	DMTdivMoreButtons.innerHTML = `
<button onclick=DMTdivMoreContent.innerHTML=notes >notes</button>
<button onclick=DMTimg.src="../../assets/cube-textures/f1.jpg" >button2 </button>
<button onclick=DMTimg.src="../../assets/cube-textures/f2.jpg" >button 3</button>
`;


	notes = `

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

	DMTdivPopUp.hidden = false;

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
