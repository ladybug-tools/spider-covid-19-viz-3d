
# deployment checklist


* Check that dev/index.html links to today's calver folder
* dev/v-2020-xx-xx/js/main.js > Check vars for suitability
* dev/v-2020-xx-xx/covid-19-viz3d-jts/jys-time-series.html
	* Line 170 un-commented:
	// keeps address bar pointed to latest dev. can comment out while developing locally to stop annoying message
	window.history.pushState( "", "", "/spider-covid-19-viz-3d/dev/" );
* Push dev folder only - and check things out online
	* Create a VS Code workspace just for the dev folder
	* makes it easy to push just dev
* dev/v-2020-xx-xx/ > copy folder to stable/v-2020-xx-xx/
* dev/v-2020-xx-xx/ > copy folder to dev/v-2020-xx-xx+1/
* stable/v-2020-xx-xx/js/main.ls > un-comment: ```let build = "stable";``` and comment ```let build = "dev";```
* stable/v-2020-xx-xx/js/main.ls > update timeStamp and other date dependent vars
		// keeps address bar pointed to latest dev. can comment out while developing locally to stop annoying message
		window.history.pushState( "", "", "/spider-covid-19-viz-3d/" );