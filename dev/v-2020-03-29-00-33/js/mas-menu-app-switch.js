

MAS = {}

// https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-03-29-00-33

MAS.arrApps = [

	{
		text: "JHU Time Series Global Stable", url: "https://ladybug.tools/spider-covid-19-viz-3d/",
		title: "Probably the most authoritative and referenced source of COVID-19 case data"
	},
	{
		text: "JHU Time Series Global Dev", url: "https://ladybug.tools/spider-covid-19-viz-3d/dev/",
		title: "Development version of the above currently under development"
	},
	{
		text: "JHU Daily Reports Global+USA",
		url: "../covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html",
		title: "JHU data with the daily reports for over 3,000 US counties"
	},
	{
		text: "Wikipedia Global",
		url: "../covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html",
		title: "Data from Wikipedia that appears to be update more frequently than the JHU data"
	}

];


MAS.getMenuAppSwitch = function () {

	const options = MAS.arrApps.map( item =>
		`<option value="${item.url}" title="${item.title}" >${item.text}</option>` );

	const htm = `<select id=MASselApp oninput=window.location.href=this.value style=width:100%; size=4 >${ options }</select>`;

	MASdivMenuAppSwitch.innerHTML = htm;

}

MAS.getMenuAppSwitch()
