function createMap(earthquakes, tectonicplates) {
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    })

    //Sat Layer
    var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    })

    //Outdoors Layer
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    })

    // map object at Buena Vista
    var myMap = L.map("map", {
        center: [37.7686550338169, -122.4408238032053],
        zoom: 8,
        layers: [darkmap, satmap, outdoors]

    });

    var basemaps = {
        "Satellite Map": satmap,
        "Dark Map": darkmap,
        "Outdoors": outdoors,
    }

    var overlay = {
        "Earthquakes": earthquakes,
        "Fault Lines": tectonicplates,
    }

    L.control.layers(basemaps, overlay).addTo(myMap)



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

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5];

        div.innerHTML += 'Eathquake<br>Magnitude<br><hr>'

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };
    legend.addTo(myMap);
}

var remainingCalls = 2;
var earthquakesLayer = []
var faultlinelLayer = []
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
        weight: 0.5
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

    var earthquakes = new L.LayerGroup()
    L.geoJson(data, {

    pointToLayer: function (feature, latlong) {
        return L.circleMarker(latlong);
    },

    style: styleInfo,
    
    onEachFeature: function (feature, layer) {

    layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Location:<br>" + feature.properties.place);
        }
    }).addTo(earthquakes);

    earthquakesLayer = earthquakes
    --remainingCalls;
    //console.log(`Fetched earthquake data. Remaining calls: ${remainingCalls}`)

    if (remainingCalls === 0) {
    createMap(earthquakesLayer, faultlinelLayer)
    }

});


d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function (data) {

    var faultlines = new L.LayerGroup()

    L.geoJson(data, {
        color: "orange",
        weight: 2,
    }).addTo(faultlines);

    faultlinelLayer = faultlines

    --remainingCalls;
    //console.log(`Fetched faultline data. Remaining calls: ${remainingCalls}`)
    if (remainingCalls === 0) {
        createMap(earthquakesLayer, faultlinelLayer)
    }
});

