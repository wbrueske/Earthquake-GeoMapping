# Earthquake GeoMapping

Interative map of recent earthquakes.

See the deployed app at https://wbrueske.github.io/Earthquake-GeoMapping/

![alt-text](https://raw.githubusercontent.com/wbrueske/Earthquake-GeoMapping/master/screenshots/earthquakes.png "Screenshot")
-
## How it Works
The US Geological Survey (USGS) has GeoJSON data for recent earthquakes updated in real-time.  This app uses D3.js to tap into the USGS 7-day feed and then plot the recent earthquakes on a global map with Leaflet.js.

Marker size and color indicate magnitude. The markers can also be clicked to bring up a tooltip that shows detailed information about the time and location of the earthquake.

![alt-text](https://raw.githubusercontent.com/wbrueske/Earthquake-GeoMapping/master/screenshots/tooltip.png "Tooltip screenshot")

A tectonic plate boundary layer is also included, which was made from GeoJSON data from Hugo Ahlenius (https://github.com/fraxen).

## Languages & Libraries Used
 - JavaScript
 - D3.js
 - Leaflet.js
 - Mapbox
 - OpenStreetMap
 - HTML
 - CSS
 - Bootstrap
