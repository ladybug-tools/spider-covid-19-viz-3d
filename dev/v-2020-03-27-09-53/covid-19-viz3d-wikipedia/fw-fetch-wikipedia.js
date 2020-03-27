
// https://stackoverflow.com/questions/53127383/how-to-pull-data-from-wikipedia-page


function fetchUrlWikipediaApi ( url ) {

	fetch( url )
		.then( function ( response ) {
			return response.json();
		} )
		.then( function ( response ) {

			const html_code = response[ "parse" ][ "text" ][ "*" ];
			const parser = new DOMParser();
			const html = parser.parseFromString( html_code, "text/html" );
			const tables = html.querySelectorAll( ".wikitable" );

			//console.log(tables[ 0 ]);

			const trs = tables[ 0 ].querySelectorAll( "tr" );

			console.log( 'trs', trs );

			rows = Array.from( trs ).slice( 1, - 3 ).map( tr => tr.innerText.trim()
				.replace( /\[(.*?)\]/g, "" )
				.replace( /,/g, "" )
				.split( "\n\n" )
				//.slice( 0, - 1 )
			)
				.sort();

			//console.log( 'rows', rows );

			//divContent.innerHTML = vals.join( "<br>" );

			updateBars( rows );

		} );

}


function updateBars ( rows ) {

	resetGroups();

	//console.log( 'rows', rows );

	lines = rows.map( row => {

		country = countries.find( country => country[ 1 ] === row[ 0 ] )

		if ( !country ) { console.log( 'row lost', row );}

		return country ? country.concat( row ) : row

	})

	//console.log( 'lines', lines );

	const heightsCases = lines.slice( 1 ).map( line => Number( line[ 5 ] ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "red", 0.4, heightsCases[ index ] ) );

	groupCases.add( ...meshesCases );


	const heightsDeaths = lines.slice( 1 ).map( line => Number( line[ 6 ] ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeaths );


	const heightsRecoveries = lines.slice( 1 ).map( line => Number( line[ 7 ] ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 2 ], line[ 3 ], index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveries.add( ...meshesRecoveries );

	getStats();

}





function getStats () {

	const europe = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "EstoniaF", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Holy See" ];

	//const index = 4 + selDate.selectedIndex;
	rows.forEach( ( line ) => line[ 1 ] = isNaN( Number( line[ 1 ] ) ) ? 0 : line[ 1 ] );
	rows.forEach( ( line ) => line[ 2 ] = isNaN( Number( line[ 2 ] ) ) ? 0 : line[ 2 ] );
	rows.forEach( ( line ) => line[ 3 ] = isNaN( Number( line[ 3 ] ) ) ? 0 : line[ 3 ] );

	const globalCases = Number( rows[ 0 ][ 1 ] );
	const globalDeaths = Number( rows[ 0 ][ 2 ] );
	const globalRecoveries = Number( rows[ 0 ][ 3 ] );


	const chinaCases = Number( rows[ 34 ][ 1 ] );
	const chinaDeaths =  Number( rows[ 34 ][ 2 ] );
	const chinaRecoveries =  Number( rows[ 34 ][ 3 ] );

	const europeCases = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 0 ] ) ? Number( line[ 1 ] ) : 0, 0 );
	const europeDeaths = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 0 ] ) ? Number( line[ 2 ] ) : 0, 0 );
	const europeRecoveries = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 0 ] ) ?
		Number( line[ 3 ] ) : 0, 0 );

	const usaCases = rows.reduce( ( sum, line ) => sum += line[ 0 ] === "United States" ? Number( line[ 1 ] ) : 0, 0 );
	const usaDeaths = rows.reduce( ( sum, line ) => sum += line[ 0 ] === "United States" ? Number( line[ 2 ] ) : 0, 0 );
	const usaRecoveries = rows.reduce( ( sum, line ) => sum += line[ 0 ] === "United States" ? Number( line[ 3 ] ) : 0, 0 );

	const rowCases = globalCases - europeCases - usaCases;
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

	// [text], scale, color, x, y, z )
	// groupPlacards.add( THR.drawPlacard( "Null Island", "0.01", 1, 80, 0, 0 ) );

	vGlo = THR.latLonToXYZ( 75, 65, - 20 );
	groupPlacards.add( THR.drawPlacard( totalsGlobal, "0.02", 200, vGlo.x, vGlo.y, vGlo.z ) );

	vChi = THR.latLonToXYZ( 85, 50, 110 );
	groupPlacards.add( THR.drawPlacard( totalsChina, "0.02", 1, vChi.x, vChi.y, vChi.z ) );

	const vEur = THR.latLonToXYZ( 80, 60, 20 );
	groupPlacards.add( THR.drawPlacard( totalsEurope, "0.02", 120, vEur.x, vEur.y, vEur.z ) );

	const vUsa = THR.latLonToXYZ( 80, 40, - 120 );
	groupPlacards.add( THR.drawPlacard( totalsUsa, "0.02", 60, vUsa.x, vUsa.y, vUsa.z ) );

	const vRow = THR.latLonToXYZ( 90, 30, 180 );
	groupPlacards.add( THR.drawPlacard( totalsRow, "0.02", 180, vRow.x, vRow.y, vRow.z ) );


	divStats.innerHTML = `
<details id=detStats open>

	<summary><b>global data </b></summary>

	<p>
		${ totalsGlobal.join( "<br>" ).replace( /Global totals/, "<b>Global totals</b>" ) }
	</p>

	<p>
		${ totalsChina.join( "<br>" ).replace( /China/, "<b>China</b>" ) }
	</p>

	<p>
		${ totalsEurope.join( "<br>" ).replace( /Europe/, "<b>Europe</b>" ) }
	</p>

	<p>
		${ totalsUsa.join( "<br>" ).replace( /USA/, "<b>USA</b>" ) }
	</p>

	<p>
		${ totalsRow.join( "<br>" ).replace( /Rest of World/, "<b>Rest of World</b>" ) }
	</p>

</details>`;

	//detStats.open = window.innerWidth > 640;

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
country: ${ line[ 0 ] }<br>
cases: ${ Number( line[ 1 ] ).toLocaleString() }<br>
deaths: ${ Number( line[ 2 ] ).toLocaleString() }<br>
recoveries: ${ Number( line[ 3 ] ).toLocaleString() }<br>

`;

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";

	}

}