
var spain = {};

spain.init = function () {

	WPdivPlaceJs.innerHTML = `
		<p>
			<button onclick=spain.getCommunity();>view Community data chart</button>
		</p>
	`;

};


spain.getCommunity = function () {

	const article = "Template:2019–20_coronavirus_pandemic_data/Spain_medical_cases";
	requestFile( WP.cors + WP.api + WP.query + article, WP.onLoadDataTable );

};



spain.onLoadData = function ( xhr ) {

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

	const tables = html.querySelectorAll( ".wikitable" );
	//console.log(tables );


	const ttab = tables[ 0 ];

	const s = new XMLSerializer();
	const str = s.serializeToString( ttab ).replace( /\[(.*?)\]/g, "" );

	WPdivGraph.innerHTML = str;

};


spain.init();
