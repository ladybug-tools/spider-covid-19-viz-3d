// copyright 2020 Spider contributors. MIT license.
// 2020-04-01
/* global MASdivMenuAppSwitch */




const MAS = {};



MAS.getMenuAppSwitch = function () {

	const htm = `
	<div style=background-color:white;padding:1ch; >
		<h4 title: "Fewest errors" style=margin:0;padding:0; >Stable versions</h4>
		<ul style="margin:0 0 1ch 0;padding:0 2ch;" >
			<li id=MASliJTSstable ><a href="../../../stable/${ versionStable }/covid-19-viz3d-jts/jts-time-series.html" title="" >
				JHU Time Series Global</a></li>
			<li id=MASliJDRstable ><a href="../../../stable/${ versionStable }/covid-19-viz3d-jdr/jdr-daily-reports.html" title="" >
				JHU Daily Reports G+USA</a></li>
			<li  id=MASliWPstable><a href="../../../stable/${ versionStable }/covid-19-viz3d-wp/wp-wikipedia.html" title="" >Wikipedia Global</a></li>
		</ul>
		<h4 title="Curious things may happen here" style=Margin:0; >Under construction 'Beta' versions</h4>
		<ul style="margin:0 0 1ch 0;padding:0 2ch;" >
			<li id=MASliJTSdev ><a href="../../../dev/${ versionDev }/covid-19-viz3d-jts/jts-time-series.html" title="" >
				JHU Time Series Global<a></li>
			<li id=MASliJDRdev><a href="../../../dev/${ versionDev }/covid-19-viz3d-jdr/jdr-daily-reports.html" title="" >
				JHU Daily Reports G+USA</a></li>
			<li id=MASliWPdev><a href="../../../dev/${ versionDev }/covid-19-viz3d-wp/wp-wikipedia.html" title="" >Wikipedia Global</a></li>
		</ul>
	</div>`;

	MASdivMenuAppSwitch.innerHTML = htm;

};



MAS.getMenuAppSwitch();
