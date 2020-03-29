

files = [
	"https://raw.githubusercontent.com/daenuprobst/covid19-cases-switzerland/master/covid_19_cases_switzerland_standard_format.csv",
	"https://raw.githubusercontent.com/daenuprobst/covid19-cases-switzerland/master/covid19_cases_switzerland_openzh.csv",
	"https://github.com/daenuprobst/covid19-cases-switzerland/blob/master/covid19_fatalities_switzerland_openzh.csv",

];

function requestCh () {


	//const dataJhu = "https://cdn.jsdelivr.net/gh/CSSEGISandData/COVID-19@master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	//const dataJhu = "https://raw.githack.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv";
	//const dataJhu = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv";

	const dataChTemplate = "https://raw.githubusercontent.com/daenuprobst/covid19-cases-switzerland/master/template.csv";

	requestFile( files[ 0 ], onLoadChTemplate );

}


function onLoadChTemplate ( xhr ) {
	//console.log( '', xhr.target.response );

	lines = xhr.target.response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'lines', lines );

	updateBars( lines );

}

function updateBars ( index ) {

	resetGroups();

	//console.log( 'lines', lines );

	const heightsCases = lines.slice( 1 ).map( line => Number( line[ 10 ] ) );
	console.log( 'heightsCases', heightsCases );


	const meshesCases = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 4 ], line[ 5 ],
		index, "red", ( index < 3168 ? 0.1 : 0.4 ), heightsCases[ index ] ) );

	groupCases.add( ...meshesCases );


	// const heightsDeaths = lines.slice( 1 ).map( line => Number( line[ 8 ] ) );
	// //console.log( 'heightsDeaths', heightsDeaths );

	// const meshesDeaths = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
	// 	index, "black", ( index < 3168 ? 0.15 : 0.47 ), heightsDeaths[ index ] ) );

	// groupDeaths.add( ...meshesDeaths );


	// const heightsRecoveries = lines.slice( 1 ).map( line => Number( line[ 9 ] ) );
	// //console.log( 'heightsRecoveries', heightsRecoveries );

	// const meshesRecoveries = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
	// 	index, "green", ( index < 3168 ? 0.15 : 0.45 ), heightsRecoveries[ index ] ) );

	// groupRecoveries.add( ...meshesRecoveries );

	//getStats();

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

			const line = lines[ index ];
			console.log( 'line', line );

			divMessage.hidden = false;
			divMessage.style.left = event.clientX + "px";
			divMessage.style.top = event.clientY + "px";
			divMessage.innerHTML = `
<a href="https://github.com/daenuprobst/covid19-cases-switzerland" target="_blank">covid19-cases-switzerland</a> - updates  during the day<br>
canton: ${ line[ 2 ] }<br>
canton: ${ line[ 3 ] }<br>
cases: ${ Number( line[ 14 ] ).toLocaleString() }<br>
`;

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";

	}

}