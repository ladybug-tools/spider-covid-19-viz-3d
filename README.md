<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/readme.html "View file as a web page." ) </span>

<div><input type=button onclick=window.location.href="https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# [COVID-19 Viz3D Read Me]( #README.md )

<iframe src=https://ladybug-tools.github.io/spider-covid-19-viz-3d/ width=100% height=500px >Iframes are not viewable in GitHub source code view</iframe>
_covid 19 viz 3d - touch me!_

## Full Screen stable: [covid 19 viz3d]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/ )

### Full Screen latest: [covid 19 viz3d/dev ]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/dev/ )

### [Cookbook]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/cookbook )

* Demos of the various modules used to build the viewer

### [Archive Gallery 2]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/dev/covid-19-viz-3d-archive )

* Files for every daily project update since 200-03-19. Some files are better than others.

### [Archive Gallery 1]( https://ladybug-tools.github.io/spider-covid-19-viz-3d/dev/covid-19-statistics-on-globe )

* Files from the first day of the project


<details open >
<summary>Concept</summary>

The concept of the web page is to show you the current COVID-19 situation around the entire world in 3 seconds or less.

* View the latest COVID-19 data from John Hopkins University [GitHub repository]( https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data ) with interactive 3D
* Provide entry-level programming code - plain-vanilla JavaScript - anybody can copy and make better
* Display all the data in seconds on any device then zoom and rotate and click to see the cases in 3D

The general idea is

* You want to access the latest global data
* You want to access the latest data for where you live
* You want to access "an expression of hope" even if the data is nasty

Mentions

* https://twitter.com/electricdisk/status/1240735764071288837
* https://discourse.ladybug.tools/t/spider-covid-19-viz-3d-web-page-updated-2020-03-17/8697/2
* https://www.reddit.com/r/COVID19/comments/fkjby9/view_the_latest_covid19_numbers_from_around_the/
* https://discourse.threejs.org/t/covid-19-viz-3d-interactive-3d-globe/13613/8

## Influences on the features

### [Issue #5 Expressions of hope]( https://github.com/ladybug-tools/spider-covid-19-viz-3d/issues/5 )

> @loleg I'm not sure how best to describe this, but what I wish for in an interactive viz like this, is the ability to discover what's hot and happening "out there". For example, the home page of gitter.im has more or less live messages from around the world. I wonder if we could show positive tweets and expressions of hope and gratitude for the courage of health workers around the world.


Sky Box as an "Expression of Hope"

* Zoom out then rotate. Trying to read the messages is a little guessing game.
* The text is huge and leaves much white space. This is so you are not totally distracted while looking at the data.

Messages of hope to add

* “Do what you can, where you are, with what you have.”

### Burning Man / Wild Wild West / Fair

Most of the time I try to create very simple, clean user experiences. Think Google's Material Design and Apple. I generally build tech stuff for techies.

But this is different. We want oldsters and children, tech and non-techies involved. We are seeing thus with painting abd drawing - a move from abstract to figurative, from minimal to pop-surreal.

The idea is to re-imagine the "chart", to turn the representation of quantities into more than mere the calligraphic scrawls we call "numbers".


### Love and Hate with the Earth as a globe

Some of the great things about the globe is that yoo know what to do with it. You can spin it, You know the top and bottom bits are kind of boring and not much happens there. You know where you live.

On the other hand, the Pacific Ocean takes half the space and there's nothing there eithr. And whenever ther places of interest there tend to be a ton of then and it's very difficult to attach a sign to one place without covering up the next place.




</details>

<details open >
<summary>To do and wish list </summary>


### Generally / Short term

* 2020-04-06 ~ Theo ~ Current settings save in local storage
	* Globe rotates to the lat/lon onload as set and saved in localStorage
	* Multiple locations & zoom levels
	* Scaled or linear heights
* 2020-04-06 ~ Theo ~ Select scale linear or scale logarithmically
* 2020-03-30 ~ Theo ~ Multiple charts per pop-up
* Location hash goes to place and set language and other aspects
* Days since last new case indicated as color or opacity
* Dark mode?


### Medium Term

