// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */




function initJts() {

	//const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	const dataJhu = "https://raw.githack.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

	requestFile( dataJhu, onLoadCases );


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

	const arrEmpty = Array( lines[ 0 ].length - 4 ).fill( "0" )

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



function updateBars ( length ) {

	//console.log( 'length ', length );

	if ( !linesCases ) { console.log( 'linesCases', linesCases );}

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

	console.log( 'global', globalCasesNew / globalCases);

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

	console.log( 'usa', usaCasesNew / ( usaCases) );

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
		`China`,
		`cases: ${ chinaCases.toLocaleString() }`,
		`cases new: ${ chinaCasesNew.toLocaleString() } (${ ( 100 * chinaCasesNew / chinaCases).toLocaleString() }%)`,
		`deaths: ${ chinaDeaths.toLocaleString() }`,
		`deaths new: ${ chinaDeathsNew.toLocaleString() } (${ ( 100 * chinaDeathsNew / chinaDeaths).toLocaleString() }%)`,
		`recoveries: ${ chinaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ chinaDeathsToCases.toLocaleString() }%`
	];

	const totalsEurope = [
		`Europe`,
		`cases: ${ europeCases.toLocaleString() }`,
		`cases new: ${ europeCasesNew.toLocaleString() } (${ ( 100 * europeCasesNew / europeCases).toLocaleString() }%)`,
		`deaths: ${ europeDeaths.toLocaleString() }`,
		`deaths new: ${ europeDeathsNew.toLocaleString() }(${ ( 100 * europeDeathsNew / europeDeaths).toLocaleString() }%)`,
		`recoveries: ${ europeRecoveries.toLocaleString() }`,
		`deaths/cases: ${ europeDeathsToCases.toLocaleString() }%`
	];
 
	const totalsUsa = [
		`USA`,
		`cases: ${ usaCases.toLocaleString() }`,
		`cases new: ${ usaCasesNew.toLocaleString() } (${ ( 100 * usaCasesNew / usaCases).toLocaleString() }%)`,
		`deaths: ${ usaDeaths.toLocaleString() }`,
		`deaths new: ${ usaDeathsNew.toLocaleString() } (${ ( 100 * usaDeathsNew / usaDeaths).toLocaleString() }%)`,
		`recoveries: ${ usaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ usaDeathsToCases.toLocaleString() }%`
	];

	const totalsRow = [
		`Rest of World`,
		`cases: ${ rowCases.toLocaleString() }`,
		`cases new: ${ rowCasesNew.toLocaleString() } (${ ( 100 * rowCasesNew / rowCases).toLocaleString() }%)`,
		`deaths: ${ rowDeaths.toLocaleString() }`,
		`deaths new: ${ rowDeathsNew.toLocaleString() } (${ ( 100 * rowDeathsNew / rowDeaths).toLocaleString() }%)`,
		`recoveries: ${ rowRecoveries.toLocaleString() }`,
		`deaths/cases: ${ rowDeathsToCases.toLocaleString() }%`
	];

	displayStats( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow );

}



function displayMessage ( index ) {

	//const index = DMT.intersected.userData + 1;

	const line = linesCases[ index ];
	//console.log( 'line', line );

	const lineDeaths = linesDeaths[ index ];

	const lineRecoveries = linesRecoveries[ index ];
	//console.log( 'lineRecoveries', lineRecoveries );

	const casesNew = line.slice( 5 ).map( ( cases, index ) => cases - line[ 5 + index - 1 ] );
	//console.log( 'cb', casesNew );

	const dateIndex = selDate.selectedIndex > - 1 ? 4 + selDate.selectedIndex : line.length - 1;

	let country = line[ 1 ];
	const place = line[ 0 ];

	DMTdivContent.innerHTML = `
		<a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data" target="_blank">JHU data</a> - ${ selDate.value }<br>
		${ ( place ? "place: " + place + "<br>" : "" ) }
		country: ${ country }<br>
		cases: ${ Number( line[ dateIndex ] ).toLocaleString() }<br>
		cases new: <mark>${ ( line[ dateIndex ] - line[ dateIndex - 1 ] ).toLocaleString() }</mark><br>
		deaths: ${ Number( lineDeaths[ dateIndex ] ).toLocaleString() }<br>
		deaths new: ${ ( lineDeaths[ dateIndex ] - lineDeaths[ dateIndex - 1 ] ).toLocaleString() }<br>
		recoveries: ${ Number( lineRecoveries[ dateIndex - 1 ] ).toLocaleString() }<br>
		deaths/cases: ${ ( 100 * ( Number( lineDeaths[ dateIndex ] ) / Number( line[ dateIndex ] ) ) ).toLocaleString() }%<br>
		<hr>

		<b title="Latest day at top" >New cases per day</b><br>
		${ getBars2D( casesNew ) }
		<br>
`;


// <!-- deaths/100K persons: ${ d2Pop }<br>
// cases/(gdp/pop): ${ d2Gdp }<br> -->

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
	console.log( 'place', place );

	camera.position.copy( THR.latLonToXYZ( 70, place[ 2 ], place[ 3 ] ) );

	index = linesCases.indexOf( place );

	displayMessage( index );

}
