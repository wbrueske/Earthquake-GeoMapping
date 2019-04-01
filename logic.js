// Function to determing what color to use for the quake maker
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
// Earthquake JSON
// ==================================================
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(err, data) {
  // console.log(data);

  quakeMarkers = []

  data.features.forEach(d => {    
    quakeMarkers.push(
        L.circle([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
        stroke: true,
        weight: .25,
        fillOpacity: .75,
        color: "black",
        fillColor: markerColor(d.properties.mag),
        radius: d.properties.mag * 30000
      }).bindPopup(`<p><b>Location:</b> ${d.properties.place}</p>
                    <p><b>Magnitude:</b> ${d.properties.mag}</p>
                    <p><b>Time:</b> ${convertTime(d.properties.time)}`)
    );

  });

  var quakeLayer = L.layerGroup(quakeMarkers);


  // ==================================================
  // Tectonic Plate Boundaries
  // ==================================================
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function(err, plateData) {
    var tectonicLayer = L.geoJSON(plateData, {style: {color: "orange", weight: 2}});


    // The rest of this code is nested in the Tectonic Plate JSON in order to add the tectonic plate
    // boundaries as a toggle-able layer.
    var overlayMaps = {
      "Earthquakes": quakeLayer,
      "Tectonic Plates": tectonicLayer
    };

    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 4,
      layers: [light, quakeLayer, tectonicLayer]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend leaflet-control-layers'),
          magnitudes = [0, 1, 2, 3, 4, 5, 6, 7, 8],
          labels = [];

      div.innerHTML = `<h4>Magnitude</h4>`
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' +
              magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(myMap);

  });
});


// Create base layers

// light map tiles
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: "pk.eyJ1Ijoid2JydWVza2UiLCJhIjoiY2p0Ym1jbHR3MG43azN5cDRud3NrajY4aSJ9.MY-Vm852vmNh92n0letPAw"
});

// dark map tiles
var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: "pk.eyJ1Ijoid2JydWVza2UiLCJhIjoiY2p0Ym1jbHR3MG43azN5cDRud3NrajY4aSJ9.MY-Vm852vmNh92n0letPAw"
});

// satellite map tiles
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: "pk.eyJ1Ijoid2JydWVza2UiLCJhIjoiY2p0Ym1jbHR3MG43azN5cDRud3NrajY4aSJ9.MY-Vm852vmNh92n0letPAw"
});

// baseMaps group
var baseMaps = {
  Light: light,
  Dark: dark,
  Satellite: satellite
};
