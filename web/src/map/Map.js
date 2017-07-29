//import r360 from 'route360'
import L from 'leaflet'
import iconFactory from './iconFactory'

const ROUTE_360_API_KEY = '4UH6GBMYTDBEZSXZ6FUWL0E'

function Map(){
  this.placesOfInterest_ = []
  this.iconFactory_ = iconFactory
}

Map.prototype.load = function(container){
  this.map = L.map(container)

  this.map.on('locationerror', (e) => this.onLocationError(e))


  this.map.locate({setView: true, maxZoom: 16,})

  // Load tiles
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
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

// Route360 test code
/*Map.prototype.loadRouting = function(){

  // initialise the base map
  //r360.basemap({ style: 'basic', apikey: ROUTE_360_API_KEY }).addTo(this.map)

  // create a target marker icon to be able to distingush source and targets
  var redIcon = L.icon({
    iconUrl: 'http://assets.route360.net/leaflet-extras/marker-icon-red.png',
    shadowUrl: 'http://assets.route360.net/leaflet-extras/marker-shadow.png',
    iconAnchor: [12, 45],
    popupAnchor: [0, -35]
  });

  // create a source and a two target markers and add them to the map
  var sourceMarker1 = L.marker([-42.88147, 147.33265], { draggable : true }).addTo(this.map);
  var targetMarker1 = L.marker([-42.88117, 147.3354], { icon: redIcon, draggable : true }).addTo(this.map);
  var targetMarker2 = L.marker([-42.88157, 147.33666], { icon: redIcon, draggable : true }).addTo(this.map);


  var routeLayer = L.featureGroup().addTo(this.map)

  var getRoutes = function() {

    routeLayer.clearLayers();

    // you need to define some options for the polygon service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    // we only have one source which is the marker we just added
    travelOptions.addSource(sourceMarker1);
    // add two targets to the options
    travelOptions.addTarget(targetMarker1);
    travelOptions.addTarget(targetMarker2);
    // set the travel type to transit
    travelOptions.setTravelType('transit');
    // no alternative route recommendations - this is for pro/advanced plans only
    travelOptions.setRecommendations(-1);
    // please contact us and request your own key
    travelOptions.setServiceKey(ROUTE_360_API_KEY);
    // set the service url for your area
    //travelOptions.setServiceUrl('https://service.route360.net/germany/');

    // start the service
    r360.RouteService.getRoutes(travelOptions, function(routes) {

      // one route for each source and target combination
      routes.forEach(function(route) {

        r360.LeafletUtil.fadeIn(routeLayer, route, 1000, "travelDistance");
      });
    });
  }

  getRoutes()
}*/

Map.prototype.addPlaceOfInterest = function(placeOfInterest, options){

  var markerOptions = { title: placeOfInterest.title }
  
  markerOptions.icon = this.iconFactory_.createLeafletIcon(placeOfInterest.type)
  


  var marker = L.marker(
    [placeOfInterest.lat, placeOfInterest.long],
    markerOptions,
  ).addTo(this.map)
  
  if (options.onClick){
    marker.on('click', (e) => options.onClick(e, placeOfInterest, marker))
  }
}

export default Map