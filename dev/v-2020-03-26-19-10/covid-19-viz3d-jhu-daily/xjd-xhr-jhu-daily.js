
// https://stackoverflow.com/questions/53127383/how-to-pull-data-from-wikipedia-page


function onLoadDailyReport( xhr ) {

	lines = xhr.target.response.split( "\n" ).map( line => line.split( "," ) );
	//console.log( 'lines', lines );

	updateBars ( lines )
}


function updateBars ( lines) {

	resetGroups();

	//console.log( 'lines', lines );

	const heightsCases = lines.slice( 1 ).map( line => Number( line[ 7 ] ) );
	//console.log( 'heightsCases', heightsCases );


	const meshesCases = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "red", ( index < 3168 ? 0.1 : 0.4 ), heightsCases[ index ] ) );

	groupCases.add( ...meshesCases );


	const heightsDeaths = lines.slice( 1 ).map( line => Number( line[ 8 ] ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "black", ( index < 3168 ? 0.15 : 0.47 ), heightsDeaths[ index ] ) );

	groupDeaths.add( ...meshesDeaths );


	const heightsRecoveries = lines.slice( 1 ).map( line => Number( line[ 9 ] ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = lines.slice( 1 ).map( ( line, index ) => addBar( line[ 5 ], line[ 6 ],
		index, "green", ( index < 3168 ? 0.15 : 0.45 ), heightsRecoveries[ index ] ) );

	groupRecoveries.add( ...meshesRecoveries );

	//getStats();

}