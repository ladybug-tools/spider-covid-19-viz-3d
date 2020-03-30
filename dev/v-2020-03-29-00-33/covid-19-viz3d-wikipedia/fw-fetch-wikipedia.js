


let wikiPages = [

	"2019–20_coronavirus_pandemic_by_country_and_territory",
	"2020_coronavirus_pandemic_in_the_United_States"
];

const api = "https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=";

const iCase = 6;
const iDeath = 7
const iRecover = 8;

let rows = [];

function initFw() {


	resetGroups();

	fetchUrlWikipediaApi( wikiPages[ 0 ], 0, 1, 0);

	fetchUrlWikipediaApi( wikiPages[ 1 ], 1, 3, 1 );


}



function fetchUrlWikipediaApi ( url, table = 0, rowStart = 0, column = 0 ) {

	fetch( api + url )
		.then( function ( response ) {
			return response.json();
		} )
		.then( function ( response ) {

			const html_code = response[ "parse" ][ "text" ][ "*" ];
			const parser = new DOMParser();
			const html = parser.parseFromString( html_code, "text/html" );
			const tables = html.querySelectorAll( ".wikitable" );

			let rowsCovid = [];
			//console.log(tables[ 0 ]);

			const trs = tables[ table ].querySelectorAll( "tr" );
			console.log( 'trs', trs );

			const rowsTmp = Array.from( trs ).slice( rowStart ).map( tr => tr.innerText.trim()
				.replace( /\[(.*?)\]/g, "" )
				.replace( /,/g, "" )
				.split( "\n\n" )
				//.slice( 0, - 1 )
			)//.sort();

			if ( url === wikiPages[ 0 ] ) {

				globals = rowsTmp[ 0 ];

				//console.log( 'globals', globals );

				rowsTmp.shift();

			}

			combineLists( rowsTmp, column );

			if ( !window.filesLoaded ) {

				filesLoaded = 1;

			} else { filesLoaded++; }

			if ( filesLoaded === wikiPages.length ) {

				rows.forEach( ( line ) => line[ iCase ] = isNaN( Number( line[ iCase ] ) ) ? "0" : line[ iCase ] );
				rows.forEach( ( line ) => line[ iDeath ] = isNaN( Number( line[ iDeath ] ) ) ? "0" : line[ iDeath ] );
				rows.forEach( ( line ) => line[ iRecover ] = isNaN( Number( line[ iRecover ] ) ) ? "0" : line[ iRecover ] );

				//console.log( 'rows', rows );
				updateBars( rows );
				getStats();

			}

		} );

}


const tt = []

function combineLists ( rowsCvd, column) {
	//console.log( 'rows covid', column, rowsCvd,  );

	for ( let i = 0; i < rowsCvd.length; i++ ) {

		const row = rowsCvd[ i ];

		const place = places.find( place => place[ column ] === row[ 0 ] )

		if ( !place ) { continue; }

		rows.push( [ ...place, ...row ] );

	}

	// rowsTmp = rowsCvd.map( ( row, index ) => {

	// 	const place = places.map( place => place[ column ] === row[ 0 ] );

	// 	if ( !place ) {

	// 		console.log( 'place lost', index, row );

	// 		return;

	// 	}

	// 	return place.push( ...row );

	// } )//.filter( items => items );

	// console.log( 'rowsTmp', rowsTmp );
	// rows.push( ... rowsTmp );

	//console.log( 'rows', rows );

}