* Translations with workflow for producing translations
* Better geoJson parser JavaScript function

Vision of the future

* New organization?
* Separate timeline pages
* web pages for counties/provinces
* Add sound/music? During mouseover and at mouse click or data update
* Refresh data every few minutes
* Add "expressions of hope" such as positive tweets - in language?
* Sun path? Mountains? Flamingos and dolphins?
* Themes? Mid-century modern, Burner, pixelated
* Rotation + zoom - 3D Lissajous path
* Show some item of interest at the top of each indicator
	* As in all classical columns have a capital
	* Country or state flag?
	* Placards over each bar showing country & cases?
* Community transmission vs traveller transmission
	* Data in WHO PDF file hard to parse
* a growing percentage affected per day of each country's population rather than cases detected if we're separating it out by country.
* Set limits so cannot go too far north or south


>> new cases in the past day.
> divided by the new cases the previous day. More cases is interesting, but far more interesting (to me, anyway) is that if it's increasing.
> I'd suggest the derivative of the above as well, as I'd like to know if the rate of growth is increasing or decreasing, but I might be the only one that would find that interesting.


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

* https://github.com/ulklc/covid19-timeseries
* https://coronadatascraper.com/#timeseries.csv
* https://github.com/datasets/covid-19/tree/master/data  ~ daily ?
* https://datahub.io/core/covid-19
* https://covidtracking.com/api/
* https://covidtracking.com/data/
* https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data
* https://github.com/M-Media-Group/Covid-19-API
	* https://opendata.arcgis.com/datasets/bbb2e4f589ba40d692fab712ae37b9ac_1.csv
	* https://mmediagroup.fr/covid-19
* https://nssac.bii.virginia.edu/covid-19/dashboard/
* http://globalcovid19.live/index.php/148-2/ ~ many interesting stats

Compare sources

* https://vitals.lifehacker.com/look-up-your-states-covid-19-test-results-with-this-tra-1842475525
* https://blog.datawrapper.de/coronaviruscharts/
* https://www.visualcapitalist.com/7-best-covid-19-resources/
* https://www.lewuathe.com/open-dataset-for-covid-19.html
* https://covid19dashboards.com/
* https://jarv.is/notes/coronavirus-open-source/
* https://ourworldindata.org/covid-sources-comparison

About Covid

* https://xapix-io.github.io/covid-data/
* https://covidnearyou.org/#!/

Map Tile Server lists

* https://www.trailnotes.org/FetchMap/TileServeSource.html
* http://geo.inge.org.uk/gme_maps.htm
* https://wiki.openstreetmap.org/wiki/Tile_servers

Dependencies

* https://threejs.org
* https://github.com/jdomingu/ThreeGeoJSON



Trackers

* https://towardsdatascience.com/top-5-r-resources-on-covid-19-coronavirus-1d4c8df6d85f

Other 3D visualizations of the COVID-19 data

* https://icao.maps.arcgis.com/apps/webappviewer3d/index.html?id=d9d3f8fa9a23425c8f0889baab626186
* https://earth3dmap.com/coronavirus-interactive-global-map/
* https://coronation.xyz/
* https://covid19.martinpham.com/



Geolocation

* https://www.w3schools.com/html/html5_geolocation.asp
* https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API


Globes

* https://github.com/vasturiano/three-globe
* https://github.com/vasturiano/globe.gl


Source of bitmaps used on globe

* https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets

TopoJson

* https://www.npmjs.com/package/world-atlas
* https://observablehq.com/@mbostock/geojson-in-three-js

geoJson

* https://datahub.io/collections/geojson
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

_Change logs are now in the de/dates/ folders._

### 2020-04-13

Wish list items dealt with

* 2020-04-06 ~ Theo ~ In-world text as Three.js "SimpleText"
* 2020-04-06 ~ Theo ~ Bars as "little crowns" - flared
* 2020-03-24 ~ Theo ~ use Three.js fonts??
* Better display of text in placards??
* 2020-04-02 ~ Theo ~ Merge data from JHU and Wiki
	* Data from CSVs to arrays of objects as opposed to arrays of strings as is current
	
### 2020-04-04

Wish list items dealt with

