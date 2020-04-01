// copyright 2020 Spider contributors. MIT license.
// 2020-04-01
/* global MASdivMenuAppSwitch */




const MAS = {};


// MAS.arrApps = [
// 	{
// 		label: "stable versions",
// 		tag: "optgroup",
// 		text: "",
// 		title: "Fewest errors"

// 	},
// 	{
// 		tag: "option",
// 		text: "JHU Time Series Global Stable",
// 		url: "https://ladybug.tools/spider-covid-19-viz-3d/",
// 		//url: "../../../stable/covid-19-viz3d-jhu-time/covid-19-viz-3d.html",
// 		title: "Probably the most authoritative and referenced source of COVID-19 case data"
// 	},
// 	{
// 		tag: "option",
// 		text: "JHU Daily Reports Global+USA",
// 		url: "https://ladybug.tools/spider-covid-19-viz-3d/stable/covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html",
// 		//url: "../covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html",

// 		title: "JHU data with the daily reports for over 3,000 US counties"
// 	},
// 	{
// 		tag: "option",
// 		text: "Wikipedia Global",
// 		url: "https://ladybug.tools/spider-covid-19-viz-3d/stable/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html",
// 		//url: "../covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html",
// 		title: "Data from Wikipedia that appears to be update more frequently than the JHU data"
// 	},
// 	{
// 		label: "Under construction 'Beta' versions",
// 		tag: "optgroup",
// 		text: "",
// 		title: "Curious things may happen here"

// 	},
// 	{
// 		tag: "option",
// 		text: "JHU Time Series Global Dev",
// 		url: "https://ladybug.tools/spider-covid-19-viz-3d/dev/",
// 		//url: "../covid-19-viz3d-jhu-time/covid-19-viz-3d.html",
// 		title: "Development version of the above currently under development"
// 	},

// ];



MAS.getMenuAppSwitch = function () {

	// const options = MAS.arrApps.map( item =>
	// 	`<${ item.tag } value="${ item.url }" label="${ item.label }" title="${ item.title }" >
	// 	${ item.text }</${ item.tag }>` );

	const options = `
<optgroup label="Stable versions" title: "Fewest errors" >
<option value="https://www.ladybug.tools/spider-covid-19-viz-3d/stable/v-2020-04-01/covid-19-viz3d-jhu-time/covid-19-viz-3d.html" title="" >JHU Time Series Global</option>
<option value="https://www.ladybug.tools/spider-covid-19-viz-3d/stable/v-2020-04-01/covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html" title="" >JHU Daily Reports G+USA</option>
<option value="https://www.ladybug.tools/spider-covid-19-viz-3d/stable/v-2020-04-01/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html" title="" >Wikipedia Global</option>
</optgroup>
<optgroup label="Under construction 'Beta' version" title: "Curious things may happen here">
<option value="https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-04-01/covid-19-viz3d-jhu-time/covid-19-viz-3d.html" title="" >JHU Time Series Global</option>
<option value="https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-04-01/covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html" title="" >JHU Daily Reports G+USA</option>
<option value="https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-04-01/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html" title="" >Wikipedia Global</option>
</optgroup>
`;

	const htm = `<select id=MASselMenuAppSelect oninput=window.location.href=this.value size=8 >${ options }</select>`;

	MASdivMenuAppSwitch.innerHTML = htm;

};



MAS.getMenuAppSwitch();
