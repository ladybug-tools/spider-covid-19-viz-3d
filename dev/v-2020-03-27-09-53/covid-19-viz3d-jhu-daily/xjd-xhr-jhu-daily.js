
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

	getStats();

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