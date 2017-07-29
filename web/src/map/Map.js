//import r360 from 'route360'
import L from 'leaflet'
import iconFactory from './iconFactory'
import getPointsOfInterest from '../xhr/getPointsOfInterest';
import RouteError from './RouteError'

const ROUTE_360_API_KEY = '4UH6GBMYTDBEZSXZ6FUWL0E'
const DEFAULT_LATLNG = window.L.latLng(-42.88234, 147.33047);


function Map(){
  this.iconFactory_ = iconFactory
  this.map = null;
  this.myLocation = DEFAULT_LATLNG;
  this.handlers_ = {}
  this.controls = [];
}

function calcDistance(lat_1, lon_1, lat_2, lon_2) {

    var lat_km_per_degree = 110;
    var lon_km_per_degree = Math.cos(lat_1 * (Math.PI / 180)) * lat_km_per_degree;

    var lat_km_diff = (Math.abs(lat_2) - Math.abs(lat_1)) * lat_km_per_degree;
    var lon_km_diff = (Math.abs(lon_2) - Math.abs(lon_1)) * lon_km_per_degree;

    var km_diff = Math.sqrt(lat_km_diff**2 + lon_km_diff**2);
    
    return km_diff;
}

Map.prototype.findNearest = function(ideal_point, actual_points) {
    var nearest_distance = 9999;
    var nearest = null;

    console.log("Finding nearest");

    for (var i = 0; i < actual_points.length; i++) {
        console.log(actual_points[i]);
    }

    actual_points.forEach(function(point) {
        
        var this_distance = calcDistance(ideal_point['lat'], ideal_point['lng'], point['lat'], point['long']);
        if ((this_distance) < nearest_distance) {
            nearest_distance = this_distance;
            nearest = point;
        } 
        
    });

    return nearest;
}

Map.prototype.load = function(container){
  this.map = L.map(container)

  this.map.on('locationerror', (e) => this.onLocationError(e));
  this.map.on('locationfound', (e) => this.onLocationFound(e));
  this.map.on('contextmenu', (e) => {
    //do something ...
    
    var markerOptions = { title: 'Start Location' }
    markerOptions.icon = this.iconFactory_.createLeafletIcon('startLocation')

    this.manualStartLocation = e.latlng

    if (this.startMarker)
      this.startMarker.remove()
    this.startMarker = L.marker(
      e.latlng,
      markerOptions,
    ).addTo(this.map)
    
  });

  this.map.locate({setView: true, watch: true});

  // Load tiles
  /*this.layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(this.map);*/

  this.layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(this.map);

  this.layer.on('load', e => this.onLayerLoad(e))

  
  /*window.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);*/

}


// Path finding - get next point in a circular polygon
Map.prototype.getNextPoint = function(lat_lng, angle_deg, distance_km){

  console.log("getNextPoint");

  var s_lat = lat_lng.lat;
  var s_lon = lat_lng.lng;

  //console.log("latng: " , s_lat , " ", s_lon);

  var lat_km_per_degree = 110;
  var lon_km_per_degree = Math.cos(s_lat * (Math.PI / 180)) * lat_km_per_degree;

  // Now we know how many lat/lon degrees away represent distance_km at this point on the globe
  var lat_diff = distance_km / lat_km_per_degree;
  var lon_diff = distance_km / lon_km_per_degree;

  //console.log("Lat diff: " + lat_diff);
  //console.log("Lon diff: " + lon_diff);

  var deg_rad = angle_deg * (Math.PI / 180);

  var next_point_lat = s_lat + lat_diff * Math.cos(deg_rad);
  var next_point_lon = s_lon + lon_diff * Math.sin(deg_rad);

  //console.log("Next lat: " + next_point_lat + ", lon: " + next_point_lon);

  return window.L.latLng(next_point_lat, next_point_lon);
}


Map.prototype.onLayerLoad = function(){
  this.layerLoaded = true;
  this.maybeFinishLoading();
}

Map.prototype.createPoints = function(center_point, distance_km){

  console.log("createPoints");
  
  var lat_km_per_degree = 110;
  var lon_km_per_degree = Math.cos(center_point.lat * (Math.PI / 180)) * lat_km_per_degree;

  //var lat_diff = distance_km / lat_km_per_degree;
  //var lon_diff = distance_km / lon_km_per_degree;

  // FIXME: change points based on time or distance
  var num_points = 5;
  var delta_deg = 360/num_points;

  var radius = distance_km / (2 * Math.PI);

  var points = [];
  //points.push(center_point);

  for(var i = 0; i < num_points; i++){
    var tp = this.getNextPoint(center_point, delta_deg * i, radius);
    points.push(tp);
  }

  return points;

}

Map.prototype.onLocationError = function(error){
  console.error(error)

  // Fall back to a default location of the Old Mercury Building
  var defaultStartLocation = { lat: -42.88234, lng: 147.33047 }
  this.map.setView([defaultStartLocation.lat, defaultStartLocation.lng], 16)
  
  this.startLocation = defaultStartLocation
  this.maybeFinishLoading()
}

