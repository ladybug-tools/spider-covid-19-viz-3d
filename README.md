<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/readme.html "View file as a web page." ) </span>

<div><input type=button onclick=window.location.href="https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# [covid 19 viz 3d Read Me]( #README.md )


<iframe src=https://ladybug-tools.github.io/spider-covid-19-viz-3d/ width=100% height=500px >Iframes are not viewable in GitHub source code view</iframe>
_covid 19 viz 3d - touch me!_

### Full Screen stable: [covid 19 viz 3d]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/ )

### Full Screen latest: [covid 19 viz 3d/dev ]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/dev/ )


<details open >
<summary>Concept</summary>

The concept of the web page is to show you the current COVID-19 situation around the entire world in 3 seconds or less.

* View the latest COVID-19 data from John Hopkins University [GitHub repository]( https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data ) with interactive 3D
* Provide entry-level programming code anybody can copy and make better
* Display all the data in seconds on any device then zoom and rotate and click to see the cases in 3D

Mentions

* https://www.reddit.com/r/COVID19/comments/fkjby9/view_the_latest_covid19_numbers_from_around_the/

</details>

<details open >
<summary>To do and wish list </summary>

* Country or state flag?
* Globe rotates to the lat/lon indicated by your browser location
* Placards over each bar showing country & cases
* Show global stats when not on mobile
* Days since last new case as color or opacity
* Community transmission vs traveller
* a growing percentage affected per day of each country's population rather than cases detected if we're separating it out by country.



</details>

<details open >
<summary>Issues </summary>


</details>

<details open >
<summary> Things you can do using this script</summary>

* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
* Click the GitHub Octocat icon to view or edit the source code on GitHub
* Click on title to reload te page
* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors

</details>

<details open >
<summary>Credits and Links of interest</summary>

Data sources

* https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data
* https://opendata.arcgis.com/datasets/bbb2e4f589ba40d692fab712ae37b9ac_1.csv

Dependencies

* https://threejs.org
* https://github.com/jdomingu/ThreeGeoJSON


Other 3D visualizations of the COVID-19 data

* https://coronation.xyz/
* https://earth3dmap.com/coronavirus-interactive-global-map/
* https://covid19.martinpham.com/

Globes

* https://github.com/vasturiano/three-globe
* https://github.com/vasturiano/globe.gl



Source of maps used on globe

* https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets

TopoJson

* https://www.npmjs.com/package/world-atlas
* https://observablehq.com/@mbostock/geojson-in-three-js

geoJson

* https://github.com/nvkelso/natural-earth-vector
* https://github.com/maptime-ams/geojson-3d
* https://github.com/jdomingu/ThreeGeoJSON
* https://stackoverflow.com/questions/40520463/how-can-i-draw-geojson-in-three-js-as-a-mesh-and-not-a-line-and-fill-with-color
* https://bl.ocks.org/marcopompili/f5e071ce646c5cf3d600828ace734ce7


</details>

<details open >
<summary>Change log </summary>

### 2020-03-18 ~ Theo

* Update meta tag and ?? popup text
* Remove Virgin Islands correction - no longer needed
* Global stats displays on start up
* deaths/cases % added to globals stats and to pop-ups
* Add spread to black bars
* Add new cases at top of bar
* 16-57 menu items reordered
* 17-17 ignores NAN is global cases summing

Done

* Mortality rate: deaths divided by confirmed cases > show as increased radius of black cylinder

### 2020-03-17 ~ Theo

Done

* Map showing country boundaries

### 2020-03-16 ~ Theo

* Added death and recovery bars
* Bar colors now red, black, green

Done

* Indicators divided into cases, deaths & recovered

### 2020-03-15

* First commit

</details>

***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > ❦ </a></center>
