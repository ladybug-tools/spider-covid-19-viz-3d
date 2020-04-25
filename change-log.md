# Change Log

### 2020-04-25

* This change log moved from README.md


### 2020-04-25 ~ Theo

* * 2020-04-15 ~ Theo ~  Ability to add more buttons and links to pop-up

### 2020-04-22

Wish list items dealt with

* Improve Wikipedia workflow
* States to global map
* Rescale bars
* 2020-04-06 ~ Theo ~ Select scale linear or scale logarithmically


### 2020-04-18


Wish list items dealt with

* 2020-04-15 ~ Way of testing that pop-up links are working << see sandbox/test-c19-wp-links

### 2020-04-15

Wish list items dealt with

* 2020-04-15 ~ Case data chart: on open > scroll to bottom
* 2020-04-15 ~ Place data chart: on open > scroll to top

### 2020-04-14

Wish list items dealt with

* 2020-03-30 ~ Theo ~ Multiple charts per pop-up
* Dark mode

### 2020-04-13

Wish list items dealt with

* 2020-04-13 ~ Theo ~ JavaScript file for each country and region
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