Map.prototype.generatePath_ = function(startLocation, center_point, temp_placesOfInterest, distance_km){
  var points = this.createPoints(center_point, distance_km);
  var nearest_points = [];
  var nearestPlacesOfInterest = []
    points.forEach((element) => {
      //console.log(element);
      //window.L.marker(element).addTo(that.map);
    
      //console.log("placesOfInterest:", temp_placesOfInterest);
  
      var nearest = this.findNearest(element, temp_placesOfInterest);
      var nearest_latlng = window.L.latLng(nearest.lat, nearest.long);
      nearest_points.push(nearest_latlng);
      nearestPlacesOfInterest.push(nearest)
      //console.log("findNearest returned:", nearest);
      //that.addPlaceOfInterest(nearest);
    });

    console.log(nearest_points);
    //var first = nearest_points[0];
    //nearest_points.push(first);
    nearest_points.splice(0, 0, startLocation)
    nearest_points.push(startLocation)

    var router = L.Routing.mapbox(
      'pk.eyJ1IjoiYWxseWN3IiwiYSI6ImNqNXA5ZDk4NTA4NTkyd211bTBvOGxpN28ifQ.mx0X6eehCGTmx9_ZBzPkSg',
      {
        profile: 'mapbox/walking',
      }
    )

    var control = L.Routing.control({
      //waypoints: nearest_points,
      plan: L.Routing.plan(
        nearest_points, 
        {
          createMarker: function(i, wp) {
            return L.marker(wp.latLng, {
              draggable: false,
              icon: iconFactory.createHiddenLeafletIcon(),
            });
          },
        }
      ),
      router: /*L.Routing.osrmv1({
        allowUTurns: true,
        geometryOnly: true
      }),*/ router,
      routeWhileDragging: true,
      showAlternatives: false,
      show: false,
      collapsible: true,
      useZoomParameter: true,
      lineOptions: {
        styles: [{color: '#00addf', opacity: 0.8, weight: 2}]
      },
    });

    control.addTo(this.map);
    this.controls.push(control)

    /*this.map.on('zoomend', function() {
      control.route();
    });*/

    // Must be done last else points of interest are not clickable
    nearestPlacesOfInterest.forEach(p => this.addPlaceOfInterest(p))
}

Map.prototype.generatePath = function(duration){

  console.log("Generating path");

  var distance_km = (duration * 5) / 60;
  var radius = distance_km / (2 * Math.PI);

  //console.log("Radius: " + radius);

  var startLocation = this.getStartLocation()

  var center_point = this.getNextPoint(startLocation, Math.random() * 360, radius);
  //var points = this.createRoute(duration);

  return getPointsOfInterest(center_point.lat, center_point.lng, radius * 1.5)
  .then(placesOfInterest => {
    //this.setState({ loading: false, })
    if (placesOfInterest.length < 2)
      throw new RouteError(`Not enough places of interest. Try dropping a pin somewhere else, for example, Hobart.`)
    return this.generatePath_(startLocation, center_point, placesOfInterest, distance_km)
  })
  //console.log("placesOfInterest", that.placesOfInterest);

}

Map.prototype.onLocationFound = function(e){
  /*var radius = e.accuracy / 2;
  var location = e.latlng;

  var map = this.map;

  window.L.marker(location).addTo(this.map);
  window.L.circle(location, radius).addTo(this.map);
  console.log(location);
  var temp_dest = window.L.latLng(-42.855165, 147.297478);
  this.createRoute(location, temp_dest);*/
  this.startLocation = e.latlng; //{lat: e.latlng.lat, long: e.latlng.lng }
  if (this.lastCircle)
    this.lastCircle.remove()
  this.lastCircle = L.circle(e.latlng, 5).addTo(this.map)
  this.maybeFinishLoading()
  //this.createTempRoute(location, temp_dest);
}

Map.prototype.maybeFinishLoading = function(){
  if (this.loaded) return
  if (!this.layerLoaded || !this.startLocation) return
  this.loaded = true
  ;(this.handlers_['load'] || []).forEach(handler => handler())
}

Map.prototype.getStartLocation = function(){
  return this.manualStartLocation || this.startLocation
};

Map.prototype.on = function(eventType, func){
  this.handlers_[eventType] = this.handlers_[eventType] || []
  this.handlers_[eventType].push(func)
}

/*Map.prototype.createTempRoute = function(start_latlng, dest_latlngs){
  var L = window.L;
  var map = this.map;
  
  var control = L.Routing.control({
    plan: L.Routing.plan(
      [ start_latlng, dest_latlngs ], 
      {
        createMarker: function(i, wp) {
          return L.marker(wp.latLng, {
            draggable: false,
            icon: iconFactory.createHiddenLeafletIcon(),
          });
        },
      }
    ),
    //geocoder: L.Control.Geocoder.nominatim(),
    routeWhileDragging: true,
    showAlternatives: false,
    show: false,
    collapsible: true,
    useZoomParameter: true
  })

  control.addTo(map);

  map.on('zoomend', function() {
    control.route();
  });
}*/


Map.prototype.addPlaceOfInterest = function(placeOfInterest, options){

  var markerOptions = { title: placeOfInterest.title }
  
  markerOptions.icon = this.iconFactory_.createLeafletIcon(placeOfInterest.type)

  var marker = L.marker(
    [placeOfInterest.lat, placeOfInterest.long],
    markerOptions,
  ).addTo(this.map);
  
  marker.on('click', (e) => {
    if (typeof options != 'undefined' && options.onClick)
      options.onClick(e, placeOfInterest, marker)
    ;(this.handlers_['placeOfInterestClick'] || []).forEach(func => 
      func(e, placeOfInterest, marker)
    )
  })
  this.controls.push(marker)
  
}

Map.prototype.clear = function(){
  this.controls.forEach(c => c.remove())
}


export default Map
