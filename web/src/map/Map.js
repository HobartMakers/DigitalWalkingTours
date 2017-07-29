
function Map(){
  this.placesOfInterest_ = []
}

Map.prototype.load = function(container){
  this.map = window.L.map(container)

  this.map.on('locationerror', (e) => this.onLocationError(e))

  this.map.locate({setView: true, maxZoom: 16,})

  // Load tiles
  window.L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(this.map)
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

    // Pick a random point 1 km away (average person walks 6km/h, a square with 1km sides == a 4km/40min walk)
    var distance_km = 1;

    // FIXME - make this use geolocation
    var current_lat = -42.87;
    var current_lon = 147.25;

    var lat_km_per_degree = 110;
    var lon_km_per_degree = Math.cos(current_lat * (Math.PI / 180)) * lat_km_per_degree;
    

    // Now we know how many lat/lon degrees away represent distance_km at this point on the globe
    var lat_diff = distance_km / lat_km_per_degree;
    var lon_diff = distance_km / lon_km_per_degree;
    
    console.log(lat_km_per_degree);
    console.log(lon_km_per_degree); 

    var point0 = [current_lat, current_lon];
    var point1 = [current_lat - lat_diff, current_lon];
    var point2 = [current_lat - lat_diff, current_lon + lon_diff];
    var point3 = [current_lat, current_lon + lon_diff];

    return [point0, point1, point2, point3];
}

Map.prototype.onLocationError = function(error){
  console.error(error)

  // Fall back to a default location of the Old Mercury Building
  this.map.setView([-42.88234, 147.33047], 16)
}



export default Map
