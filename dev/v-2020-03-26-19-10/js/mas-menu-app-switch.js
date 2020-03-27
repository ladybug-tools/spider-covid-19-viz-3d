

MAS = {}


MAS.arrApps = [

	{
		text: "covid-19 viz3D JHU", url: "https://ladybug.tools/spider-covid-19-viz-3d/",
		title: "Probably the most authoritative and referenced source of COVID-19 case data"
	},
	{
		text: "covid-19 viz3D JHU Dev", url: "https://ladybug.tools/spider-covid-19-viz-3d/dev/",
		title: "The version of the above currently under development"
	},
	{
		text: "covid-19 viz3D Wikipedia", url: "https://ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-03-26-19-10/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html",
		title: "Data from Wikipedia that appears to be update more frequently than the JHU data"
	},
	{
		text: "Spider home page", url: "https://www.ladybug.tools/spider/",
		title: "3D interactive analysis in your browser mostly written around the Three.js JavaScript library"
	},
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

	/*
	{
		text: "gbXML.org home page", url: "http://www.gbxml.org",
		title: "Green Building XML (gbXML) is the language of buildings ... allowing disparate building design software tools to all communicate with one another."
	},
	{
		text: "gbXML.org Schema", url: "http://www.gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html",
		title: "Version 6.01 of the gbXML schema"
	},

	{
		text: "Spider gbXML Viewer R12 Aragog", url: "https://https://www.ladybug.tools/spider/gbxml-viewer/",
		title: "A popular release"
	},
	{
		text: "Spider gbXML Viewer R14", url: "https://www.ladybug.tools/spider/gbxml-viewer/r14/aragog-shortcut.html",
		title: "An interesting release"
	},

	{
		text: "Spider gbXML Viewer v0.17 Atrax stable", url: "https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/",
		title: "Mission: run a series of basic checks on gbXML files to identify, report and help you fix any issues."
	},
	{
		text: "Spider gbXML Viewer v0.17 beta", url: "https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/dev/",
		title: "Latest development release - still under development - may have issues"
	},
	{
		text: "Spider gbXML Fixer", url: "https://www.ladybug.tools/spider-gbxml-fixer/",
		title: "Scripts to help you load and manage gbXML files"
	},
	{
		text: "Radiance Online home page", url: "https://www.radiance-online.org/",
		title: "Radiance is a suite of programs for the analysis and visualization of lighting in design."
	},
	{
		text: "Spider RAD viewer", url: "https://www.ladybug.tools/spider-rad-viewer/rad-viewer",
		title: "View Radiance RAD files in interactive 3D in your browser using the Three.js JavaScript library"
	},

	*/
];


MAS.getMenuAppSwitch = function () {

	const options = MAS.arrApps.map( item =>
		`<option value="${item.url}" title="${item.title}" >${item.text}</option>` );

	const htm = `<select oninput=window.location.href=this.value style=width:100%; size=3 >${ options }</select>`;

	MASdivMenuAppSwitch.innerHTML = htm;

}

MAS.getMenuAppSwitch()
