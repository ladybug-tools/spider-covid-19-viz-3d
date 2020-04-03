


let wikiPages = [

	"2019–20_coronavirus_pandemic_by_country_and_territory",
	"2020_coronavirus_pandemic_in_the_United_States"
];

let rows = [];
let ln = 0;

function initFw() {

	const api = "https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=";

	resetGroups();

	fetchUrlWikipediaApi( api + wikiPages[ 0 ], 0, 0 );

	fetchUrlWikipediaApi( api + wikiPages[ 1 ], 1, 1 );


}



function fetchUrlWikipediaApi ( url, table, column ) {

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

			const trs = tables[ table ].querySelectorAll( "tr" );
			//console.log( 'trs', trs );

			const items = Array.from( trs ).slice( 1, - 3 ).map( tr => tr.innerText.trim()
				.replace( /\[(.*?)\]/g, "" )
				.replace( /,/g, "" )
				.split( "\n\n" )
				//.slice( 0, - 1 )
			)//.sort();

			updateBars( items, column );

			rows.push( ...items );

		} );

}



function updateBars ( items, column ) {
	
	console.log( 'items', items );

	lines = items.slice( 0 ).map( ( row, index ) => {

		place = places.find( place => place[ column ] === row[ 0 ] )

		if ( !place ) { console.log( 'place lost', index, row );}

		return place ? place.concat( row ) : row

	})
	//console.log( 'lines', lines );

	const heightsCases = lines.slice( 1 ).map( line => Number( line[ 5 ] ) );
	//console.log( 'heightsCases', heightsCases );


	const meshesCases = lines.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], ( ln + index ), "red", 0.4, heightsCases[ index ], 0, 12, 1, false ) );

	groupCases.add( ...meshesCases );


	const heightsDeaths = lines.slice( 1 ).map( line => Number( line[ 6 ] ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = lines.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], ln + index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeaths );


	const heightsRecoveries = lines.slice( 1 ).map( line => Number( line[ 7 ] ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = lines.slice( 1 ).map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], ln + index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveries.add( ...meshesRecoveries );

	ln += items.length;

	if ( ln > 230 ) { 	getStats(); }


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


	const chinaCases = Number( rows[ 3 ][ 1 ] );
	const chinaDeaths =  Number( rows[ 3 ][ 2 ] );
	const chinaRecoveries =  Number( rows[ 3 ][ 3 ] );

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


	displayStats( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow );

	detStats.open = window.innerWidth > 640;

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
<a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory" target="_blank">Wikipedia data</a><br>
country: ${ line[ 0 ] }<br>
cases: ${ Number( line[ 1 ] ).toLocaleString() }<br>
deaths: ${ Number( line[ 2 ] ).toLocaleString() }<br>
recoveries: ${ Number( line[ 3 ] ).toLocaleString() }<br>
wikipedia pandemic page:<br>
${ line[ 0 ] }

`;

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";

	}

}