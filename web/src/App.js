import React, { Component } from 'react'
import logo from './logo.svg'
import injectStyles from 'react-jss'
import Button from './modules/Button'
import Map from './map/Map'
import PLACE_TYPE from './map/PLACE_TYPE'

const map = new Map

const styles = {
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
    var testData = [
      { name: 'Tasmanian Museum and Art Gallery',                      lat: -42.88147, long: 147.33265, type: PLACE_TYPE.MUSEUM},
      { name: 'The Henry Jones Art Hotel',                             lat: -42.88117, long: 147.3354,  type: PLACE_TYPE.MUSEUM },
      { name: 'University of Tasmania, Tasmanian College of the Arts', lat: -42.88157, long: 147.33666, type: PLACE_TYPE.ART },
      { name: 'Town Hall',                                             lat: -42.88254, long: 147.33106, type: PLACE_TYPE.HERITAGE},
      { name: 'Mawson\'s Huts Replica Museum',                         lat: -42.88309, long: 147.33227, type: PLACE_TYPE.MUSEUM },
      { name: 'St David\'s Cathedral',                                 lat: -42.88353, long: 147.32843, type: PLACE_TYPE.HERITAGE },
      { name: 'Treasury Building',                                     lat: -42.88389, long: 147.32927, type: PLACE_TYPE.HERITAGE },
    ]
    Promise.resolve(testData)
    .then(placesOfInterest => {
      placesOfInterest.forEach(p => 
        window.L.marker([p.lat, p.long]).addTo(map.map)
      )
    })
  };

  render() {
    const { classes } = this.props
    return (
      <div className={classes.app}>
        <div className={classes.mapContainer} ref={el => this.mapEle_ = el} />
        <div className={classes.buttonContainer}>
          <div className={classes.buttonContainerInner}>
            <Button className={classes.startTourButton} />
          </div>
        </div>
      </div>
    );
  }
}

export default injectStyles(styles)(App)

