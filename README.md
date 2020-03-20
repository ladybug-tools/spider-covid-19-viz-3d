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

### [Issue #5 Expressions of hope]( https://github.com/ladybug-tools/spider-covid-19-viz-3d/issues/5 )

> @loleg I'm not sure how best to describe this, but what I wish for in an interactive viz like this, is the ability to discover what's hot and happening "out there". For example, the home page of gitter.im has more or less live messages from around the world. I wonder if we could show positive tweets and expressions of hope and gratitude for the courage of health workers around the world.

### Generally

* Show some item of interest at the top of each indicator
	* As in all classical columns have a capital
	* Country or state flag?
	* Placards over each bar showing country & cases?
* Globe rotates to the lat/lon indicated by your browser location
* Days since last new case indicated as color or opacity
* Community transmission vs traveller transmission
	* Data in WHO PDF file hard to parse
* a growing percentage affected per day of each country's population rather than cases detected if we're separating it out by country.


Medium Term

* Global statistics displayed in-world
* Translations with workflow for producing translations
* Better geoJson parsee JavaScript function
* Restart rotation + zoom - 3D Lissajous path - after a period of no-interaction

Vision of the future

* new organization?
* separate timeline pages
* web pages for counties/provinces
* Add sound/music? During mouseover and at mouse click or data update
* Add text to speech commentary
* Refresh data every few minutes
* Add "expressions of hope" such as positive tweets?
* Sun path? Mountains? Flamingos and dolphins?

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
* https://nssac.bii.virginia.edu/covid-19/dashboard/


Dependencies

* https://threejs.org
* https://github.com/jdomingu/ThreeGeoJSON


Other 3D visualizations of the COVID-19 data

* https://earth3dmap.com/coronavirus-interactive-global-map/
* https://coronation.xyz/
* https://covid19.martinpham.com/

Globes

* https://github.com/vasturiano/three-globe
* https://github.com/vasturiano/globe.gl


Source of bitmaps used on globe

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


geoJson useful

* ne_110m_admin_0_countries_lakes.geoJson
* ne_110m_admin_1_states_provinces_lines.geoJson
* https://github.com/longwosion/geojson-map-china
* https://github.com/waylau/svg-china-map


</details>


<details open >
<summary>Change log </summary>

### 2020-03-19 ~ Theo

covid-19-viz-3d-2020-03-19-10-29.html

* Add new geoJSON files to maps folder
* Load new geoJSON files
	* Countries, states & China
* Add deaths/population & deaths/gdp to pop-ups
* Show global stats when not on mobile

covid-19-viz-3d-2020-03-19-12-05.html

* Add notes and settings card with details tag
* Change global statistics from button to details
* Add new cases to global statistics
* Update flare to bars new cases

covid-19-viz-3d-2020-03-19-15-01.html

* Add skybox of happiness




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
