
# deployment checklist


## "Pre-flight" check

* fetch what you have
* dev/v-2020-xx-xx/js/main.js > Check vars for suitability
* dev/v-2020-xx-xx/covid-19-viz3d-jts/jys-time-series.html
	* Line 170 un-commented:
	// keeps address bar pointed to latest dev.
	window.history.pushState( "", "", "/spider-covid-19-viz-3d/dev/" );

If OK on Git

* dev/v-2020-xx-xx/ > copy folder to dev/v-2020-xx-xx+1/
* main.js > update dates and time
* Clean up and re-date readme
* delete deprecated files
* Archive what needs archiving

## New dev first push

* Push dev folder only - and check things out online
	* Create a VS Code workspace just for the dev folder
	* makes it easy to push just dev
* Commit message: 2020-xx-xx+ 1 dev first commit
* Test by using:
	*  https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-XX-XX/covid-19-viz3d-jts/jts-time-series.html
	* https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-04-06/covid-19-viz3d-jts/jts-time-series.html

## New dev second push

* Edit ```dev/index.html``` so it links to today's calver folder: dev/v-2020-xx-xx+1/

When OK

* Commit message: 2020-xx-xx+ 1 dev second commit update index.html


## Second check

* dev/v-2020-xx-xx/ > copy folder to stable/v-2020-xx-xx/
* stable/v-2020-xx-xx/js/main.ls
	* un-comment: ```let build = "stable";``` and comment ```let build = "dev";```
* stable/v-2020-xx-xx/js/main.ls > update timeStamp and other date dependent vars
		* Check push state:
	window.history.pushState( "", "", "/spider-covid-19-viz-3d/" );


## New stable first push

* Commit message: 2020-xx-xx+1 dev to stable first commit
* Test by using:
	*  https://www.ladybug.tools/spider-covid-19-viz-3d/stable/v-2020-XX-XX/covid-19-viz3d-jts/jts-time-series.html


## New stable second push

When OK

* Commit message: 2020-xx-xx+1 dev to stable update index.html

"Landing" check


* Commit message: 2020-XX-XX dev clean up
