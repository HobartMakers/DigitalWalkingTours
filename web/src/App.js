import React, { Component } from 'react'
import injectStyles from 'react-jss'
import Button from './modules/Button'
import Map from './map/Map'
import PLACE_TYPE from './map/PLACE_TYPE'
import SideMenu from './modules/SideMenu'
import FloatingButton from './modules/FloatingButton'
import L from 'leaflet'
import { Motion, spring } from 'react-motion'
import iconFactory from './map/iconFactory'
import 'leaflet-routing-machine';
//var Urban_Art = require('./Urban_Art.json')
//var Hobart_Facilities = require('./Hobart_Facilities.json')
import Loader from './modules/Loader'
import getPointsOfInterest from './xhr/getPointsOfInterest'
import RouteError from './map/RouteError'

const map = new Map

const styles = {
  '@global body': {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    fontFamily: "'Roboto', sans-serif",
  },
  app: {
    width: '100vw',
    //height: '100vh',
    //backgroundImage: `url(${require('./testMap.png')})`,
    //backgroundSize: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    top: -62,
  },
  mapContainer: {
    width: '100vw',
    //height: '100vh',
    transition: 'opacity 0.3s',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuButton: {
    position: 'absolute',
    top: 30,
    left: 60,
    zIndex: 401,
  },
  content: {
    position: 'relative',
    height: '100%',
  },
  loading: {
    position: 'fixed !important',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
  },
  error: {
    border: '2px solid red',
    color: 'red',
    padding: '4px 20px',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    zIndex: 500,
    boxSizing: 'border-box',
  },
  errorCloseButton: {
    position: 'absolute',
    top: 1,
    right: 1,
    color: 'red',
    cursor: 'pointer',
  },
}

const optionsMenuStyles = {
  optionsMenu: {
    position: 'fixed',
    right: 0,
    width: 80,
    top: 0,
    bottom: 0,
  },
}

var compass_supported = true;
var user_heading_angle = null;

function deviceOrientationListener(e){
  console.log(e);
  if(e.type  == "locationerror"){
    console.log("Location is not functioning on your device.");
    compass_supported = false;
  }
  if(e.alpha == null){
    console.log("No orientation data from device.");
    compass_supported = false;
  } else {
    // do something!!
    user_heading_angle = e.gamma;

  }
}

if (window.DeviceOrientationEvent) {
  // Our browser supports DeviceOrientation
  window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
  compass_supported = false;
  console.log("Sorry, your browser doesn't support Device Orientation");
}

const OptionsMenu = injectStyles(optionsMenuStyles)(
  ({classes, ...props}) => <SideMenu {...props} className={classes.optionsMenu} />)

class App extends Component {

  componentDidMount = () => {
    map.on('load', () => this.setState({ initializing: false }))
    map.on('placeOfInterestClick', (e, poi, marker) => this.onPlaceOfInterestClick(e, poi, marker))
    map.on('placeOfInterestClose', (poi, marker) => this.onPlaceOfInterestClose(poi, marker))
    map.load(this.mapEle_)
    this.updatePlacesOfInterest()
  };

  updatePlacesOfInterest = () => {
    
    /*var testData = [
      { 
        title: 'Tasmanian Museum and Art Gallery',                      
        lat: -42.88147, 
        long: 147.33265, 
        type: PLACE_TYPE.MUSEUM,
        content: `The Tasmanian Museum and Art Gallery is a museum located in Hobart, Tasmania. The museum was established in 1846, by the Royal Society of Tasmania, the oldest Royal Society outside England. The TMAG receives 300,000 visitors annually.`,
        images: [
          'http://tmag.tas.gov.au/__data/assets/image/0009/78093/Exhibitions_-_Central_Gallery.jpg',
        ],
      },
      { 
        title: 'The Henry Jones Art Hotel',                             
        lat: -42.88117, 
        long: 147.3354,  
        type: PLACE_TYPE.MUSEUM,
      },
      { 
        title: 'University of Tasmania, Tasmanian College of the Arts', 
        lat: -42.88157, 
        long: 147.33666, 
        type: PLACE_TYPE.ART, 
      },
      { title: 'Town Hall',                                             lat: -42.88254, long: 147.33106, type: PLACE_TYPE.HERITAGE},
      { title: 'Mawson\'s Huts Replica Museum',                         lat: -42.88309, long: 147.33227, type: PLACE_TYPE.MUSEUM },
      { title: 'St David\'s Cathedral',                                 lat: -42.88353, long: 147.32843, type: PLACE_TYPE.HERITAGE },
      { title: 'Treasury Building',                                     lat: -42.88389, long: 147.32927, type: PLACE_TYPE.HERITAGE },
    ]

    Promise.resolve(testData)
    .then(placesOfInterest => {
      placesOfInterest.forEach(p => {
        map.addPlaceOfInterest(p, { onClick: this.onPlaceOfInterestClick })
      })
    })*/
    
    //window.L.geoJSON(Hobart_Facilities).addTo(map.map);

    /*window.L.geoJSON(Urban_Art, {
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
    }).addTo(map.map);*/

    //window.L.geoJSON(Urban_Art).addTo(map.map);


  };

  onPlaceOfInterestClick = (e, poi, marker) => {
    
    this.unselectMarker()

    // Change the icon
    var icon = iconFactory.createLeafletIcon(poi.type, {color: 'red'})
    marker.setIcon(icon)
    
    e.originalEvent.stopPropagation()
    this.setState({
      sideMenuOpen: true,
      selectedMarker: marker,
      selectedPoi: poi,
      autoSelectedMarker: null,
      autoSelectedPoi: null,
      lastDisplayedAutoPoi: poi,
    })
  };

  onPlaceOfInterestClose = (poi, marker) => {
    // If something is already selected, don't unselect it, that would be
    // annoying
    if (this.state.selectedMarker) return

    // Action has already been taken don't display the same thing again
    // anoyingly
    if (poi == this.state.lastDisplayedAutoPoi) return

    this.unselectMarker()
    // Change the icon
    var icon = iconFactory.createLeafletIcon(poi.type, {color: 'purple'})
    marker.setIcon(icon)
    
    this.setState({
      sideMenuOpen: true,
      autoSelectedMarker: marker,
      autoSelectedPoi: poi,
      // If the user's location updates again but they've already closed the
      // closest point of interest we need to know this to not display it
      // again
      lastDisplayedAutoPoi: poi,
    })
    
  };

  unselectMarker = () => {
    const { selectedMarker, selectedPoi, autoSelectedMarker, autoSelectedPoi } = this.state
    if (selectedMarker) {
      var icon = iconFactory.createLeafletIcon(selectedPoi.type)
      selectedMarker.setIcon(icon)
    }
    if (autoSelectedMarker) {
      var icon = iconFactory.createLeafletIcon(autoSelectedPoi.type)
      autoSelectedMarker.setIcon(icon)
      
    }
  }

  state = {
    sideMenuOpen: false,
    initializing: true,
    loading: false,
    optionsOpen: false,
    inTour: false,
  };

  closeSideMenu = () => {
    this.unselectMarker()
    
    this.setState({ 
      sideMenuOpen: false,
      selectedMarker: null,
      selectedPoi: null,
      autoSelectedMarker: null,
      autoSelectedPoi: null,
    })
  };

  toggleOptionsMenu = () => {
    
    this.setState({ 
      sideMenuOpen: false,
      optionsOpen: !this.state.optionsOpen, 
    })
  }

  startTour = () => {
    //var points = map.createRoute();
    var that = this;

    this.setState({
      loading: true,
    })

    map.generatePath(20, user_heading_angle)
    .then((routes) => {
      this.setState({
        loading: false,
        inTour: true,
      })
    })
    .catch(error => {
      if (error instanceof RouteError){
        this.setState({
          errorMessage: error.message,
          loading: false,
        }) 
      } else {
        throw error
      }
    })

    /*

    points.forEach(function(element) {
      console.log(element);
      window.L.marker(element).addTo(map.map);
    });

    var startLoc = map.getStartLocation();

    getPointsOfInterest(startLoc.lat, startLoc.lng , 0.2)
    .then(placesOfInterest => {
      this.setState({ loading: false, })
      placesOfInterest.forEach(p => {
        map.addPlaceOfInterest(p, { onClick: this.onPlaceOfInterestClick })
      })
    }) */
  }

  stopTour = () => {
    map.clear()
    this.setState({ inTour: false, })
  };

  closeError = () => this.setState({errorMessage: null});

  render() {
    const { classes } = this.props
    var { 
      sideMenuOpen, 
      selectedPoi, 
      autoSelectedPoi,
      initializing, 
      loading,
      optionsOpen, 
      inTour,
      errorMessage, 
    } = this.state
    selectedPoi = selectedPoi || autoSelectedPoi || {}
    
    return <Motion 
      defaultStyle={{
        menuX: 50,
        contentX: 0,
        optionsMenuX: 80,
      }} 
      style={{
        menuX: spring(sideMenuOpen ? 0 : 50),
        contentX: spring(sideMenuOpen ? -25 : 0),
        optionsMenuX: spring(optionsOpen ? 0 : 80),
      }}
    >
      {value => <div className={classes.app}>
        <Loader className={classes.loading} />
        {errorMessage ? <div className={classes.error}>
          {errorMessage}
          <div className={classes.errorCloseButton}
            onClick={this.closeError}
          >
            <svg fill="red" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </div>
        </div> : null}
        <div onClick={this.closeSideMenu}
          className={classes.content}
          style={{transform: `translateX(${value.contentX}vw)`}} 
        >
          <div 
            className={classes.mapContainer} 
            ref={el => this.mapEle_ = el} 
            style={{opacity: initializing ? 0 : 1}}
          />
          {(initializing) ? null : <div className={classes.buttonContainer}>
            <div className={classes.buttonContainerInner}>
              <Button 
                className={classes.startTourButton} 
                onClick={this.startTour}
                onClick={loading ? null : (inTour ? this.stopTour : this.startTour)}
                disabled={loading}
              >
                {loading ? 'Calculating...' : (inTour ? 'Stop' : 'Start Tour')}
              </Button>
            </div>
          </div>}
        </div>
        {/*initializing ? null : <FloatingButton className={classes.menuButton} onClick={this.toggleOptionsMenu}>
          <svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </FloatingButton>*/}
        {initializing ? null : <SideMenu 
          open={sideMenuOpen} 
          style={{transform: `translateX(${value.menuX}vw)`}} 
          poiTitle={selectedPoi.title}
          poiContent={selectedPoi.contents}
          poiImages={selectedPoi.images}
        />}
        {initializing ? null : <OptionsMenu
          open={optionsOpen}
          style={{transform: `translateX(${value.optionsMenuX}px)`}} 
        />}
      </div>}
    </Motion>
    
  }
}

export default injectStyles(styles)(App)

