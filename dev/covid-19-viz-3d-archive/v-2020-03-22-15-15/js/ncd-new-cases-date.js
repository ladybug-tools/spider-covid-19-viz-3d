// copyright 2020 Spider contributors. MIT license.
// 2020-03-20
/* globals NCDdivNewCasesDate, selCountry, divStats, divChartMmg */
// jshint esversion: 6
// jshint loopfunc: true


const NCD = {};



NCD.init = function () {

	const urlCORS = 'https://cors-anywhere.herokuapp.com/';
	const url = `https://covid-api.mmediagroup.fr/v1/history?status=Confirmed`;

	NCD.requestFile( urlCORS + url, NCD.onLoadMMG );

	// NCDdivNewCasesDate.innerHTML = `
	// <details id=detNCD hidden>
	// <summary><b>New cases by date</b> Most recent at top</summary>
	// <div id=NCDdivStats ></div>

	// <div id=NCDdivChartMmg style="border: 0px red solid; height: 30ch; overflow: auto; resize: both;" ></div>

	// <div><small>
	// 	Data credit: <a href="https://mmediagroup.fr" target="_blank">https://mmediagroup.fr</a>
	// </small></div>
	// </details>
	// `;

	// detNCD.open = window.innerWidth > 640;

};



NCD.requestFile = function ( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onerror = ( xhr ) => console.log( 'error:', xhr );
	//xhr.onprogress = ( xhr ) => NCDdivChartMmg.innerHTML = 'bytes loaded:' + xhr.loaded;
	xhr.onload = callback;
	xhr.send( null );

};



NCD.onLoadMMG = function ( xhr ) {

	NCD.json = JSON.parse( xhr.target.response );
	//console.log( "json", NCD.json );

	NCD.getCountries();

	//NCD.getDates();

};



NCD.getCountries = function () {

	const countries = Object.entries( NCD.json );
	//console.log( 'entries', entries );

	const places = [];

	countries.forEach( country => {

		const locations = Object.entries( country[ 1 ] );

		if ( locations.length === 1 ) {

			places.push( country[ 0 ] );

		} else {

			//const arr = locations.slice( 1 ).map( arr => arr[ 0 ] );
			places.push( country[ 0 ] );
		}

	} );

	places.sort();

};



NCD.getDates = function ( country = "France" ) {

	const countryData = NCD.json[ country ];
	//console.log( 'countryData', countryData );

	if ( !countryData ) { return "no case data"; }

	if ( Array.isArray( countryData.All ) === false ) {

		NCD.dates = countryData.All.dates;
		//console.log( 'dates', dates );

		const cases = Object.entries( NCD.dates ).map( item => item[ 1 ] );
		//console.log( 'cases', cases );

		let casesNew = cases.slice( 0, -1 );

		casesNew = casesNew.map( ( item, index ) => Math.abs( item - cases[ index + 1 ] ) );
		//console.log( 'casesNew', casesNew );

		NCD.drawChart( casesNew );

	}

	// population: ${ stats.population.toLocaleString() }

	const stats = countryData.All;

	const totals = `${ country } totals:
	confirmed: ${ stats.confirmed.toLocaleString() }
	recovered: ${ stats.recovered.toLocaleString() }
	deaths: ${ stats.deaths.toLocaleString() }
	`;

	return totals;

};



NCD.drawChart = function ( arr ) {

	const max = Math.max( ...arr );
	//console.log( 'max', max );

	const scale = 200 / max;

	const dateStrings = Object.keys( NCD.dates );

	const bars = arr.map( ( item, index ) =>

		`<div style="background-color: cyan; color: black; margin-top:1px; height:0.5ch; width:${ scale * item }px;"
		title="date: ${ dateStrings[ index ] } cases:${ item.toLocaleString() }">&nbsp;</div>` ).join( "" );

	//NCDdivChartMmg.innerHTML = bars;

	NCD.bars = `<div style=background-color:#ddd >${ bars }</div>`;

};



NCD.init();