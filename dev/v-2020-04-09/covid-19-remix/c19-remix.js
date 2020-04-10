// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */


let divGraph;


function initJts() {

	//const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	const dataJhu = "https://raw.githack.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

	//requestFile( dataJhu, onLoadCases );


}



function onLoadCases ( xhr ) {

	resetGroups();

	divDates.innerHTML = `
<details style="margin:0;" ontoggle=selDate.selectedOptions[0].scrollIntoView(false);>
	<summary>timeline
		<span class="couponcode">&#x24d8;<span id=spnTimeline class="coupontooltip">
		Press the colored buttons to see selected items only. Press again to see all.
	</span></span>
	</summary>
	<p>

	Select a date to view
	<select id=selDate onchange=updateBars(this.selectedIndex); size=8 style=width:100%;
		title="Use the cursor keys to go back in time" ></select>
	<p>
	<hr>
</details>
`;
	let response = xhr.target.response;

	response = response.replace( /"Korea, South"/, "South Korea" );
	// 	.replace( /"Gambia, The"/, "The Gambia" )
	// 	.replace( /"Bahamas, The"/, "The Bahamas" );
	// .replace( /"Virgin Islands,/, "Virgin Islands");

	linesCases = response.split( "\n" ).map( line => line.split( "," ) ).slice( 0, -1 );
	//console.log( 'linesCases', linesCases );

	const dateStrings = linesCases[ 0 ].slice( 4 );
	//console.log( 'dates', dates );

	selDate.innerHTML = dateStrings.map( date => `<option>${ date }</option>` ).join("");

	selDate.selectedIndex = dateStrings.length - 1;

	selDate.selectedOptions[ 0 ].scrollIntoView();

	today = dateStrings[ dateStrings.length - 1 ];

	//const dataJhuDeaths = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
	const dataJhuDeaths = "https://raw.githack.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

	requestFile( dataJhuDeaths, onLoadDeaths );

}



function onLoadDeaths ( xhr ) {

	linesDeaths = xhr.target.response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'linesDeaths', linesDeaths );

	//const dataJhuDeaths = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
	const dataJhuRecovered = "https://raw.githack.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";

	requestFile( dataJhuRecovered, onLoadRecovered );

}



function onLoadRecovered ( xhr ) {

	lines = xhr.target.response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'lines', lines );

	const arrEmpty = Array( lines[ 0 ].length - 4 ).fill( "0" );

	linesRecoveries = linesCases.map( ( lineC, index ) => {

		const lineF = lines.find( ( line, index ) => line[ 0 ] === lineC[ 0 ] && line[ 1 ] === lineC[ 1 ] );
	//	console.log( 'lineF', lineF );

		const lineNew = !!lineF ? lineF : lineC.slice( 0, 4 ).concat( arrEmpty );

		if ( lineC[ 1 ] === "US" ) {

			//console.log( '', lineC );
		}

		return lineNew;

	} );
	//console.log( 'linesRecoveries', linesRecoveries );

	updateBars( linesCases[ 1 ].length );

	getCountries();

}



function ccupdateBars ( length ) {

	//console.log( 'length ', length );

	if ( !linesCases ) { console.log( "linesCases", linesCases );}

	resetGroups();

	const heightsCases = linesCases.slice( 1, -1 ).map( line => Number( line[ length - 1 ] ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = linesCases.slice( 1, -1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "red", 0.4, heightsCases[ index ], 0, 12, 1, false ) );

	groupCases.add( ...meshesCases );


	const heightsCasesNew = linesCases.slice( 1, -1 ).map( line => line[ length - 1 ] - line[ length - 2 ] );
	//console.log( 'heightsCasesNew ', heightsCasesNew );

	const offsetsCasesNew = heightsCases.map( ( height, index ) => scaleHeights * ( height - heightsCasesNew[ index ] ) );

	const meshesCasesNew = linesCases.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "cyan", 0.45, heightsCasesNew[ index ], 0.001 + offsetsCasesNew[ index ], 12, 1, false ) );

	groupCasesNew.add( ...meshesCasesNew );


	const heightsDeaths = linesDeaths.slice( 1 ).map( line => Number( line[ length - 1 ] ) );
	//console.log( 'heightsDeaths', linesDeaths.slice( 1 )[ 225 ], heightsDeaths[ 225 ] );

	const meshesDeath = linesDeaths.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeath );


	const heightsDeathsNew = linesDeaths.slice( 1 ).map( line => line[ length - 1 ] - line[ length - 2 ] );

	const offsetsDeathsNew = heightsDeaths.map( ( height, index ) => scaleHeights * ( height - heightsDeathsNew[ index ] ) );

	const meshesDeathsNew = linesDeaths.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "gray", 0.6, heightsDeathsNew[ index ], offsetsDeathsNew[ index ] ) );

	groupDeathsNew.add( ...meshesDeathsNew );


	const heightsRecoveries = linesRecoveries.slice( 1 ).map( ( line, index ) => Number( line[ length - 1] ) + heightsDeaths[ index ] );

	//console.log( 'heightsRec', linesRecoveries.slice( 1 )[ 225 ],
	//	linesRecoveries.slice( 1 )[ 225 ][ 68 ], heightsDeaths[ 69 ] );

	const meshesRecoveries = linesRecoveries.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveries.add( ...meshesRecoveries );

	getStats();

}



