// copyright 2020 Spider contributors. MIT license.
// 2020-04-01
/* global MASdivMenuAppSwitch */




const MAS = {};



MAS.getMenuAppSwitch = function () {

	const htm = `
	<div style=background-color:white;padding:1ch; >
		<h4 title: "Fewest errors" style=margin:0;padding:0; >Stable versions</h4>
		<ul style="margin:0 0 1ch 0;padding:0 2ch;" >
			<li><a href="../../../stable/v-2020-04-01/covid-19-viz3d-jhu-time/covid-19-viz-3d.html" title="" >
				JHU Time Series Global</a></li>
			<li><a href="../../../stable/v-2020-04-01/covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html" title="" >
				JHU Daily Reports G+USA</a></li>
			<li><a href="../../../stable/v-2020-04-01/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html" title="" >Wikipedia Global</a></li>
		</ul>
		<h4 title="Curious things may happen here" style=Margin:0; >Under construction 'Beta' versions</h4>
		<ul style="margin:0 0 1ch 0;padding:0 2ch;" >
			<li><a href="../../../dev/v-2020-04-02/covid-19-viz3d-jhu-time/covid-19-viz-3d.html" title="" >
				JHU Time Series Global<a></li>
			<li><a href="https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-04-02/covid-19-viz3d-jhu-daily/covid-19-viz-3d-jhu-daily.html" title="" >
				JHU Daily Reports G+USA</a></li>
			<li><a href="https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-04-02/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html" title="" >Wikipedia Global</a></li>
		</ul>
	</div>`;

	MASdivMenuAppSwitch.innerHTML = htm;

};



MAS.getMenuAppSwitch();
