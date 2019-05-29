// API key
const API_KEY = "pk.eyJ1IjoibWFubGFyYSIsImEiOiJjamtnd2R3ZW4wbWlwM3FxZ3BoY2JkNm1qIn0.NQ7yhFgYEP0fqdHkT9c6-Q";


let platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
let quakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function createFeatures(quakesData,platesData){

	function onEachFeature(feature, layer){
	layer.bindPopup("<h3>" + feature.properties.place +"</h3><h3>"+
		feature.properties.mag+"</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
	}

	let geojsonMarkerOptions = {
    
	};

	function colorPicker(magnitude){
		if (magnitude<1){
			return "#CEFF00"
		}
		if (magnitude<2){
			return "#FFFF00"
		}
		if (magnitude<3){
			return "#FFD300"
		}
		if (magnitude<4){
			return "#FF9800"
		}
		if (magnitude<5){
			return "#FF6100"
		}
		else{
			return "#FF4B22"
		}
		// "#ff7800"
	}


	const earthquakes = L.geoJson(quakesData,{
    	onEachFeature: onEachFeature,
    	pointToLayer: function (feature, latlng){
    		return L.circleMarker(latlng, {
    			radius: feature.properties.mag * 5,
			    fillColor: colorPicker(feature.properties.mag),
			    color: "#000",
			    weight: 1,
			    opacity: 1,
			    fillOpacity: 1
    		});
    	}
    });

    const faultlines = L.geoJson(platesData);


    createMap(earthquakes,faultlines);
}

function createMap(earthquakes, faultlines){
	// Adding tile layer
	const satstreets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	  maxZoom: 18,
	  id: "mapbox.streets-satellite",
	  accessToken: API_KEY
	});

	const highcontrastmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
	   	id: "mapbox.high-contrast",
	    accessToken: API_KEY
	});

	const outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
	   	id: "mapbox.outdoors",
	    accessToken: API_KEY
	});

	const baseMaps = {
		"Sat Map": satstreets,
		"High Contrast Map": highcontrastmap,
		"Outdoor Map": outdoormap
	};

	const overlayMaps = {
		Earthquakes: earthquakes,
		FaultLines: faultlines
	};

	// Creating map object
	const map = L.map("map", {
	  center: [40.7128, -94.0059],
	  zoom: 3,
	  layers: [satstreets, earthquakes, faultlines]
	});

	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	}).addTo(map);

}

(async function(){
    const platesData = await d3.json(platesUrl);
    // Creating a GeoJSON layer with the retrieved data
    // const faultlines = L.geoJson(platesData).addTo(map);

    const quakesData = await d3.json(quakesUrl);
    // L.geoJson(quakesData,{
    // 	onEachFeature: onEachFeature
    // }).addTo(map);

    createFeatures(quakesData.features,platesData);
})()