function getStats () {

	const europe = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "EstoniaF", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Holy See" ];

	const index = 4 + selDate.selectedIndex;

	const globalCases = linesCases.slice( 1 ).reduce( ( sum, line ) => sum + ( Number( line[ index ] ) || 0 ), 0 );
	const globalCasesNew = linesCases.slice( 1 ).reduce( ( sum, line ) => sum + ( line[ index ] - line[ index - 1 ] || 0 ), 0 );
	const globalDeaths = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum + ( Number( line[ index ] ) || 0 ), 0 );
	const globalDeathsNew = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum + ( line[ index ] - line[ index - 1 ] || 0 ), 0 );
	const globalRecoveries = linesRecoveries.slice( 1 ).reduce( ( sum, line ) => sum + ( Number( line[ index - 1 ] ) || 0 ), 0 );
	const globalDeathsToCases = 100 * ( globalDeaths / globalCases );

	const chinaCases = linesCases.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ index ] ) : 0, 0 );
	const chinaCasesNew = linesCases.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const chinaDeaths = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ index ] ) : 0, 0 );
	const chinaDeathsNew = linesDeaths.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const chinaRecoveries = linesRecoveries.slice( 1 ).reduce( ( sum, line ) => sum += line[ 1 ] === "China" ? Number( line[ index - 1 ] ) : 0, 0 );
	const chinaDeathsToCases = 100 * chinaDeaths / chinaCases;

	const europeCases = linesCases.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? Number( line[ index ] ) : 0, 0 );
	const europeCasesNew = linesCases.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const europeDeaths = linesDeaths.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? Number( line[ index ] ) : 0, 0 );
	const europeDeathsNew = linesDeaths.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? ( line[ index ] - line[ index - 1 ] ) : 0, 0 );
	const europeRecoveries = linesRecoveries.reduce( ( sum, line ) => sum += europe.includes( line[ 1 ] ) ? Number( line[ index - 1 ] ) : 0, 0 );
	const europeDeathsToCases = 100 * europeDeaths / europeCases;

	const usaCases = linesCases.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ index ] ) : 0, 0 );
	const usaCasesNew = linesCases.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? line[ index ] - line[ index - 1 ] : 0, 0 );
	const usaDeaths = linesDeaths.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ index ] ) : 0, 0 );
	const usaDeathsNew = linesDeaths.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? ( line[ index ] - line[ index - 1 ] ) : 0, 0 );
	const usaRecoveries = linesRecoveries.reduce( ( sum, line ) => sum += line[ 1 ] === "US" ? Number( line[ index - 1 ] ) : 0, 0 );
	const usaDeathsToCases = 100 * ( usaDeaths / usaCases );

	const rowCases = globalCases - chinaCases - europeCases - usaCases;
	const rowCasesNew = globalCasesNew - chinaCasesNew - europeCasesNew - usaCasesNew;
	const rowDeaths = globalDeaths - chinaDeaths - europeDeaths - usaDeaths;
	const rowDeathsNew = globalDeathsNew - chinaDeathsNew - europeDeathsNew - usaDeathsNew;
	const rowRecoveries = globalRecoveries - chinaRecoveries - europeRecoveries - usaRecoveries;
	const rowDeathsToCases = 100 * ( rowDeaths / rowCases );


	const totalsGlobal = [
		`Global totals ${ selDate.value }`,
		`cases: ${ globalCases.toLocaleString() }`,
		`cases new: ${ globalCasesNew.toLocaleString() } (${ ( 100 * globalCasesNew / globalCases).toLocaleString() }%)`,
		`deaths: ${ globalDeaths.toLocaleString() }`,
		`deaths new: ${ globalDeathsNew.toLocaleString() } (${ ( 100 * globalDeathsNew / globalDeaths).toLocaleString() }%)`,
		`recoveries: ${ globalRecoveries.toLocaleString() }`,
		`deaths/cases: ${ globalDeathsToCases.toLocaleString() }%`
	];

	totalsChina = [
		"China",
		`cases: ${ chinaCases.toLocaleString() }`,
		`cases new: ${ chinaCasesNew.toLocaleString() } (${ ( 100 * chinaCasesNew / chinaCases).toLocaleString() }%)`,
		`deaths: ${ chinaDeaths.toLocaleString() }`,
		`deaths new: ${ chinaDeathsNew.toLocaleString() } (${ ( 100 * chinaDeathsNew / chinaDeaths).toLocaleString() }%)`,
		`recoveries: ${ chinaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ chinaDeathsToCases.toLocaleString() }%`
	];

	const totalsEurope = [
		"Europe",
		`cases: ${ europeCases.toLocaleString() }`,
		`cases new: ${ europeCasesNew.toLocaleString() } (${ ( 100 * europeCasesNew / europeCases).toLocaleString() }%)`,
		`deaths: ${ europeDeaths.toLocaleString() }`,
		`deaths new: ${ europeDeathsNew.toLocaleString() }(${ ( 100 * europeDeathsNew / europeDeaths).toLocaleString() }%)`,
		`recoveries: ${ europeRecoveries.toLocaleString() }`,
		`deaths/cases: ${ europeDeathsToCases.toLocaleString() }%`
	];

	const totalsUsa = [
		"USA",
		`cases: ${ usaCases.toLocaleString() }`,
		`cases new: ${ usaCasesNew.toLocaleString() } (${ ( 100 * usaCasesNew / usaCases).toLocaleString() }%)`,
		`deaths: ${ usaDeaths.toLocaleString() }`,
		`deaths new: ${ usaDeathsNew.toLocaleString() } (${ ( 100 * usaDeathsNew / usaDeaths).toLocaleString() }%)`,
		`recoveries: ${ usaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ usaDeathsToCases.toLocaleString() }%`
	];

	const totalsRow = [
		"Rest of World",
		`cases: ${ rowCases.toLocaleString() }`,
		`cases new: ${ rowCasesNew.toLocaleString() } (${ ( 100 * rowCasesNew / rowCases).toLocaleString() }%)`,
		`deaths: ${ rowDeaths.toLocaleString() }`,
		`deaths new: ${ rowDeathsNew.toLocaleString() } (${ ( 100 * rowDeathsNew / rowDeaths).toLocaleString() }%)`,
		`recoveries: ${ rowRecoveries.toLocaleString() }`,
		`deaths/cases: ${ rowDeathsToCases.toLocaleString() }%`
	];

	displayStats( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow );

}



