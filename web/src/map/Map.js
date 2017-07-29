
function Map(){
  this.placesOfInterest_ = []
  this.map = null;
}

Map.prototype.load = function(container){
  this.map = window.L.map(container)

  this.map.on('locationerror', (e) => this.onLocationError(e))

  this.map.on('locationfound', (e) => this.onLocationFound(e));
  //map.on('locationerror', that.onLocationError);

  this.map.locate({setView: true, maxZoom: 16,});

  // Load tiles
  window.L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
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
  this.createRoute(location, temp_dest);
}

Map.prototype.createRoute = function(start_latlng, dest_latlngs){
  var L = window.L;
  var map = this.map;

  L.Routing.control({
    waypoints: [
        start_latlng,
        dest_latlngs
    ],
    routeWhileDragging: true
  }).addTo(map);
}


export default Map