* 2020-04-02 ~ Theo ~ Wikipedia charts appear in pop-up no click necessary
* 2020-04-02 ~ Theo ~ Mouse click AND mouse over

### 2020-04-02 ~ Theo

Wish list items dealt with

* 2020-03-30 ~ Theo ~ Drag and resize pop-up
* 2020-03-30 ~ Theo ~ Better maps for globe

### 2020-03-28 ~ Theo

covid-19-viz-3d v-2020-03-28-12-40-dev

* Bars now scaled linearly
* "New cases today" appear on ground
* Update splash screen

covid-19-viz-3d-jhu-daily.html

* Fix display of stats in left menu
* Add use GH API to get name of latest file in JHU folder


### 2020-03-28 ~ Theo

v-2020-03-27-09-53

* Four charts to stable

### 2020-03-26 ~ Theo

v-v-2020-03-26-11-36

* Add back recoveries data button, bars and stats


### 2020-03-25 ~ Theo

v-2020-03-25

* Fix bars not showing up on load?
* Cleaned up getStats()
* Add select country and province
* Start hacking or reborn recoveries data
* Cleanup pop-up


### 2020-03-24 ~ Theo

v-2020-03-24

* Emergency repairs after JHU database format change

v-2020-03-24-18-04

* Switch to https://raw.githubusercontent.com to get latest
* dev and stable


### 2020-03-23 ~ Theo

version: 2020-03-23

* main.js > path to pathDataJhu
* html > add class to legend buttons
* Cleanup addIndicator() a lot
	* In response to [Why do the death "black sleeves" look far bigger than the actual numbers suggest?]( https://www.reddit.com/r/COVID19/comments/fkjby9/view_the_latest_covid19_numbers_from_around_the/fkzo1nk )
* Cleanup addIndicatorNew a little
* Stop rotation Add THR.onStop()
* html > add class to footer buttons
* Make placards opaque - improves fps and image quality slightly
* Change pop-up display from mouseover to mousedown
	* computer matches phone / touch behavior
	* enables you to see date and count of new cases bars in popup
* pop-up display set fro renderer.domElement instead of document
	* enables interaction with pop-up
* Drop buttons from notes and settings
* Change to MMG data? Add mmg credit to Info
* Pop-ups many fixes
* Splash screen > update text

v-2020-03-23-16-00

* stop console.log
* pop-up: cases/(gdp/pop)

stable v-2020-03-23-18-15

* Move init & assets path to html



Done

From Reddit

> Why do the death "black sleeves" look far bigger than the actual numbers suggest?

My answer
The actual reason is that - currently - the heights are scaled via a square root of the number in question. This means bigger numbers are drawn much smaller than they really are.

If this were a 2D chart -it would be easy to have gridlines and legends that indicated the scaling, but this is not so easy to show in 3D,

And therefore - as your sharp eyes have pointed out - the indicated relations between cases and deaths appear to be wacky. My bad.

I think a better idea might be to calculate the height of the cases and then calculate the height of the deaths as: casesHeight * deathCount / casesCount



### 2020-03-22 ~ Theo

version: 2020-03-22-13-09

* Add separate groups for each case type
* convert legend to buttons
* Add global stats to buttons
* Move MMG data to pop-up
* Update dev index

v-2020-03-22-15-15

* Add content to Notes & Settings ontoggle
* Add THR.drawPlacard()
* Add global stats in-world

v-2020-03-22-18-30

* Add details to main menu
* Add back global statistics to left menu
* Add footer with buttons

Done

* Toggle view of new, deaths etc
* only show new cases and hide the other stats?
* Add text to speech commentary
* Global statistics displayed in-world


### 2020-03-21 ~ Theo

COVID-19 New Cases by Date

* First commit


### 2020-03-20 ~ Theo

v-2020-03-20-13-30

* Split style to style.css
* Spilt JavaScript to main.css
* Split three.js functions to thr-thee.js
* Remove geoJson popup data
* Make Null Island a better test case
* Pop-up: not show places if empty string
* Global stats: add Europe and rest of world
* Add resume autoRotate

Done

* Restart rotation - after a period of no-interaction

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
