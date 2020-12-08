// copyright 2020 Theo Armour. MIT license.
/* global GFO, JTVdivJsonTreeView, JTVdivJsonTree */
// jshint esversion: 6
// jshint loopfunc: true

const JTV = {};

//JTV.target = JTVdivJsonTreeView;
JTV.root = "panel";
JTV.json = undefined;

JTV.schemas = [

];

JTV.init = function () {
	//window.addEventListener("onloadJson", JTV.onLoad, false);

	//JTVdivJsonTreeView.innerHTML = JTV.getMenu();

	JTVdivJsonTree.innerHTML = JTV.parseJson(JTV.root, JTV.json, 0);

	setTimeout( JTV.update, 500 )

};


JTV.update = function() {

	const details = JTVdivJsonTree.querySelectorAll("details");

	details[0].open = true;

	const panelsHtml = Array.from(JTVdetRooms.children).slice(1);

	//console.log("", panelsHtml);

	// panelsHtml.forEach(
	// 	(panel, idx) =>
	// 		(panel.innerHTML =
	// 			`<p><button onclick=console.log(this.value); value=${idx} >highlight panel</button></p>
	// 	` + panel.innerHTML)
	// );
};

JTV.getMenu = function () {
	const htm = `
JSON tree view

<span class="info" >??<span class="infoTooltip" >

	<p>JSON rendered to a tree view using the Spider JSON Tree Viewer script</p>

</span></span>

<div id="JTVdivJsonTree"></div>
`;

	return htm;
};

JTV.parseJson = function (key = "", item = {}, index = 0) {
	//console.log( '', key, item, index );

	const type = typeof item;

	if (["string", "number", "boolean", "null", "bigint"].includes(type) || !item) {
		return JTV.getString(key, item, index);
	} else if (type === "object") {
		return Array.isArray(item) ? JTV.getArray(key, item, index) : JTV.getObject(key, item, index);
	}
};

JTV.getString = function (key, item, index) {
	//console.log( 'string', key, item, index  );

	// https://stackoverflow.com/questions/8299742/is-there-a-way-to-convert-html-into-normal-text-without-actually-write-it-to-a-s
	//if ( typeof item === "string" ) { item = item.replace( /<[^>]*>/g, '' ); }
	//if ( typeof item === "number" ) { item = item.toLocaleString() };

	const htm = JTV.schemas.includes(item)
		? `<div>${key}: ${item}</div>`
		: `<div>${key}: <span style=color:green >${item}<span></div>`;

	return htm;
};

JTV.getArray = function (key, array, index) {
	//console.log( 'Array', key, array );

	const str = key === "rooms" ? "id=JTVdetRooms" : "";

	const htm = array.map((item, index) => JTV.parseJson(key, item, index)).join("");

	return `<details ${ str } style="margin: 1ch 0 1ch 1ch;" >
		<summary>${key} [ ${array.length} ]</summary>${htm}
	</details>`;
};

JTV.getObject = function (key, item, index) {
	//if ( !item ) { console.log( 'error:', key, item, index ); return; }

	const keys = Object.keys(item);
	const htm = keys.map(key => JTV.parseJson(key, item[key])).join("");

	return `<details style="margin: 1ch 0 1ch 1ch;" >
		<summary>${key} ${index}: { ${keys.length} }</summary>${htm}
	</details>`;
};
