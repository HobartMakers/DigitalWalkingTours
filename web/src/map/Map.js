import r360 from 'route360'

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

Map.prototype.onLocationError = function(error){
  console.error(error)

  // Fall back to a default location of the Old Mercury Building
  this.map.setView([-42.88234, 147.33047], 16)
}

Map.prototype.loadRouting = function(){

  // initialise the base map
  r360.basemap({ style: 'basic', apikey: '4UH6GBMYTDBEZSXZ6FUWL0E' }).addTo(map);

  // create a target marker icon to be able to distingush source and targets
  var redIcon = L.icon({
    iconUrl: 'http://assets.route360.net/leaflet-extras/marker-icon-red.png',
    shadowUrl: 'http://assets.route360.net/leaflet-extras/marker-shadow.png',
    iconAnchor: [12, 45],
    popupAnchor: [0, -35]
  });

  // create a source and a two target markers and add them to the map
  var sourceMarker1 = L.marker(latlons.src1, { draggable : true }).addTo(map);
  var targetMarker1 = L.marker(latlons.trg1, { icon: redIcon, draggable : true }).addTo(map);
  var targetMarker2 = L.marker(latlons.trg2, { icon: redIcon, draggable : true }).addTo(map);
}



export default Map