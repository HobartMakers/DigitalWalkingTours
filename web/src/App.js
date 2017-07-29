import React, { Component } from 'react'
import logo from './logo.svg'
import injectStyles from 'react-jss'
import Button from './modules/Button'
import Map from './map/Map'
import PLACE_TYPE from './map/PLACE_TYPE'
import SideMenu from './modules/SideMenu'
import FloatingButton from './modules/FloatingButton'
import 'leaflet-routing-machine';
var Urban_Art = require('./Urban_Art.json')
var Hobart_Facilities = require('./Hobart_Facilities.json')

const map = new Map

const styles = {
  '@global body': {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  app: {
    width: '100vw',
    height: '100vh',
    //backgroundImage: `url(${require('./testMap.png')})`,
    //backgroundSize: 'cover',
  },
  buttonContainer: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    height: 0,
    width: '100vw',
    zIndex: 401,
  },
  buttonContainerInner: {
    position: 'relative',
  },
  startTourButton: {
    position: 'relative',
    margin: '0 auto',
    top: -(48 + 20),
  },
  mapContainer: {
    width: '100vw',
    height: '100vh',
  },
  menuButton: {
    position: 'absolute',
    top: 30,
    left: 60,
    zIndex: 401,
  },
}

class App extends Component {

  componentDidMount = () => {
    map.load(this.mapEle_)
    this.updatePlacesOfInterest()
    //var mymap = window.L.map('map')


    return
    //.setView([-42.87, 147.25], 10);

    /*window.L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap)

    // Test marker
    var marker = window.L.marker([-42.87, 147.25]).addTo(mymap);

    // Sets the map to the user's location
    mymap.locate({setView: true, maxZoom: 16});*/

  };

  updatePlacesOfInterest = () => {
    /*
    var testData = [
      { title: 'Tasmanian Museum and Art Gallery',                      lat: -42.88147, long: 147.33265, type: PLACE_TYPE.MUSEUM},
      { title: 'The Henry Jones Art Hotel',                             lat: -42.88117, long: 147.3354,  type: PLACE_TYPE.MUSEUM },
      { title: 'University of Tasmania, Tasmanian College of the Arts', lat: -42.88157, long: 147.33666, type: PLACE_TYPE.ART },
      { title: 'Town Hall',                                             lat: -42.88254, long: 147.33106, type: PLACE_TYPE.HERITAGE},
      { title: 'Mawson\'s Huts Replica Museum',                         lat: -42.88309, long: 147.33227, type: PLACE_TYPE.MUSEUM },
      { title: 'St David\'s Cathedral',                                 lat: -42.88353, long: 147.32843, type: PLACE_TYPE.HERITAGE },
      { title: 'Treasury Building',                                     lat: -42.88389, long: 147.32927, type: PLACE_TYPE.HERITAGE },
    ]

    Promise.resolve(testData)
    .then(placesOfInterest => {
      placesOfInterest.forEach(p =>
        window.L.marker(
          [p.lat, p.long],
          { title: p.title, },
        ).addTo(map.map)
      )
    })
    */
    //window.L.geoJSON(Hobart_Facilities).addTo(map.map);

    window.L.geoJSON(Urban_Art, {
        style: function(feature) {
            return {color: 'green'};
        },
        pointToLayer: function(feature, latlng) {
            return new window.L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.65});
        },
        onEachFeature: function (feature, layer) {
            var info = "Artist: " + feature.properties.Artist + "<br />" +
                       "Title: " + feature.properties.Title + "<br />" + 
                       "Date: " + feature.properties.Date + "<br />"; 

            layer.bindPopup(info);
        }
    }).addTo(map.map);

    //window.L.geoJSON(Urban_Art).addTo(map.map);


  };

  state = {
    sideMenuOpen: false,
  };

  closeSideMenu = () => this.setState({ sideMenuOpen: false });

  toggleSideMenu = () => this.setState({ sideMenuOpen: !this.state.sideMenuOpen });

  startTour = () => {
    var points = map.createRoute();

    points.forEach(function(element) {
      console.log(element);
      window.L.marker(element).addTo(map.map)
    });

  }

  render() {
    const { classes } = this.props
    const { sideMenuOpen } = this.state
    return (
      <div className={classes.app}>
        <div onClick={this.closeSideMenu}>
          <div
            className={classes.mapContainer}
            ref={el => this.mapEle_ = el}
          />
          <div className={classes.buttonContainer}>
            <div className={classes.buttonContainerInner}>
              <Button className={classes.startTourButton} onClick={this.startTour}>Start Tour</Button>
            </div>
          </div>
        </div>
        <FloatingButton className={classes.menuButton} onClick={this.toggleSideMenu}>
          <svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </FloatingButton>
        <SideMenu open={sideMenuOpen} />
      </div>
    );
  }
}

export default injectStyles(styles)(App)

