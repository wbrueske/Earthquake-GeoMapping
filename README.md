# Earthquake-GeoMapping
Interactive map of recent earthquakes.
See it in action at https://wbrueske.github.io/Earthquake-GeoMapping/

The USGS has JSON data for recent earthquakes updated in real-time available at https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php.  This script taps into their 7-day feed to plot the recent earthquakes on a global map with Leaflet.js.  Marker size and color indicate magnitude.  The markers can also be clicked to show detailed information about the time and location of the earthquake.

A tectonic plate boundary layer is also included, which was made from GeoJSON data from Hugo Ahlenius (https://github.com/fraxen).