function updateBars ( items ) {

	const heightsCases = items.map( line => Number( line[ iCase ] ) );
	//console.log( 'heightsCases', heightsCases );


	const meshesCases = items.map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "red", 0.4, heightsCases[ index ], 0, 12, 1, false ) );

	groupCases.add( ...meshesCases );


	const heightsDeaths = items.map( line => Number( line[ iDeath ] ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = items.map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeaths );


	const heightsRecoveries = items.map( line => Number( line[ iRecover ] ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = items.map( ( line, index ) =>
		addBar( line[ 2 ], line[ 3 ], index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveries.add( ...meshesRecoveries );

}





function getStats () {

	const europe = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "EstoniaF", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Holy See" ];

	const globalCases = Number( globals[ 1 ] );
	const globalDeaths = Number( globals[ 2 ] );
	const globalRecoveries = Number( globals[ 3 ] );


	const chinaCases = rows.reduce( ( sum, line ) => sum += line[ 0 ].includes( "China") ? Number( line[ iCase ] ) : 0, 0 );
	const chinaDeaths =  rows.reduce( ( sum, line ) => sum += line[ 0 ].includes( "China") ? Number( line[ iDeath ] ) : 0, 0 );
	const chinaRecoveries =  rows.reduce( ( sum, line ) => sum += line[ 0 ].includes( "China") ? Number( line[ iRecover ] ) : 0, 0 );

	const europeCases = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 0 ] ) ? Number( line[ iCase ] ) : 0, 0 );
	const europeDeaths = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 0 ] ) ? Number( line[ iDeath ] ) : 0, 0 );
	const europeRecoveries = rows.reduce( ( sum, line ) => sum += europe.includes( line[ 0 ] ) ? Number( line[ iRecover ] ) : 0, 0 );

	const usaCases = rows.reduce( ( sum, line ) => sum += line[ 0 ] === "United States" && line[ 1 ] === "" ? Number( line[ iCase ] ) : 0, 0 );
	const usaDeaths = rows.reduce( ( sum, line ) => sum += line[ 0 ] === "United States" && line[ 1 ] === "" ? Number( line[ iDeath ] ) : 0, 0 );
	const usaRecoveries = rows.reduce( ( sum, line ) => sum += line[ 0 ] === "United States" && line[ 1 ] === "" ? Number( line[ iRecover ] ) : 0, 0 );

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

			const index = intersected.userData;

			const line = rows[ index ];
			console.log( 'line', line );

			const place = line[ 1 ] ? line[ 1 ] : line[ 0 ];

			divMessage.hidden = false;
			divMessage.style.left = event.clientX + "px";
			divMessage.style.top = event.clientY + "px";
			divMessage.innerHTML = `
<a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory" target="_blank">Wikipedia data</a><br>
country: ${ line[ 0 ] }<br>
place: ${ line[ 1 ] }<br>
cases: ${ Number( line[ iCase ] ).toLocaleString() }<br>
deaths: ${ Number( line[ iDeath ] ).toLocaleString() }<br>
recoveries: ${ Number( line[ iRecover ] ).toLocaleString() }<br>
wikipedia pandemic page:<br>
<a href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${ place }" target="_blank">${ place }</a>
<p><button onclick=showLocation("${ place }"); >show ${ place } statistics </button></p>
<div id=popStats style="height:30ch;overflow:auto;resize:both;"></div>
`;
		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";

	}

}

function showLocation ( place, table = 0 ) {



	if ( place  === "" ) {

		alert( "data coming soon" );

	} else {

		url = "2020_coronavirus_pandemic_in_" + place;

		fetchUrlWikipediaApiPlace ( url, table )

	}


}


function fetchUrlWikipediaApiPlace ( url, table = 0, rowStart = 0, column = 0 ) {

	fetch( api + url )
		.then( function ( response ) {
			return response.json();
		} )
		.then( function ( response ) {

			const html_code = response[ "parse" ][ "text" ][ "*" ];
			const parser = new DOMParser();
			const html = parser.parseFromString( html_code, "text/html" );
			const tables = html.querySelectorAll( ".wikitable" );

			const trs = tables[ table ].querySelectorAll( "tr" );
			console.log( 'trs', trs );

			const rows = Array.from( trs ).slice( rowStart ).map( tr => tr.innerText.trim()
				.replace( /\[(.*?)\]/g, "" )
				.replace( /,/g, "" )
				.split( "\n\n" )
				//.slice( 0, - 1 )
			)//.sort();

			console.log( 'rt', rows );

			const htm = rows.map( row => `${ row.join( " " ) }` )

			popStats.innerHTML = htm.join( "<br>" );

		} );

}