function displayMessage ( items, index ) {

	//const index = DMT.intersected.userData;

	const line = items[ index ];
	//console.log( "line", line );

	const lineDeaths = line.deaths;

	//const lineRecoveries = line.recoveries;
	//console.log( 'lineRecoveries', lineRecoveries );

	//const casesNew = line.slice( 5 ).map( ( cases, index ) => cases - line[ 5 + index - 1 ] );
	//console.log( 'cb', casesNew );

	//const dateIndex = selDate.selectedIndex > - 1 ? 4 + selDate.selectedIndex : line.length - 1;

	// let country = line[ 1 ];
	// const place = line[ 0 ];


	DMTdivParent.style.width = "50ch";
	DMTdivContent.innerHTML = `
	<div id=WPdivNumbers></div>
	<div id=WPdivGraph></div>
	`;
	divGraph = WPdivGraph;

	place = line.region ? line.region : line.country;

	placeWP = place
		.replace( /United/g, "the_United" )
		.replace( / /g, "_" )
		.replace( /New_York/, "New_York_(state)" )
		.replace( /Georgia/, "Georgia_(U.S._state)" );

		WPdivNumbers.innerHTML = `
<a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory" target="_blank">Global pandemic Wikipedia data</a><br>
country: ${ line.country }<br>
place: ${ line.region }<br>
cases: ${ Number( line.cases).toLocaleString() }<br>
deaths: ${ Number( line.deaths ).toLocaleString() }<br>
recoveries: ${ Number( line.recoveries ).toLocaleString() }<br>
wikipedia pandemic page for:
<p>
	<a href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${ placeWP }" target="_blank">${ place }</a>
</p>
`;

showLocation( placeWP, 0 );

}



