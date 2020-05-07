<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-covid-19-viz-3d/cookbook/get-geo-data-global/readme.html "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick=window.location.href="https://github.com/ladybug-tools/spider-covid-19-viz-3d/tree/master/cookbook/get-geo-data-global/";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# [get-geo-data-global Read Me]( https://www.ladybug.tools/spider-covid-19-viz-3d/cookbook/get-geo-data-global/readme.html )

<!--
<iframe src=https://pushme-pullyou.github.io/ width=100% height=500px >Iframes are not viewable in GitHub source code view</iframe>
_basic-html.html_

### Full Screen: [ZZZZZ]( https://www.ladybug.tools/spider-covid-19-viz-3d//xxxxxx/xxxxxx.html )
-->

<details open >
<summary>Concept</summary>


</details>

<details open >
<summary>To do and wish list </summary>

Countries

* Build routine to scrape data from scratch
	* Start with WP pop or Google DSPL?
* Add sub-groups of improtance field?


Regions

* Add Brazil, Russia, Indonesia regions

Counties & Cities

* Consider the 500 cities

</details>

<details open >
<summary>Issues </summary>


</details>

<details open >
<summary>Links of interest</summary>

wikipedia geography

* https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)
	* 233 place, continent, region, population
* https://en.wikipedia.org/wiki/List_of_sovereign_states
* https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population
	* ~ 240 places
* https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory
* https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_United_States



### Google DSPL

* https://github.com/google/dspl/blob/master/samples/google/canonical/countries.csv
	* 245 places identifier, lat & lon
* https://github.com/google/dspl/blob/master/samples/google/canonical/states.csv
	* identifier, lat & lon
* https://github.com/google/dspl/tree/master/samples/bls/unemployment
* https://github.com/google/dspl/blob/master/samples/bls/unemployment/counties.csv
	* counties lat & lon
* https://github.com/google/dspl/blob/master/samples/bls/unemployment/states.csv
	* states lat & lon, identifier, alternate name

### SEDAC

* https://sedac.ciesin.columbia.edu/data/collection/gpw-v4
* https://sedac.ciesin.columbia.edu/data/collection/gpw-v4/maps/services

### simplemaps

* https://simplemaps.com/data/us-cities
* https://simplemaps.com/data/world-cities << 15,000 cities



</details>

<details open >
<summary>Change log </summary>

### 2020-05-06

Done or dealt with

Countries

* 2020-04-19 ~ Add two letter identifiers to countries and regions
	* use these at tops of the sticks

Regions

* Build regional JsonL CSV file
* Add populations
* Add two letter identifiers
* Verify against Wikipedia articles

### 2020-05-03

Keeping two files

* global
* regional

is a good idea

* can load one without the other

CSV is more fun: 10K instead of 25K

### 2020-04-19

Nice steps in building up a good country, region, city workflow

* First commit

</details>

***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src="../../assets/spider.ico" height=24 > </a></center>
