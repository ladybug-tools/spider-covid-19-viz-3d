
var california = {};

california.init = function () {

	WPdivPlaceJs.innerHTML = `
		<p>
		<button onclick=california.getPlace();>get County data</button>
		</p>
	`;

};


california.getPlace = function () {

	const article = "Template:2020_coronavirus_pandemic_by_California_county";
	requestFile( WP.cors + WP.api + WP.query + article, WP.onLoadDataTable );

};
