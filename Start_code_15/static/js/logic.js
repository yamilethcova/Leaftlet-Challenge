let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

let UsaCoords = [37.0902, -95.7129];
let mapZoomLevel = 5;

let myMap = L.map("map", {
  center: UsaCoords,
  zoom: mapZoomLevel,
  layers: [street],
});

let baseMaps = {
  "Street Map": street,
};

let legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "legend");
  let colors = [
    "#00ff00",
    "#7fff00",
    "#ffff00",
    "#ff7f00",
    "#ff0000",
    "#8b0000",
  ];
  let labels = [
    "0-10 km",
    "10-30 km",
    "30-50 km",
    "50-70 km",
    "70-90 km",
    "90+ km",
  ];

  for (let i = 0; i < colors.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      colors[i] +
      '"></i> ' +
      labels[i] +
      "<br>";
  }
  return div;
};

legend.addTo(myMap);

d3.json(url).then((response) => {
  let earthquakeFeatures = response.features;

  let earthquakesMarkers = [];

  for (let i = 0; i < earthquakeFeatures.length; i++) {
    let feature = earthquakeFeatures[i];
    let coords = feature.geometry.coordinates;
    let latlong = { lng: coords[0], lat: coords[1] };
    let depth = coords[2];
    let magnitude = feature.properties.mag;

    let markerSize = magnitude * 4;
    let markerColor = depthColor(depth);

    let circleMarker = L.circleMarker(latlong, {
      radius: markerSize,
      fillColor: markerColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
    });

    circleMarker.bindTooltip(
      `Location: ${latlong.lat}, ${latlong.lng}<br>Magnitude: ${magnitude}<br>Depth: ${depth}`
    ).openTooltip();

    earthquakesMarkers.push(circleMarker);
  }

  let earthquakesLayer = L.layerGroup(earthquakesMarkers);

  let overlayMaps = {
    Earthquakes: earthquakesLayer,
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
  }).addTo(myMap);
});

function depthColor(depth) {
  if (depth < 10) {
    return "#00ff00"; // 0-10 km
  } else if (depth < 30) {
    return "#7fff00"; // 10-30 km
  } else if (depth < 50) {
    return "#ffff00"; // 30-50 km
  } else if (depth < 70) {
    return "#ff7f00"; // 50-70 km
  } else if (depth < 90) {
    return "#ff0000"; // 70-90 km
  } else {
    return "#8b0000"; // 90+ km
  }
};



















        

  


  

    
    
