
// https://stackoverflow.com/questions/53127383/how-to-pull-data-from-wikipedia-page


function onLoadDailyReport( xhr ) {

	let response = xhr.target.response;

	response = response.replace( /"Korea, South"/g, "South Korea" );
	//console.log( 'rows', rows );

	rows = response.split( "\n" ).map( line => line.split( "," ) );

	updateBars ( rows )
}


function updateBars ( rows) {

	resetGroups();

	//console.log( 'rows', rows );

	const heightsCases = rows.slice( 1 ).map( line => Number( line[ 7 ] ) );
	//console.log( 'heightsCases', heightsCases );


	const meshesCases = rows.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "red", ( index < 3168 ? 0.1 : 0.4 ), heightsCases[ index ] ) );

	groupCases.add( ...meshesCases );


	const heightsDeaths = rows.slice( 1 ).map( line => Number( line[ 8 ] ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = rows.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "black", ( index < 3168 ? 0.15 : 0.47 ), heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeaths );


	const heightsRecoveries = rows.slice( 1 ).map( line => Number( line[ 9 ] ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = rows.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "green", ( index < 3168 ? 0.15 : 0.45 ), heightsRecoveries[ index ] ) );

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
		`Global totals`,
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