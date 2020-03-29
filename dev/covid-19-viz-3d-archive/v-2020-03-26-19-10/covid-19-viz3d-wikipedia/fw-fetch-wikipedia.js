
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

			//console.log( 'trs', trs );

			rows = Array.from( trs ).slice( 1, - 3 ).map( tr => tr.innerText.trim().replace( /\[(.*?)\]/g, "" ).replace( /,/g, "" ).split( "\n\n" ).slice( 0, - 1 ) ).sort();

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