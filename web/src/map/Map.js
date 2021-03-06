//import r360 from 'route360'
import L from 'leaflet'
import iconFactory from './iconFactory'
import getPointsOfInterest from '../xhr/getPointsOfInterest';
import RouteError from './RouteError'

const ROUTE_360_API_KEY = '4UH6GBMYTDBEZSXZ6FUWL0E'
const DEFAULT_LATLNG = window.L.latLng(-42.88234, 147.33047);

// If true the second location pin placing will simulate the user moving their
// physical location
const SIMULATE_MOVING = false

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
       // console.log(actual_points[i]);
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

    if (this.startLocation  && SIMULATE_MOVING){
      this.positionUser(e.latlng)
      return
    } else {
      this.manualStartLocation = e.latlng
    }
    if (this.startMarker){
      this.startMarker.remove()
      var index = this.controls.indexOf(this.startMarker)
      if (index != -1)
        this.controls.splice(index, 1)
    }
    this.startMarker = L.marker(
      e.latlng,
      markerOptions,
    ).addTo(this.map)
    this.controls.push(this.startMarker)
    
  });

  this.map.locate({setView: false, watch: true});

  // Load tiles
  /*this.layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(this.map);*/

  ///https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxseWN3IiwiYSI6ImNqNXA5ZDk4NTA4NTkyd211bTBvOGxpN28ifQ.mx0X6eehCGTmx9_ZBzPkSg
  /*this.layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(this.map);*/

  this.layer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWxseWN3IiwiYSI6ImNqNXA5ZDk4NTA4NTkyd211bTBvOGxpN28ifQ.mx0X6eehCGTmx9_ZBzPkSg', {
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
  
  var remainingPlacesOfInterest = this.placesOfInterest.slice(0)
  
  return Promise.resolve(new Promise((resolve, reject) => {
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
        remainingPlacesOfInterest.splice(remainingPlacesOfInterest.indexOf(nearest), 1)
        
        //console.log("findNearest returned:", nearest);
        //that.addPlaceOfInterest(nearest);
      });

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
          styles: [{color: '#aa0000', opacity: 0.8, weight: 2, dashArray: "10, 10"}]
        },
      });

      control.on('routesfound', resolve)
      control.on('routingerror', reject)

      control.addTo(this.map);
      this.controls.push(control)

      /*this.map.on('zoomend', function() {
        control.route();
      });*/

      // Must be done last else points of interest are not clickable
      nearestPlacesOfInterest.forEach(p => {
        p.__isMainPoI = true // Hacky
        this.addPlaceOfInterest(p)
      })
  }))
  .then(routes => {
    var coordinates = routes.routes[0].coordinates

    // Figure out if any of the other points of interest lie close to the path
    var closePoints = remainingPlacesOfInterest.filter(p => isPlaceCloseToPath(p, coordinates))
    closePoints.forEach(p => this.addPlaceOfInterest(p))
  })

}

function isPlaceCloseToPath(place, coordinates){
  var point = [place.lat, place.long]

  for (var i = 0; i < (coordinates.length -1); i++){
    var c1 = coordinates[i],
      c2 = coordinates[i + 1]

    if (isPointCloseToLine(point, [c1.lat, c1.lng], [c2.lat, c2.lng]))
      return true 
  }
  return false
}

function isPointCloseToLine(point, c1, c2){
  var dis = pDistance(point[0], point[1], c1[0], c1[1], c2[0], c2[1])
  var threshold = 0.0005
  return dis < threshold
}

// Taken from https://stackoverflow.com/a/6853926/837649
function pDistance(x, y, x1, y1, x2, y2) {

  var A = x - x1;
  var B = y - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

Map.prototype.generatePath = function(duration, angle){

  console.log("Generating path");

  var distance_km = (duration * 5) / 60;
  var radius = distance_km / (2 * Math.PI);

  //console.log("Radius: " + radius);

  var startLocation = this.getStartLocation()

  if(angle != null){
    var center_point = this.getNextPoint(startLocation, angle, radius);
  } else{
    var center_point = this.getNextPoint(startLocation, Math.random() * 360, radius);
  }

  
  //var points = this.createRoute(duration);

  
  return getPointsOfInterest(center_point.lat, center_point.lng, radius * 1.5)
  .then(placesOfInterest => {
    // getPointsOfInterest should probably happen outside of this class and we
    // pass the points in but will take time to refactor
    // Instead going to store a reference of last fetched points
    this.placesOfInterest = placesOfInterest
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

  // If this is the first time ever loading set the view
  if (!this.startLocation)
    this.map.setView([e.latlng.lat, e.latlng.lng], 16)

  this.positionUser(e.latlng)
  this.maybeFinishLoading()
  //this.createTempRoute(location, temp_dest);
}

Map.prototype.positionUser = function(latlng){
  this.startLocation = latlng; //{lat: e.latlng.lat, long: e.latlng.lng }
  if (this.lastCircle)
    this.lastCircle.remove()
  this.lastCircle = L.circle(latlng, 5).addTo(this.map)

  // Check for points of interest collisions
  this.checkForPointsOfInterestCollisions(latlng)
}

function distanceBetweenPoints(x1, y1, x2, y2){
  var a = x1 - x2
  var b = y1 - y2

  return Math.sqrt( a*a + b*b )
}

Map.prototype.checkForPointsOfInterestCollisions = function(latlng){
  if (!this.placesOfInterest) return
  
  var closestP = null,
    closestDis = null
  this.placesOfInterest
  // Filter out points of interest that don't have a marker, we don't care about
  // those
  .filter(p => p.__marker)
  .forEach(p => {
    var dis = distanceBetweenPoints(latlng.lat, latlng.lng, p.lat, p.long)
    if (closestP == null || dis < closestDis){
      closestP = p
      closestDis = dis
    } 
  })


  if (!closestP) return
    
  // If the closest point is less than 40 meters a way flag it up as close
  var meterIsh = 0.00001 // actually 1.1 meters

  if (closestDis > meterIsh * 40) return

  ;(this.handlers_['placeOfInterestClose'] || []).forEach(func => 
    func(closestP, closestP.__marker)
  )
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
  var iconOptions = {};

  if (placeOfInterest.__isMainPoI){
    iconOptions.width = 45;
    iconOptions.height = 45;
  }
  
  markerOptions.icon = this.iconFactory_.createLeafletIcon(placeOfInterest.type, iconOptions)

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
  
  // Meh... nasty as hell but it's a hackathon, lets just get this working
  placeOfInterest.__marker = marker
}

Map.prototype.clear = function(){
  this.controls.forEach(c => c.remove())
}


export default Map
