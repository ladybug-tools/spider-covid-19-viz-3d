// copyright 2020 Spider contributors. MIT license.
// 2020-04-05
/* global MASdivMenuAppSwitch */


const MAS = {};



MAS.getMenuAppSwitch = function () {

	const htm = `
<details class=navMenuItem open>
	<summary>select chart
	</a><span class="couponcode">&#x24d8;<span id=MASspn class="coupontooltip">
		View pandemic data from three sources in two stages of development.
	</span></span></summary>
	<h4 title="Fewest errors" style="margin:1ch 0 0 0;padding:0;" >Stable versions</h4>
	<ul>
	<li id=MASliWPstable title="Data from charts and tables from over 230 Wikipedia articles">
		<a href="../../../../spider-covid-19-viz-3d/stable/" >
		Wikipedia Global</a></li>
		<li id=MASliJTSstable title="Global daily pandemic data since 2020-01-22" >
			<a href="../../../../spider-covid-19-viz-3d/stable/">
			JHU Time Series Global</a></li>
		<li id=MASliJDRstable title="Global previous day data including USA counties data" >
			<a href="../../../../spider-covid-19-viz-3d/stable/" >
			JHU Daily Reports G+USA</a></li>
	</ul>
	<h4 title="Curious things may happen here" style=Margin:0; >Under construction 'beta' versions</h4>
	<ul>
		<li id=MASliWPdev title="Data from charts and tables from over 230 Wikipedia articles" >
			<a href="../../../../spider-covid-19-viz-3d/dev/"  >
			JHU Wikipedia Remix</a></li>
	</ul>

	<hr>

</details>`;

	MASdivMenuAppSwitch.innerHTML = htm;

};
