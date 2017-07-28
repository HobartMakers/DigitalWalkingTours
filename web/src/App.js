import React, { Component } from 'react'
import logo from './logo.svg'
import injectStyles from 'react-jss'
import Button from './modules/Button'

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
    var mymap = window.L.map('map').setView([-42.87, 147.25], 10);

    window.L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap)

    // Test marker
    var marker = window.L.marker([-42.87, 147.25]).addTo(mymap);

    // Sets the map to the user's location
    mymap.locate({setView: true, maxZoom: 16});
  };

  render() {
    const { classes } = this.props
    return (
      <div className={classes.app}>
        <div className={classes.mapContainer} id="map" />
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

