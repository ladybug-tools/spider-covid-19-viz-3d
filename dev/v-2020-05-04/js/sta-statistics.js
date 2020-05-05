
const sta = {};

sta.Africa = { cases: 0, deaths: 0, recoveries: 0 };
sta.Americas = { cases: 0, deaths: 0, recoveries: 0 };
sta.Asia = { cases: 0, deaths: 0, recoveries: 0 };
sta.Europe = { cases: 0, deaths: 0, recoveries: 0 };
sta.Oceania = { cases: 0, deaths: 0, recoveries: 0 };

sta.init = function () {

	c19GeoDataGlobal.forEach( country => {

		if ( country.region === "" ) {

			const continent = sta[ country.continent ];
			//console.log( "cont", continent, country.cases );

			continent.cases += Number( country.cases ) || 0;
			continent.deaths += Number( country.deaths ) || 0;
			continent.recoveries += Number( country.recoveries ) || 0;

		} else {

			//console.log( "", country, country.region );

		}
	} );
	//console.log( "sta", sta );

	TXT.addTextContinents();

};



TXT.addTextContinents = function () {

	THR.scene.remove( TXT.group );

	TXT.group = new THREE.Group();

	// TBD: put this into a loop

	const africa =
		`Africa\n` +
		`Cases: ${ sta.Africa.cases.toLocaleString() }\n` +
		`Deaths: ${ sta.Africa.deaths.toLocaleString() }\n`+
		`Recoveries: ${ sta.Africa.recoveries.toLocaleString() }\n`;

	const europe =
		`Europe\n` +
		`Cases: ${ sta.Europe.cases.toLocaleString() }\n` +
		`Deaths: ${ sta.Europe.deaths.toLocaleString() }\n`+
		`Recoveries: ${ sta.Europe.recoveries.toLocaleString() }\n`;

	const asia =
		`Asia\n` +
		`Cases: ${ sta.Asia.cases.toLocaleString() }\n` +
		`Deaths: ${ sta.Asia.deaths.toLocaleString() }\n`+
		`Recoveries: ${ sta.Asia.recoveries.toLocaleString() }\n`;

	const americas =
		`Americas\n` +
		`Cases: ${ sta.Americas.cases.toLocaleString() }\n` +
		`Deaths: ${ sta.Americas.deaths.toLocaleString() }\n`+
		`Recoveries: ${ sta.Americas.recoveries.toLocaleString() }\n`;

	const oceania =
		`Oceania\n` +
		`Cases: ${ sta.Oceania.cases.toLocaleString() }\n` +
		`Deaths: ${ sta.Oceania.deaths.toLocaleString() }\n`+
		`Recoveries: ${ sta.Oceania.recoveries.toLocaleString() }\n`;

	const globals =
		`Global totals\nCases: ${ WP.totalsGlobal[ 2 ].slice( 1 ) }\n`+
		`Deaths: ${ WP.totalsGlobal[ 4 ].slice( 1 ) } \n`+
		`Recoveries: ${WP.totalsGlobal[ 6 ].slice( 1 ) }\n`;

	TXT.getSimpleText( { text: africa, color: "black", radius: 68, latitude: "0", longitude: "0" } );
	TXT.getSimpleText( { text: europe, color: 0x0085C7, latitude: "60", longitude: "40" } );
	TXT.getSimpleText( { text: asia, color: 0xF4C300, latitude: "30", longitude: "140" } );
	TXT.getSimpleText( { text: oceania, color: 0x009F3D, latitude: "-10", longitude: "170" } );
	TXT.getSimpleText( { text: americas, color: 0xDF0024, radius: "70", latitude: "10", longitude: "-100" } );
	TXT.getSimpleText( { text: globals, color: 0x444444, radius: "72", latitude: "20", longitude: "-160" } );

	THR.scene.add( TXT.group );

};