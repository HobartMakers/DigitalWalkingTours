//import r360 from 'route360'
import L from 'leaflet'
import iconFactory from './iconFactory'

const ROUTE_360_API_KEY = '4UH6GBMYTDBEZSXZ6FUWL0E'
const lat_km_per_degree = 110;
const lon_km_per_degree = Math.cos(current_lat * (Math.PI / 180)) * lat_km_per_degree;

function Map(){
  this.placesOfInterest_ = []
  this.iconFactory_ = iconFactory
  this.map = null;
}

function calcDistance(lat_1, lon_1, lat_2, lon_2) {
    var lat_km_diff = (Math.abs(lat_2) - Math.abs(lat_1)) * lat_km_per_degree;
    var lon_km_diff = (Math.abs(lon_2) - Math.abs(lon_1)) * lon_km_per_degree;

    km_diff = Math.sqrt(lat_km_diff**2 + lon_km_diff**2);
    
    return km_diff;
}

// FIXME Completely untested
Map.prototype.findNearest = function(ideal_point, actual_points) {
    var nearest_distance = 9999;
    var nearest = null;

    actual_points.forEach(function(point) {
        var this_distance = calcDistance(ideal_point['lat'], ideal_point['long'], point['lat'], point['long']);

        if (this_disance) < nearest_distance) {
            nearest_distance = this_distance;
            nearest = point;
        }   
    });
    return point;
}

Map.prototype.load = function(container){
  this.map = L.map(container)

  this.map.on('locationerror', (e) => this.onLocationError(e))

  this.map.on('locationfound', (e) => this.onLocationFound(e));
  //map.on('locationerror', that.onLocationError);

  this.map.locate({setView: true, maxZoom: 16,});

  // Load tiles
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(this.map);

  window.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

}

Map.prototype.createRoute = function(container){
    console.log("Creating route");

    // Need current location
    if ("geolocation" in navigator) {
      console.log("geolocation is available");
      navigator.geolocation.getCurrentPosition(function(position) {
        // FIXME - doesn't work yet
        console.log("Latitude: " +position.coords.latitude + " Longitude: " + position.coords.longitude);
      });
    } else {
      console.log("geolocation IS NOT available");
    }

    // Pick a random point 0.5 km away (average person walks 6km/h, a square with 0.5km sides == a 2km/20min walk)
    var distance_km = 0.5;

    // FIXME - make this use geolocation
    var current_lat = -42.88234;
    var current_lon = 147.33047;

    // Now we know how many lat/lon degrees away represent distance_km at this point on the globe
    var lat_diff = distance_km / lat_km_per_degree;
    var lon_diff = distance_km / lon_km_per_degree;

    console.log(lat_km_per_degree);
    console.log(lon_km_per_degree);

    var point0 = [current_lat, current_lon];
    var point1 = [current_lat, current_lon - lon_diff];
    var point2 = [current_lat + lat_diff, current_lon - lon_diff];
    var point3 = [current_lat + lat_diff, current_lon];

    return [point0, point1, point2, point3];
}

Map.prototype.onLocationError = function(error){
  console.error(error)

  // Fall back to a default location of the Old Mercury Building
  this.map.setView([-42.88234, 147.33047], 16);
}

Map.prototype.onLocationFound = function(e){
  var radius = e.accuracy / 2;
  var location = e.latlng;

  var map = this.map;

  window.L.marker(location).addTo(this.map);
  window.L.circle(location, radius).addTo(this.map);
  console.log(location);
  var temp_dest = window.L.latLng(-42.855165, 147.297478);
  this.createTempRoute(location, temp_dest);
}

Map.prototype.createTempRoute = function(start_latlng, dest_latlngs){
  var L = window.L;
  var map = this.map;

  var control = L.Routing.control({
    waypoints: [
        start_latlng,
        dest_latlngs
    ],
    routeWhileDragging: true,
    showAlternatives: false,
    show: false,
    collapsible: true,
    useZoomParameter: true
  });

  control.addTo(map);

  map.on('zoomend', function() {
    control.route();
  });
}


Map.prototype.addPlaceOfInterest = function(placeOfInterest, options){

  var markerOptions = { title: placeOfInterest.title }
  
  markerOptions.icon = this.iconFactory_.createLeafletIcon(placeOfInterest.type)

  var marker = L.marker(
    [placeOfInterest.lat, placeOfInterest.long],
    markerOptions,
  ).addTo(this.map);
  
  if (options.onClick){
    marker.on('click', (e) => options.onClick(e, placeOfInterest, marker))
  }
}

export default Map
