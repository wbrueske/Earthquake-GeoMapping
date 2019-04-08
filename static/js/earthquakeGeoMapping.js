// ==================================================
// Recent Earthquake GeoMapping
// ==================================================
// Author: Will Brueske
// Contact: wbrueske@live.com
// ==================================================
// This script utilizes Earthquake GeoJSON from the 
// USGS and tectonic plate boundary GeoJSON from 
// Hugo Ahlenius (github.com/frazen) to plot recent
// earthquakes around the globe with Leaflet.js and
// Mapbox.
// ==================================================
// **************************************************

// ==================================================
// Functions
// ==================================================
// Function to determine what color to use for the quake markers
function markerColor(quakeMag) {
  return quakeMag > 8 ? "#7f2704" :
         quakeMag > 7 ? "#a63603" :
         quakeMag > 6 ? "#d94801" :
         quakeMag > 5 ? "#f16913" :
         quakeMag > 4 ? "#fd8d3c" :
         quakeMag > 3 ? "#fdae6b" :
         quakeMag > 2 ? "#fdd0a2" :
         quakeMag > 1 ? "#fee6ce" :
                        "#fff5eb";
}

// Function to convert unix timestampt to something readable
function convertTime(time) {
  var timestamp = new Date(time);
  return timestamp.toUTCString();
}

// ==================================================
// Map Definitions
// ==================================================
// Light map tiles
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: "pk.eyJ1Ijoid2JydWVza2UiLCJhIjoiY2p0Ym1jbHR3MG43azN5cDRud3NrajY4aSJ9.MY-Vm852vmNh92n0letPAw"
});

// Satellite map tiles
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: "pk.eyJ1Ijoid2JydWVza2UiLCJhIjoiY2p0Ym1jbHR3MG43azN5cDRud3NrajY4aSJ9.MY-Vm852vmNh92n0letPAw"
});

// baseMaps group
var baseMaps = {
  Light: light,
  Satellite: satellite
};

// Earthquake and tectonic layers
var quakeLayer = L.layerGroup();
var tectonicLayer = L.layerGroup();

// earthquakeOverlays group
var earthquakeOverlays = {
  "Earthquakes": quakeLayer,
  "Tectonic Plates": tectonicLayer
};

// Map definition & default layers
var earthqaukesMap = L.map("earthquake-map", {
  center: [38.9, -97.5],
  zoom: 4,
  layers: [light, quakeLayer, tectonicLayer]
});

// Layer controls
L.control.layers(baseMaps, earthquakeOverlays).addTo(earthqaukesMap);

// Legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  // Added in the "leaflet-control-layers" as a class to snag the same CSS  
  var div = L.DomUtil.create('div', 'info legend leaflet-control-layers'),
      magnitudes = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  div.innerHTML = `<h4>Magnitude</h4>`
  // Loops through magnitude intervals and generates a label with a colored square for each interval
  for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
          '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' +
          magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(earthqaukesMap);

// ==================================================
// Earthquake GeoJSON
// ==================================================
// D3 is used to read the online GeoJSON from USGS.  L.geoJSON is then used to plot the earthquakes.
// Unfortunately Leaflet can't read GeoJSON unless it's defined as a variable in th external source,
// which means I had to use either D3 or jQuery to define it.  We've been using different versions of
// D3 lately, so I opted for that since there was a syntax change between versions.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  L.geoJSON(data.features, {pointToLayer: function(quake, latlng) {
    // console.log(quake);
    // L.circleMarker is another option, but I personally don't like how the marker size
    // is fixed and IS NOT relative to the map size.  That makes the markers really confusing
    // when zooming in and out of the map.  The fixed size of L.circleMarker could be useful
    // for fewer and/or less-dense point data, but not for 2000+ earthquakes.
    return L.circle(latlng, {
      stroke: true,
      weight: .35,
      fillOpacity: .75,
      color: "black",
      fillColor: markerColor(quake.properties.mag),
      radius: quake.properties.mag * 30000
    }).bindPopup(`<p><b>Location:</b> ${quake.properties.place}</p>
                  <p><b>Magnitude:</b> ${quake.properties.mag}</p>
                  <p><b>Time:</b> ${convertTime(quake.properties.time)}`);
  }}).addTo(quakeLayer);
})

// ==================================================
// Tectonic Plates GeoJSON
// ==================================================
// Another D3 to L.geoJSON
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plateBoundaries) {
  L.geoJSON(plateBoundaries, {style: {color: "darkorange", weight: 2}}).addTo(tectonicLayer);
});
