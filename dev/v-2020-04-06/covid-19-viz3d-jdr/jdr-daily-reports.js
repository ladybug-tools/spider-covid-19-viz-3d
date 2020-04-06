// copyright 2020 Spider contributors. MIT license.
// 2020-03-28
/* global THREE, renderer, camera, divMessage, intersected, requestFile, resetGroups, addBar, groupCases, groupsCases, groupsRecoveries */


let rows;

// https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports

function initJdr() {

	const url = "https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports";

	requestFile( url, onLoadContents );

}



function onLoadContents( xhr ) {

	const dataJhu =
"https://raw.githack.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

	const json = JSON.parse( xhr.target.response );

	const names = json.map( json => json.name );

	today = names[ names.length - 3 ];
	//console.log( today );

	requestFile( dataJhu + today, onLoadDailyReport );

}


function onLoadDailyReport( xhr ) {

	let response = xhr.target.response;

	response = response.replace( /"Korea, South"/g, "South Korea" );
	//console.log( 'rows', rows );

	rows = response.split( "\n" ).map( row => row.split( "," ) ).slice( 0, -1 );

	updateBars( rows );

}



function updateBars( rows ) {

	resetGroups();

	const heightsCases = rows.slice( 1 ).map( row => Number( row[ 7 ] ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = rows.slice( 1 ).map( ( row, index ) =>
		addBar( row[ 5 ], row[ 6 ], index, "red", ( row[ 0 ] === "" ? 0.5 : 0.2 ), heightsCases[ index ], 0, 3, 1, false ) );

	groupCases.add( ...meshesCases );

	const heightsRecoveries = rows.slice( 1 ).map( row => Number( row[ 9 ] ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = rows.slice( 1 ).map( ( row, index ) =>
		addBar( row[ 5 ], row[ 6 ],
		index, "green", ( row[ 0 ] === "" ? 0.55 : 0.25 ), heightsRecoveries[ index ], 0, 3, 1, true ) );

	groupRecoveries.add( ...meshesRecoveries );
	const heightsDeaths = rows.slice( 1 ).map( row => Number( row[ 8 ] ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = rows.slice( 1 ).map( ( row, index ) =>
		addBar( row[ 5 ], row[ 6 ],
		index, "black", ( row[ 0 ] === "" ? 0.6 : 0.3 ), heightsDeaths[ index ], 0, 3, 1, true ) );

	groupDeaths.add( ...meshesDeaths );

	getStats();

	getCountries();

}




function getStats () {

	const europe = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "EstoniaF", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Holy See" ];

	const globalCases = rows.reduce( ( sum, row ) => sum += isNaN( row[ 7 ] ) ? 0 : Number( row[ 7 ] ), 0 );
	const globalDeaths = rows.reduce( ( sum, row ) => sum += isNaN( row[ 7 ] ) ? 0 : Number( row[ 8 ] ), 0 );
	const globalRecoveries = rows.reduce( ( sum, row ) => sum += isNaN( row[ 7 ] ) ? 0 : Number( row[ 9 ] ), 0 );

	const chinaCases = rows.reduce( ( sum, row ) => sum += row[ 3 ] === "China" ? Number( row[ 7 ] ) : 0, 0 );
	const chinaDeaths = rows.reduce( ( sum, row ) => sum += row[ 3 ] === "China" ? Number( row[ 8 ] ) : 0, 0 );
	const chinaRecoveries = rows.reduce( ( sum, row ) => sum += row[ 3 ] === "China" ? Number( row[ 9 ] ) : 0, 0 );

	const europeCases = rows.reduce( ( sum, row ) => sum += europe.includes( row[ 3 ] ) ? Number( row[ 7 ] ) : 0, 0 );
	const europeDeaths = rows.reduce( ( sum, row ) => sum += europe.includes( row[ 3 ] ) ? Number( row[ 8 ] ) : 0, 0 );
	const europeRecoveries = rows.reduce( ( sum, row ) => sum += europe.includes( row[ 3 ] ) ? Number( row[ 9 ] ) : 0, 0 );

	const usaCases = rows.reduce( ( sum, row ) => sum += row[ 3 ] === "US" ? Number( row[ 7 ] ) : 0, 0 );
	const usaDeaths = rows.reduce( ( sum, row ) => sum += row[ 3 ] === "US" ? Number( row[ 8 ] ) : 0, 0 );
	const usaRecoveries = rows.reduce( ( sum, row ) => sum += row[ 3 ] === "US" ? Number( row[ 9 ] ) : 0, 0 );

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

	detStats.open = window.innerWidth > 640;

}



function displayMessage ( index ) {

	//const index = DMT.intersected.userData + 1;

	const row = rows[ index ];
	//console.log( 'row', row );

	DMTdivContent.innerHTML = `
<a href="https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/03-31-2020.csv" target="_blank">JHU data</a> - updates daily<br>
county: ${ row[ 1 ] }<br>
state: ${ row[ 2 ] }<br>
state: ${ row[ 3 ] }<br>
cases: ${ Number( row[ 7 ] ).toLocaleString() }<br>
deaths: ${ Number( row[ 8 ] ).toLocaleString() }<br>
recoveries: ${ Number( row[ 9 ] ).toLocaleString() }<br>
`;

}



function getCountries () {

	let countries = rows.map( row => row[ 3 ].trim() );

	countries = [ ...new Set( countries ) ].sort();

	//console.log( 'countries', countries );

	const options = countries.map( country => `<option>${ country }</option>` );

	divCountries.innerHTML = `
<details>
	<summary>
		gazetteer
		<span class="couponcode">&#x24d8;<span id=GZTspn class="coupontooltip">
		Select a country from the list below and view its statistics on the globe.
		Use your computer cursor keys to scroll through the list and view results rapidly.
		</span></span>
	</summary>
	<p><select id=selCountries onchange=getCountry(this.value) style=width:100%; >${ options }</select>
	<p>USA States
	<div id=divStates > </div>
	<div id=divCounties > </div>
	<hr>
</details>
`;
	//selCountries.selectedIndex = 171;

	getState( "US" );

}


function getCountry ( country ) {

	row = rows.find( row => row[ 3 ].includes( country ) );
	//console.log( 'row', row, Number( row[ 5 ] ), Number( row[ 6 ] ) );

	camera.position.copy( THR.latLonToXYZ( 70, Number( row[ 5 ] ), Number( row[ 6 ] ) ) );

	index = rows.indexOf( row );

	DMTdivParent.hidden = false;

	displayMessage( index );

}



function getState ( country ) {

	//THR.controls.autoRotate = false;

	let usa = rows.filter( row => row[ 3 ] === "US" );
	//console.log( 'statesAA', usa );

	const statesAll = usa.map( row => row[ 2 ] )

	const states = [...new Set(statesAll )].sort();
	//console.log( 'states', states );

	const options = states.map( state => `<option>${ state }</option>` );

	divStates.innerHTML = `<select id=selState onchange=getCounties(this.value) >${ options }</select>`;

}



function getCounties ( state ) {

	const counties = rows.filter( row => row[ 2 ] === state );
	//console.log( 'counties', counties );

	const options = counties.map( county => `<option>${ county[ 1 ] }</option>` );

	divCounties.innerHTML = `<p><select id=selCounty onchange=getCounty(); >${ options }</select></p>`;

}


function getCounty () {

	const county = rows.find( row => row[ 2 ] === selState.value && row[ 1 ] === selCounty.value );
	//console.log( 'row', county );

	camera.position.copy( THR.latLonToXYZ( 70, county[ 5 ], county[ 6 ] ) );

	index = rows.indexOf( county );

	DMTdivParent.hidden = false;

	displayMessage( index );


}