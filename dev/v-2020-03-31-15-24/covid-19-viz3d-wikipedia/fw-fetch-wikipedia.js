// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* globals THREE, addBar, displayStats, detStats, resetGroups, groupCases, groupDeaths, groupRecoveries, globals, places, popStats, renderer, camera, intersected, divMessage*/
// jshint esversion: 6
// jshint loopfunc: true


let wikiPages = [

	"2019–20_coronavirus_pandemic_by_country_and_territory",
	"2020_coronavirus_pandemic_in_the_United_States"
];

const api = "https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=";

const iCase = 6;
const iDeath = 7;
const iRecover = 8;

let rows = [];
let placeWP;

function initFw() {

	resetGroups();

	fetchUrlWikipediaApi( wikiPages[ 0 ], 0, 1, 0);

	fetchUrlWikipediaApi( wikiPages[ 1 ], 0, 3, 1 );


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
			//console.log( 'trs', trs );

			const rowsTmp = Array.from( trs ).slice( rowStart ).map( tr => tr.innerText.trim()
				.replace( /\[(.*?)\]/g, "" )
				.replace( /,/g, "" )
				.split( "\n\n" )
				//.slice( 0, - 1 )
			); //.sort();

			if ( url === wikiPages[ 0 ] ) {

				globals = rowsTmp[ 0 ];
				//console.log( 'globals', globals );

				rowsTmp.shift();

			}

			combineLists( rowsTmp, column );

			if ( !window.filesLoaded ) {

				window.filesLoaded = 1;

			} else { window.filesLoaded++; }

			if ( window.filesLoaded === wikiPages.length ) {

				rows.forEach( ( line ) => line[ iCase ] = isNaN( Number( line[ iCase ] ) ) ? "0" : line[ iCase ] );
				rows.forEach( ( line ) => line[ iDeath ] = isNaN( Number( line[ iDeath ] ) ) ? "0" : line[ iDeath ] );
				rows.forEach( ( line ) => line[ iRecover ] = isNaN( Number( line[ iRecover ] ) ) ? "0" : line[ iRecover ] );
				//console.log( 'rows', rows );

				updateBars( rows );
				getStats();

			}

		} );

}



function combineLists ( rowsCvd, column) {
	//console.log( 'rows covid', column, rowsCvd,  );

	for ( let row of rowsCvd ) {

		const place = places.find( place => place[ column ] === row[ 0 ] );

		if ( !place ) { continue; }

		rows.push( [ ...place, ...row ] );

	}

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

	const totalsChina = [
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



function nnnnonDocumentMouseMove ( event ) {

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

		}

	} else {

		intersected = null;
		divMessage.hidden = true;
		divMessage.innerHTML = "";

	}

}




function displayMessage () {


	const index = intersected.userData;

	const line = rows[ index ];
	console.log( 'line', line );

	let place = line[ 1 ] ? line[ 1 ] : line[ 0 ];

	placeWP = place
		.replace( /United/g, "the_United" )
		.replace( / /g, "_" )
		.replace( /New_York/, "New_York_(state)" )
		.replace( /Georgia/, "Georgia_(U.S._state)" );

	// divMessage.hidden = false;
	// divMessage.style.left = ( 10 + event.clientX )+ "px";
	// divMessage.style.top = event.clientY + "px";


	DMTdragParent.hidden = false;

	DMT.setTranslate( 0, 0, DMTdragItem );

	DMTdragParent.style.left = ( event.clientX ) + "px";
	DMTdragParent.style.top = event.clientY + "px";

	DMTdragParent.style.width = "40ch";
	divMessage.innerHTML = `
<a href="https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory" target="_blank">Wikipedia data</a><br>
country: ${ line[ 0 ] }<br>
place: ${ line[ 1 ] }<br>
cases: ${ Number( line[ iCase ] ).toLocaleString() }<br>
deaths: ${ Number( line[ iDeath ] ).toLocaleString() }<br>
recoveries: ${ Number( line[ iRecover ] ).toLocaleString() }<br>
wikipedia pandemic page:<br>
<a href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_${ placeWP }" target="_blank">${ place }</a>
<p><button onclick=showLocation("${ placeWP }","${ line[ 4 ] }"); >show ${ place } Wikipedia statistics </button></p>
<div id=popStats style="bottom: 1ch; max-height:50ch;max-width:100%;overflow:auto;">
2020-03-30 Effort beginning to work.<br>
Works in many countries.<br>
Could show better tables.<br>
Needs better styling and parsing</div>
`;

}



function showLocation ( place, table ) {

	console.log( 'place', place );

	if ( place  === "" ) {

		alert( "data coming soon" );

	} else {

		const url = "2020_coronavirus_pandemic_in_" + placeWP;

		fetchUrlWikipediaApiPlace( url, table );

	}

}



function fetchUrlWikipediaApiPlace ( url, tab = 0, rowStart = 0, column = 0 ) {

	tab = !tab ? 0 : tab;

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
			//console.log( 'html', html );
			const tables = html.querySelectorAll( ".wikitable,.barbox" );

			ttab = tables[ tab ];

			if ( ! ttab ) { alert( "There seem to be no charts or tables we can access here.\n\nTry another place" ); return; }
			//popStats.style.maxWidth = "300px";

			const s = new XMLSerializer();
			const str = s.serializeToString( ttab).replace( /\[(.*?)\]/g, "" );

			popStats.innerHTML = str;

			// const trs = tables[ table ].querySelectorAll( "tr" );
			// //console.log( 'trs', trs );

			// const rows = Array.from( trs ).slice( rowStart ).map( tr => tr.innerText.trim()
			// 	.replace( /\[(.*?)\]/g, "" )
			// 	.replace( /,/g, "" )
			// 	.split( "\n\n" )
			// 	//.slice( 0, - 1 )
			// )//.sort();

			// //console.log( 'rt', rows );

			// const htm = rows.map( row => `${ row.join( " " ) }` )

			// popStats.innerHTML = htm.join( "<br>" );

		} );

}