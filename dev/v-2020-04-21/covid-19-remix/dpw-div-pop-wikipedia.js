// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THR, resetGroups , THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */



const DPW = {};


//////////

DMT.onLoadMore = function () {

	const maxHeadroom = window.innerHeight - DMTdivPopUp.offsetTop - 15;

	DMTdivContainer.style.height = DMTdivPopUp.clientHeight < maxHeadroom ? "100%" : maxHeadroom + "px";

	const maxLegroom = window.innerWidth - DMTdivPopUp.offsetLeft - 15;

	DMTdivContainer.style.width = DMTdivPopUp.clientWidth < maxLegroom ? "100%" : maxLegroom + "px";


};



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
	//console.log( "wp.place", WP.place );

	WP.dataLinks = c19LinksGlobal.find( link => link.country === line.country && link.region === line.region );

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

		// chart = WP.dataLinks.chart + "_medical cases chart";

		// template = "Template:2019–20_coronavirus_pandemic_data/United_States/";

		WP.htmPlace = `
		<div>
			Data courtesy of Wikipedia: <a href="${ WP.chartPrefix }${ WP.dataLinks.article }" target="_blank">${ WP.place }</a>
		<div>
		<p>
			<button onclick=WP.getInfoboxes();>infobox</button>

			<button onclick=WP.getCases();>state data</button>

			<button onclick=WP.getTables();>regional data</button>

			<button onclick=WP.getGraphs(); >graphs</button>

		</p>`;

	} else {

		WP.htmPlace = `
		<div>
			Data courtesy of Wikipedia: <a href="${ WP.chartPrefix }${ WP.dataLinks.article }" target="_blank">${ WP.place }</a>
		<div>
		<p>
			<button onclick=WP.getInfoboxes();>infobox</button>

			<button onclick=WP.getCases();>national data</button>

			<button onclick=WP.getTables();>regional data</button>

			<button onclick=WP.getGraphs(); >graphs</button>

		</p>`;

	}



	DMTdivPopUp.innerHTML = DMT.htmlPopUp;

	DMTdivContent.innerHTML = `
	<div id="DMTdivJhu"  >${ htmJhu }</div>
	<div id="DMTdivMoreButtons" >${ WP.htmPlace }</div>
	<div id=WPdivGraph><div>
	`;


	WP.getInfoboxes();

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );
	DMTdivHeader.addEventListener( "touchstart", DMT.onMouseDown );

};



//////////

WP.getInfoboxes = function () {

	const url = WP.cors + WP.api + WP.query + "2020_coronavirus_pandemic_in_" + WP.dataLinks.article;
	//console.log( "", url );

	WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	requestFile( url, WP.onLoadDataInfoboxes );

};



WP.onLoadDataInfoboxes = function ( xhr ) {

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
	WP.html = parser.parseFromString( text, "text/html" );

	const infoboxes = WP.html.querySelectorAll( ".infobox" );
	//console.log( "ib", infoboxes );

	WPdivGraph.innerHTML = !infoboxes.length ?
		`<p>Wikipedia article for ${ WP.place } has no infoboxes.</p>`
		:
		"";

	infoboxes.forEach( infobox => {
		//console.log( "infobox", infobox );

		if ( location.protocol.includes( "file" ) ) {

			images = infobox.querySelectorAll( "img" );
			images.forEach( image => image.src = "https://" + image.src.slice( 5 ) );

		}

		refs = infobox.querySelectorAll( ".reference" );
		refs.forEach( ref => ref.outerHTML = "" );
		WPdivGraph.innerHTML += infobox.outerHTML + "<br><hr>";

	} );


	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

	WPdivGraph.scrollTop = 0;

};



//////////

WP.getCases = function () {

	let chart, template;

	if ( WP.places === c19GeoDataUsa ) {

		chart = WP.dataLinks.chart + "_medical cases chart";

		template = "Template:2019–20_coronavirus_pandemic_data/United_States/";

	} else {

		WP.chart = WP.dataLinks.chart;

		const suffix = WP.chart === "United States" ? "_medical cases by state" : "_medical cases chart";

		chart = WP.chart + suffix;

		template = WP.templateGlobal + "/";

	}

	const chartIdx = WP.dataLinks.chartIdx;

	if ( chartIdx > 0 ) {

		const url = WP.cors + WP.api + WP.query + template + chart;

		requestFile( url, WP.onLoadBarBox );

		WPdivGraph.innerHTML = `<img src="progress-indicator.gif" width=100 >`;

	} else {

		WPdivGraph.innerHTML = "No chart available";

	}

};



WP.onLoadBarBox = function ( xhr ) {

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	let text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const bbox = html.querySelector( ".barbox" );
	//console.log( bboxes );

	const plinks = bbox.querySelectorAll( `.plainlinks, .reflist, td[colspan="5"]` );
	//console.log( "plinks", plinks );

	plinks.forEach( link => link.style.display = "none" );

	const s = new XMLSerializer();

	str = s.serializeToString( bbox );

	str = str.replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = str + "<p><button onclick=DMTdivContent.scrollTop=0 >back to top</button></p>";

	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

	DMTdivContent.scrollTop = 88888;

};



//////////

WP.getTables = function () {

	const tables = WP.html.querySelectorAll( ".wikitable" );

	WPdivGraph.innerHTML = ! tables.length ?
		`<p>Wikipedia article for ${ WP.place } has no tables.</p>`
		:
		"";

	const s = new XMLSerializer();

	tables.forEach( table => {

		const plinks = table.querySelectorAll( `img, .plainlinks, .reference, .reflist, td[colspan="5"]` );
		plinks.forEach( link => link.outerHTML = "" );

		const str = s.serializeToString( table );

		WPdivGraph.innerHTML += str + "<br><hr>";

	} );

	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

	WPdivGraph.scrollTop = 0;

};


WP.getGraphs = function () {

	const graphs = WP.html.querySelectorAll( ".mw-graph" );

	WPdivGraph.innerHTML = ! graphs.length ?
		`<p>Wikipedia article for ${ WP.place } has no graphs.</p>`
		:
		"";

	const s = new XMLSerializer();

	graphs.forEach( graph => {

		const plinks = graph.querySelectorAll( `.plainlinks, .reference, .reflist, td[colspan="5"]` );
		plinks.forEach( link => link.outerHTML = "" );

		const images = graph.querySelectorAll( "img" );
		//console.log( "images", images );

		images.forEach( image => {
			//console.log( "image", image );
			//console.log( "src", "https://en.wikipedia.org" + image.src.slice( image.src.indexOf( "/api" ) ) );
			image.src = "https://en.wikipedia.org" + image.src.slice( image.src.indexOf( "/api" ) );
		} );
		images.forEach( image => image.style.maxWidth = "50rem" );

		const str = s.serializeToString( graph );

		WPdivGraph.innerHTML += str + "<br><hr>";

	} );

	DMT.onLoadMore(); // seems to need to run twice

	setTimeout( DMT.onLoadMore, 100 );

	WPdivGraph.scrollTop = 0;


}
