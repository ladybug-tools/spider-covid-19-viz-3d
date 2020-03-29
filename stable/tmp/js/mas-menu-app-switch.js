

MAS = {}


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
		text: "JHU Daily Reports Global+USA", url: "https://www.ladybug.tools/spider-covid-19-viz-3d/stable/charts/covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html",
		title: "JHU data with the daily reports for over 3,000 US counties"
	},
	{
		text: "Wikipedia Global", url: "https://www.ladybug.tools/spider-covid-19-viz-3d/stable/charts/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html",
		title: "Data from Wikipedia that appears to be update more frequently than the JHU data"
	},
	/*
	{
		text: "Spider home page", url: "https://www.ladybug.tools/spider/",
		title: "3D interactive analysis in your browser mostly written around the Three.js JavaScript library"
	}


	{
		text: "Ladybug Tools home page", url: "https://www.ladybug.tools",
		title: "free computer applications that support environmental design and education"
	},
	{
		text: "Ladybug Tools GitHub", url: "https://github.com/ladybug-tools",
		title: "Source code repositories"
	},
	{
		text: "Spider gbXML tools", url: "https://www.ladybug.tools/spider-gbxml-tools/",
		title: "Home page for tools to help you find, load, examine and edit gbXML files - in large numbers and sizes"
	},
	*/
];


MAS.getMenuAppSwitch = function () {

	const options = MAS.arrApps.map( item =>
		`<option value="${item.url}" title="${item.title}" >${item.text}</option>` );

	const htm = `<select id=MASselApp oninput=window.location.href=this.value style=width:100%; size=4 >${ options }</select>`;

	MASdivMenuAppSwitch.innerHTML = htm;

}

MAS.getMenuAppSwitch()
