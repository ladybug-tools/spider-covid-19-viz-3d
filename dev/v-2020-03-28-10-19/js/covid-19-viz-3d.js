

function initViz3d() {


	//const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	const dataJhu = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

	requestFile( dataJhu, onLoadCases );

}



function onLoadCases ( xhr ) {

	resetGroups();

	divDates.innerHTML = `<select id=selDate onchange=updateBars(this.selectedIndex); size=3 style=width:100%;
		title="Use the cursor keys to go back in time" ></select>`;

	let response = xhr.target.response;

	response = response.replace( /"Korea, South"/, "South Korea" );
	// 	.replace( /"Gambia, The"/, "The Gambia" )
	// 	.replace( /"Bahamas, The"/, "The Bahamas" );
	// .replace( /"Virgin Islands,/, "Virgin Islands");

	linesCases = response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'lines', lines );

	const dates = linesCases[ 0 ].slice( 4 );

	selDate.innerHTML = dates.map( date => `<option>${ date }</option>` );

	selDate.selectedIndex = dates.length - 1;

	//const dataJhuDeaths = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
	const dataJhuDeaths = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

	requestFile( dataJhuDeaths, onLoadDeaths );

}



function onLoadDeaths ( xhr ) {

	linesDeaths = xhr.target.response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'linesDeaths', linesDeaths );



	//const dataJhuDeaths = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
	const dataJhuRecovered = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";

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

	getStats();

	getCountries();

}

function updateBars ( length ) {

	//console.log( 'length ', length );
	if ( !linesCases ) { console.log( 'linesCases', linesCases );}

	resetGroups();

	const heightsCases = linesCases.slice( 1, -1 ).map( line => Number( line[ length - 1 ] ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = linesCases.slice( 1, -1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "red", 0.4, heightsCases[ index ] ) );

	groupCases.add( ...meshesCases );


	const heightsCasesNew = linesCases.slice( 1, -1 ).map( line => Math.sqrt( line[ length - 1 ] - line[ length - 2 ] ) );
	//console.log( 'heightsCasesNew ', heightsCasesNew );

	const offsetsCasesNew = heightsCases.map( ( height, index ) => 0.2 * Math.sqrt( height ) - 0.2 * Math.sqrt( heightsCasesNew[ index ] ) );

	const meshesCasesNew = linesCases.slice( 1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "cyan", 0.6, heightsCasesNew[ index ], offsetsCasesNew[ index ] ) );

	groupCasesNew.add( ...meshesCasesNew );




	const heightsDeaths = linesDeaths.slice( 1 ).map( line => Number( line[ length - 1 ] ) );
	//console.log( 'heightsDeaths', linesDeaths.slice( 1 )[ 225 ], heightsDeaths[ 225 ] );

	const meshesDeath = linesDeaths.slice( 1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeath );


	const heightsDeathsNew = linesDeaths.slice( 1 ).map( line => line[ length - 1 ] - line[ length - 2 ] );

	const offsetsDeathsNew = heightsDeaths.map( ( height, index ) => 0.2 * Math.sqrt( height ) - 0.2 * Math.sqrt( heightsDeathsNew[ index ] ) );

	const meshesDeathsNew = linesDeaths.slice( 1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "gray", 0.6, heightsDeathsNew[ index ], offsetsDeathsNew[ index ] ) );

	groupDeathsNew.add( ...meshesDeathsNew );


	const heightsRecoveries = linesRecoveries.slice( 1 ).map( ( line, index ) => Number( line[ length - 1] ) + heightsDeaths[ index ] );

	//console.log( 'heightsRec', linesRecoveries.slice( 1 )[ 225 ],
	//	linesRecoveries.slice( 1 )[ 225 ][ 68 ], heightsDeaths[ 69 ] );

	const meshesRecoveries = linesRecoveries.slice( 1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveries.add( ...meshesRecoveries );

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
		`Global totals`,
		`cases: ${ globalCases.toLocaleString() }`,
		`cases new: ${ globalCasesNew.toLocaleString() }`,
		`deaths: ${ globalDeaths.toLocaleString() }`,
		`deaths new: ${ globalDeathsNew.toLocaleString() }`,
		`recoveries: ${ globalRecoveries.toLocaleString() }`,
		`deaths/cases: ${ globalDeathsToCases.toLocaleString() }%`
	];

	totalsChina = [
		`China`,
		`cases: ${ chinaCases.toLocaleString() }`,
		`cases today: ${ chinaCasesNew.toLocaleString() }`,
		`deaths: ${ chinaDeaths.toLocaleString() }`,
		`deaths new: ${ chinaDeathsNew.toLocaleString() }`,
		`recoveries: ${ chinaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ chinaDeathsToCases.toLocaleString() }%`
	];

	const totalsEurope = [
		`Europe`,
		`cases: ${ europeCases.toLocaleString() }`,
		`cases today: ${ europeCasesNew.toLocaleString() }`,
		`deaths: ${ europeDeaths.toLocaleString() }`,
		`deaths new: ${ europeDeathsNew.toLocaleString() }`,
		`recoveries: ${ europeRecoveries.toLocaleString() }`,
		`deaths/cases: ${ europeDeathsToCases.toLocaleString() }%`
	];

	const totalsUsa = [
		`USA`,
		`cases: ${ usaCases.toLocaleString() }`,
		`cases today: ${ usaCasesNew.toLocaleString() }`,
		`deaths: ${ usaDeaths.toLocaleString() }`,
		`deaths new: ${ usaDeathsNew.toLocaleString() }`,
		`recoveries: ${ usaRecoveries.toLocaleString() }`,
		`deaths/cases: ${ usaDeathsToCases.toLocaleString() }%`
	];

	const totalsRow = [
		`Rest of World`,
		`cases: ${ rowCases.toLocaleString() }`,
		`cases today: ${ rowCasesNew.toLocaleString() }`,
		`deaths: ${ rowDeaths.toLocaleString() }`,
		`deaths new: ${ rowDeathsNew.toLocaleString() }`,
		`recoveries: ${ rowRecoveries.toLocaleString() }`,
		`deaths/cases: ${ rowDeathsToCases.toLocaleString() }%`
	];

	displayStats( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow );

}