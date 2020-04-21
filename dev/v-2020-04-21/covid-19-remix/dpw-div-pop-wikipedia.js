// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THR, resetGroups , THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */


const DPW = {};


//////////

DMT.displayYourMessage = function ( intersected ) {

	//console.log( "event", event );
	//console.log( "DMT.intersects", DMT.intersects );

	DMTdivPopUp.hidden = false;
	DMTdivPopUp.style.left = event.clientX + "px";
	DMTdivPopUp.style.top = event.clientY + "px";

	WP.places = intersected.userData.places;
	const index = intersected.userData.index;
	const line = WP.places[ index ];
	WP.line = line;


	WP.place = line.region ? line.region : line.country;
	//console.log( "place", place );

	WP.dataLinks = c19LinksGlobal.find( place => place.country === line.country && place.region === line.region );

	DMTdivPopUp.innerHTML = `
	<div id=DMTdivIntersected>
		WP cases: ${ Number( line.cases ).toLocaleString() }<br>
		WP deaths: ${ Number( line.deaths ).toLocaleString() }<br>
		WP recoveries: ${ isNaN( Number( line.recoveries ) ) ? "NA" : Number( line.recoveries ).toLocaleString() }<br>
		<button onclick=WP.getPopUpMore(); >view ${ WP.place } case data chart</button></br>
	</div>`;

};



WP.getPopUpMore = function () {

	//console.log( "", WP.line, WP.place, WP.chart );

	let chart;
	let template;
	WP.htmPlace = "";
	let htmJhu = "";
	let chartIdx = 1;

	if ( WP.places === c19GeoDataUsa ) {

		chart = WP.dataLinks.chart + "_medical cases chart";

		template = "Template:2019–20_coronavirus_pandemic_data/United_States/";

		WP.htmPlace = `
		<div>
			Data courtesy of Wikipedia: <a href="${ WP.chartPrefix }${ WP.dataLinks.article }" target="_blank">${ WP.place }</a>
		<div>
		<p>
			<button onclick=WP.getInfobox();>infobox</button>

			<button onclick=WP.getCases();>state data</button>

			<button onclick=WP.getPlace();>regional data</button>
		</p>`;

	} else {

		// let cases = "NA";
		// let date = "NA";

		// const placeJTS = JTS.rowsCases.find( row => WP.line.country === row[ 1 ] && WP.line.region === row[ 0 ] );

		// if ( placeJTS ) {

		// 	cases = Number( placeJTS[ placeJTS.length - 1 ] );
		// 	const row = JTS.rowsCases[ 0 ];
		// 	date = row[ row.length - 1 ];
		// 	htmJhu = `
		// 		<p>
		// 			JHU Date: ${ date }<br>
		// 			JHU Cases: ${ cases.toLocaleString() }<br>
		// 		</p>
		// 	`;

		// } else {

		// 	htmJhu = `
		// 	<p>No data from JHU for this location</p>
		// 	<p>This may happen at midnight Central European time and at midnight US East Coast time.</p>`;

		// }

		WP.htmPlace = `
		<div>
			Data courtesy of Wikipedia: <a href="${ WP.chartPrefix }${ WP.dataLinks.article }" target="_blank">${ WP.place }</a>
		<div>
		<p>
			<button onclick=WP.getInfobox();>infobox</button>

			<button onclick=WP.getCases();>national data</button>

			<button onclick=WP.getPlace();>regional data</button>
		</p>`;

	}



	DMTdivPopUp.innerHTML = DMT.htmlPopUp;

	DMTdivContent.innerHTML = `
	<div id="DMTdivJhu"  >${ htmJhu }</div>
	<div id="DMTdivMoreButtons" >${ WP.htmPlace }</div>
	<div id=WPdivGraph><div>
	`;


	WP.getInfobox();

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );
	DMTdivHeader.addEventListener( "touchstart", DMT.onMouseDown );

};



WP.getCases = function () {


	if ( WP.places === c19GeoDataUsa ) {

		chart = WP.dataLinks.chart + "_medical cases chart";

		template = "Template:2019–20_coronavirus_pandemic_data/United_States/";

	} else {

		//console.log( "idx", WP.dataLinks.chartIdx );

		WP.chart = WP.dataLinks.chart;
		//.replace( /Ireland/, "Republic_of_Ireland" );

		const suffix = WP.chart === "United States" ? "_medical cases by state" : "_medical cases chart";

		chart = WP.chart + suffix;

		template = WP.templateGlobal + "/";

	}

	chartIdx = WP.dataLinks.chartIdx;

	if ( chartIdx > 0 ) {

		const url = WP.cors + WP.api + WP.query + template + chart;

		requestFile( url, WP.onLoadBarBox );

		WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	} else {

		WPdivGraph.innerHTML = "No chart available";

	}

}


WP.onLoadBarBox = function ( xhr ) {

	//console.log( "xhr", xhr );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const bbox = html.querySelector( ".barbox" );
	//console.log( bboxes );

	//const bbox = bboxes[ 0 ];

	const plinks = bbox.querySelectorAll( ".plainlinks, .reflist" );
	//console.log( "plinks", plinks );

	if ( plinks ) {

		plinks.forEach( link => link.style.display = "none" );

	}

	const extras = bbox.querySelectorAll( 'td[colspan="5"]' );

	if ( extras.length ) {

		extras[ 0 ].style.display = "none";
		//console.log( "extras", extras );

	}

	const s = new XMLSerializer();
	str = s.serializeToString( bbox );

	str = str.replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = str + "<p><button onclick=DMTdivContent.scrollTop=0 >back to top</button></p>";

	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

	DMTdivContent.scrollTop = 88888;

};



WP.getPlace = function () {

	//console.log( "get place ", WP.place );

	const url = WP.cors + WP.api + WP.query + "2020_coronavirus_pandemic_in_" + WP.dataLinks.article;
	//console.log( "", url );

	WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	requestFile( url, WP.onLoadDataTable );

};



WP.onLoadDataTable = function ( xhr ) {

	//console.log( "xhr", xhr );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	text = text
		.replace( /\<img (.*?)>/gi, "" )
		.replace( /\<a href(.*?)>/gi, "" )
		.replace( /\<ul>(.*?)\<\/ul>/i, "" );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const ttab = html.querySelector( ".wikitable" );

	const s = new XMLSerializer();
	const str = s.serializeToString( ttab );

	WPdivGraph.innerHTML = str;

	WPdivGraph.scrollTop = 0;

};



//////////

WP.getInfobox = function () {

	//console.log( "get place ", WP.place );

	const url = WP.cors + WP.api + WP.query + "2020_coronavirus_pandemic_in_" + WP.dataLinks.article;
	//console.log( "", url );

	WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	requestFile( url, WP.onLoadDataInfobox );

};

WP.onLoadDataInfobox = function ( xhr ) {

	//console.log( "xhr", xhr );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	text = text
		.replace( /\<a href(.*?)>/gi, "" )
		.replace( /\<ul>(.*?)\<\/ul>/i, "" )
		.replace( /\[(.*?)\]/g, "" );


	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const infoboxes = html.querySelectorAll( ".infobox" );

	WPdivGraph.innerHTML = "";

	infoboxes.forEach( infobox => {
		//console.log( "infobox", infobox );
		images = infobox.querySelectorAll( "img" );
		images.forEach( image => image.src = "https://" + image.src.slice( 5 ) );
		refs = infobox.querySelectorAll( ".reference" );
		refs.forEach( ref => ref.style.display = "none" );
		WPdivGraph.innerHTML += infobox.outerHTML + "<br><hr>";
	} );

	WPdivGraph.scrollTop = 0;

	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

};
