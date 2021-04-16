// Map object centered at Buena Vista park
var myMap = L.map("map", {
    center: [37.7686550338169, -122.4408238032053],
    zoom: 8
});

  //Dark Mapbox background
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(geoData, function (data) {

function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.69
    };
    }

function getColor(magnitude) {
    switch (true) {
        case magnitude > 5:
            return "#ff0000";
        case magnitude > 4:
            return "#ff7300";
        case magnitude > 3:
            return "#fbff00";
        case magnitude > 2:
            return "#eecc00";
        case magnitude > 1:
            return "#d4ee00";
        default:
            return "#a3ff00";
    }
    }

function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }

      return magnitude * 5;
    }


    L.geoJson(data, {
    pointToLayer: function (feature, latlong) {
        return L.circleMarker(latlong);
    },

    style: styleInfo,


    onEachFeature: function (feature, layer) {

        layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Location:<br>" + feature.properties.place);
    }
    }).addTo(myMap);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5];
        div.innerHTML = 'Eathquake<br>Magnitude<br><hr>'

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };
    legend.addTo(myMap);
});