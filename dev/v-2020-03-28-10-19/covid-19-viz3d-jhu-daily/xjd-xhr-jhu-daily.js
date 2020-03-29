// copyright 2020 Spider contributors. MIT license.
// 2020-03-28
/* globals THREE, renderer, camera, divMessage, intersected, requestFile, resetGroups, addBar, groupCases, groupsCases, groupsRecoveries */
// jshint esversion: 6
// jshint loopfunc: true


let today;
let rows;

// https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports

function initXjd() {


	//const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	//const dataJhu = "https://raw.githack.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv";

	// requestFile( dataJhu, onLoadDailyReport );


	const url = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports";

	requestFile( url, onLoadContents );

}



function onLoadContents ( xhr ) {

	const dataJhu =
"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

	const json = JSON.parse( xhr.target.response );

	const names = json.map( json => json.name );

	today = names[ names.length - 2 ];
	console.log( today );

	requestFile( dataJhu + today, onLoadDailyReport );

}


function onLoadDailyReport( xhr ) {

	let response = xhr.target.response;

	response = response.replace( /"Korea, South"/g, "South Korea" );
	//console.log( 'rows', rows );

	rows = response.split( "\n" ).map( line => line.split( "," ) );

	updateBars( rows );

}



function updateBars ( rows) {

	resetGroups();

	const heightsCases = rows.slice( 1 ).map( line => Number( line[ 7 ] ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = rows.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 5 ], line[ 6 ],
		index, "red", ( index < 3168 ? 0.1 : 0.4 ), heightsCases[ index ], 0, 3, 1, false ) );

	groupCases.add( ...meshesCases );


	const heightsDeaths = rows.slice( 1 ).map( line => Number( line[ 8 ] ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = rows.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "black", ( index < 3168 ? 0.15 : 0.47 ), heightsDeaths[ index ], 0, 3, 1, true ) );

	groupDeaths.add( ...meshesDeaths );


	const heightsRecoveries = rows.slice( 1 ).map( line => Number( line[ 9 ] ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = rows.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "green", ( index < 3168 ? 0.15 : 0.45 ), heightsRecoveries[ index ], 0, 3, 1, true ) );

	groupRecoveries.add( ...meshesRecoveries );

	getStats();

}




function getStats () {

	const europe = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "EstoniaF", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Holy See" ];

	const globalCases = rows.reduce( ( sum, line ) => sum += isNaN( line[ 7 ] ) ? 0 : Number( line[ 7 ] ), 0 );
	const globalDeaths = rows.reduce( ( sum, line ) => sum += isNaN( line[ 7 ] ) ? 0 : Number( line[ 8 ] ), 0 );
	const globalRecoveries = rows.reduce( ( sum, line ) => sum += isNaN( line[ 7 ] ) ? 0 : Number( line[ 9 ] ), 0 );

	const chinaCases = rows.reduce( ( sum, line ) => sum += line[ 3 ] === "China" ? Number( line[ 7 ] ) : 0, 0 );
	const chinaDeaths = rows.reduce( ( sum, line ) => sum += line[ 3 ] === "China" ? Number( line[ 8 ] ) : 0, 0 );
	const chinaRecoveries = rows.reduce( ( sum, line ) => sum += line[ 3 ] === "China" ? Number( line[ 9 ] ) : 0, 0 );

	const europeCases = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 3 ] ) ? Number( line[ 7 ] ) : 0, 0 );
	const europeDeaths = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 3 ] ) ? Number( line[ 8 ] ) : 0, 0 );
	const europeRecoveries = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 3 ] ) ? Number( line[ 9 ] ) : 0, 0 );

	const usaCases = rows.reduce( ( sum, line ) => sum += line[ 3 ] === "US" ? Number( line[ 7 ] ) : 0, 0 );
	const usaDeaths = rows.reduce( ( sum, line ) => sum += line[ 3 ] === "US" ? Number( line[ 8 ] ) : 0, 0 );
	const usaRecoveries = rows.reduce( ( sum, line ) => sum += line[ 3 ] === "US" ? Number( line[ 9 ] ) : 0, 0 );

	const rowCases = globalCases - chinaCases - europeCases - usaCases;
	const rowDeaths = globalDeaths - chinaDeaths - europeDeaths - usaDeaths;
	const rowRecoveries = globalRecoveries - chinaRecoveries - europeRecoveries - usaRecoveries;


	const totalsGlobal = [
		`Global totals ${ today }`,
		`cases: ${ globalCases.toLocaleString() }`,
		`deaths: ${ globalDeaths.toLocaleString() }`,
		`recoveries: ${ globalRecoveries.toLocaleString() }`
	];

	totalsChina = [
		`China`,
		`cases: ${ chinaCases.toLocaleString() }`,
		`deaths: ${ chinaDeaths.toLocaleString() }`,
		`recoveries: ${ chinaRecoveries.toLocaleString() }`,
	];

	const totalsEurope = [
		`Europe`,
		`cases: ${ europeCases.toLocaleString() }`,
		`deaths: ${ europeDeaths.toLocaleString() }`,
		`recoveries: ${ europeRecoveries.toLocaleString() }`,
	];

	const totalsUsa = [
		`USA`,
		`cases: ${ usaCases.toLocaleString() }`,
		`deaths: ${ usaDeaths.toLocaleString() }`,
		`recoveries: ${ usaRecoveries.toLocaleString() }`,
	];

	const totalsRow = [
		`Rest of World`,
		`cases: ${ rowCases.toLocaleString() }`,
		`deaths: ${ rowDeaths.toLocaleString() }`,
		`recoveries: ${ rowRecoveries.toLocaleString() }`,
	];

	displayStats( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow );

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

			const index = intersected.userData + 1;

			const line = rows[ index ];
			console.log( 'line', line );

			divMessage.hidden = false;
			divMessage.style.left = event.clientX + "px";
			divMessage.style.top = event.clientY + "px";
			divMessage.innerHTML = `
<a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory" target="_blank">Wikipedia data</a> - updates ??<br>
county: ${ line[ 1 ] }<br>
state: ${ line[ 2 ] }<br>
state: ${ line[ 3 ] }<br>
cases: ${ Number( line[ 7 ] ).toLocaleString() }<br>
deaths: ${ Number( line[ 8 ] ).toLocaleString() }<br>
recoveries: ${ Number( line[ 9 ] ).toLocaleString() }<br>

`;

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";

	}

}