function showLocation ( place, table ) {

	//console.log( "place", place );

	if ( place  === "" ) {

		alert( "data coming soon" );

	} else {

		const url = "2020_coronavirus_pandemic_in_" + placeWP;

		fetchUrlWikipediaApiPlace( url, table );

	}

}



function fetchUrlWikipediaApiPlace ( url, tab = 0, rowStart = 0, column = 0 ) {

	tab = !tab ? 0 : tab;

	const api = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=parse&format=json&page=";

	//console.log( 'api', tab,  api + url );
	//console.log( 'tab', tab );

	fetch( api + url )
		.then( function ( response ) {
			return response.json();
		} )
		.then( function ( response ) {

			let html_code = response[ "parse" ][ "text" ][ "*" ];

			html_code = html_code
				.replace( /\<img (.*?)>/gi, "" )
				.replace( /\<a href(.*?)>/gi, "" );

			const parser = new DOMParser();
			const html = parser.parseFromString( html_code, "text/html" );
			//console.log( "html", html );

			const tables = html.querySelectorAll( ".wikitable,.barbox" );

			const ttab = tables[ tab ];

			if ( !ttab ) {
				divGraph.innerHTML = "There seem to be no charts or tables we can access here.\n\nTry another place";
				return;
			}

			const s = new XMLSerializer();
			const str = s.serializeToString( ttab).replace( /\[(.*?)\]/g, "" );

			if ( divGraph ) { divGraph.innerHTML = str; }

		} );

}

//////////

function getCountries () {

	let countries = linesCases.map( line => line[ 1 ] );

	countries = [ ...new Set( countries ) ];
	//console.log( 'countries', countries );

	const options = countries.map( country => `<option>${ country }</option>` );

	divCountries.innerHTML = `
<details>
	<summary>gazetteer
		<span class="couponcode">&#x24d8;<span id=GZTspn class="coupontooltip">
			Select a country from the list below and view its statistics on the globe.
			Use your computer cursor keys to scroll through the list and view results rapidly.
		</span></span>
	</summary>
	<p>
		Select a country
		<select id=selCountries onchange=getProvince(this.value) style=width:100%; size=8 >${ options }</select>
	</p>
	<div id=divProvinces > </div>
	<hr>
`;

}



function getProvince ( country ) {

	THR.controls.autoRotate = false;

	DMTdivParent.hidden = false;
	//divMessage.innerHTML = "";

	let provinces = linesCases.filter( line => line[ 1 ] === country );
	//console.log( 'provinces', provinces );


	if ( provinces[ 0 ][ 0 ] === "" ) {

		camera.position.copy( THR.latLonToXYZ( 70, provinces[ 0 ][ 2 ], provinces[ 0 ][ 3 ] ) );

		divProvinces.innerHTML = "";

		index = linesCases.indexOf( provinces[ 0 ] );

		displayMessage( index );


	} else {

		const options = provinces.map( province => `<option>${ province[ 0 ] || province[ 1 ] }</option>` );

		divProvinces.innerHTML = `<p><select id=selProvinces onchange=getPlace(this.value) >${ options }</select></p>`;

	}
}



function getPlace ( province ) {

	const place = linesCases.find( line => line[ 0 ] === province );
	console.log( "place", place );

	camera.position.copy( THR.latLonToXYZ( 70, place[ 2 ], place[ 3 ] ) );

	index = linesCases.indexOf( place );

	displayMessage( index );

}
