<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://ladybug.tools/spider-covid-19-viz-3d/readme.html#cookbook/globe-template//README.md "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick=window.location.href="https://github.com/ladybug-tools/spider-covid-19-viz-3d/tree/master/cookbook/globe-template/";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# [Globe Template Read Me]( https://www.ladybug.tools/spider-covid-19-viz-3d/readme.html#cookbook/globe-template/README.md )


<iframe src=https://www.ladybug.tools/spider-covid-19-viz-3d/readme.html#cookbook/globe-template/ width=100% height=500px >Iframes are not viewable in GitHub source code view</iframe>
_globe-temp.html_

### Full Screen: [Globe Template]( https://www.ladybug.tools/spider-covid-19-viz-3d/readme.html#cookbook/globe-template/ )


<details open >
<summary>Concept</summary>


An online interactive 3D Globe designed to be forked, hacked and remixed

## Features

### User Experience

- Instantly recognizable content format
  - The Earth as a globe
  - Starts with Globe spinning
  - Informs that you are in an interactive 3D world
- Designed for speed
  - Useful content in under two seconds
  - Acceptable performance even on low end devices
  - Data for each marker is accessible in real-time
- Data files supplied via the Glitch CDN
  - Speedy delivery to anywhere in the world
- Interact on phone, table or computer
  - Rotate and zoom
  - Resizes on change in device orientation
  - "Dampened" spin add nice feel
- Mirrored double-sided 3D text
  - "Inworld" text makes for engaging experience
  - Reads nicely which ever side you look at
- Display pop-up text and image data at cursor location
  - Pop-up data is selectable
  - May include links, image and charts
  - Little or no lag in the display
- Point light attached to camera
  - Highlights the elements currently in the center of your screen
- Elevations slider adds a "But wait, there's more!" feature
  - More possibilities than just an image on a sphere
- Heat-warming Easter egg



### User Interface

- Collapsible menu
- Click title to reload to page
- Links to source could on Glitch and GitHub
- Pop-up heads-up info box
- Footer buttons for easy user interaction on mobile


### Content Delivery

- Gazetteer for 199 countries and 147 states, regions or provinces
- View globe as sphere with bitmap or as 3D terrain
  - Slider to adjust the height of the terrain
- Use a variety of bitmap overlays to map to the globe
- Use a bitmap to generate the 3D elevations on the globe
  - Fast simple way to provide the data
- Access and display GeoJSON data
- Access and display useful performance statistics

### Developer Experience

- Running on GitHub pages, Glitch, embedded Glitch: Soon: Mozilla: Hubs
- 600 lines "prettified" plain vanilla JavaScript
- Single dependency: Three.js
- Very simple style sheet
- Runs locally or on server
- No compiling necessary
- Functions organized in simple namespaces
- Adds and removes events with care
  - Starts and stops screen rotation at start-up
  - Handles ray-casting and pop-up display management
- GeoJson reader: loads files and creates fast & effient BufferGeometry
- Markers are kept in an IndexedMesh
- 60 FPS / few draw calls
- Three files only: html, css and JavaScript

### Utility function

- Access Stat.js and Renderer.info
- Globe switching
- Screen to create a video built in
  - Globe switching
- Screen capture to WebM video-
- Ajax
- Latitude and longitude to XYZ
- Matrix compose position, scale and rotation
- Load Three.js 3D fonts


</details>

<details open >
<summary>To do and wish list </summary>
- Document SSC
- Shaders
- Zoom levels with levels of detail
- Sky boxes and backgrounds

- Stats on right

</details>

<details open >
<summary>Issues </summary>


</details>

<details open >
<summary>Links of interest</summary>



Globes

- https://github.com/vasturiano/three-globe
- https://github.com/vasturiano/globe.gl
- https://globe.chromeexperiments.com/
- https://timcchang.com/threejs-globe
- https://giojs.org/


Source of bitmaps used on globe

- https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets


Map Tile Server lists

- https://www.trailnotes.org/FetchMap/TileServeSource.html
- http://geo.inge.org.uk/gme_maps.htm
- https://wiki.openstreetmap.org/wiki/Tile_servers


geoJson

- https://datahub.io/collections/geojson
- https://github.com/nvkelso/natural-earth-vector
- https://github.com/maptime-ams/geojson-3d
- https://github.com/jdomingu/ThreeGeoJSON
- https://stackoverflow.com/questions/40520463/how-can-i-draw-geojson-in-three-js-as-a-mesh-and-not-a-line-and-fill-with-color
- https://bl.ocks.org/marcopompili/f5e071ce646c5cf3d600828ace734ce7


geoJson useful

- ne_110m_admin_0_countries_lakes.geoJson
- ne_110m_admin_1_states_provinces_lines.geoJson
- https://github.com/longwosion/geojson-map-china
- https://github.com/waylau/svg-china-map


</details>

<details open >
<summary>Change log </summary>

#### 2020-05-10 ~ Theo

- Archive files and rename folders to calendar versioning
- Update readme


### 2020-05-07

- First commit this read me
- ren from globe basic to globe template
- Clean up add remove events
- Hide pop-up on mouse click


</details>

***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src="../../assets/spider.ico" height=24 > </a></center>
