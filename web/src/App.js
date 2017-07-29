import React, { Component } from 'react'
import logo from './logo.svg'
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

const map = new Map

const styles = {
  '@global body': {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    fontFamily: "'Roboto', sans-serif",
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
    transition: 'opacity 0.3s',
  },
  menuButton: {
    position: 'absolute',
    top: 30,
    left: 60,
    zIndex: 401,
  },
  content: {
    position: 'relative',
  },
  loading: {
    position: 'fixed !important',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
  },
}

class App extends Component {

  componentDidMount = () => {
    map.on('load', () => this.setState({ initializing: false }))
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
    })
  };

  unselectMarker = () => {
    const { selectedMarker, selectedPoi } = this.state
    if (!selectedMarker) return

    var icon = iconFactory.createLeafletIcon(selectedPoi.type)
    selectedMarker.setIcon(icon)
  }

  state = {
    sideMenuOpen: false,
    initializing: true,
    loading: false,
  };

  closeSideMenu = () => {
    this.unselectMarker()
    this.setState({ sideMenuOpen: false })
  };

  toggleSideMenu = () => this.setState({ sideMenuOpen: !this.state.sideMenuOpen });

  startTour = () => {
    var points = map.createRoute();

    points.forEach(function(element) {
      console.log(element);
      window.L.marker(element).addTo(map.map)
    });

    this.setState({
      loading: true,
    })
    
    var startLoc = map.getStartLocation()

    getPointsOfInterest(startLoc.lat, startLoc.long , 0.2)
    .then(placesOfInterest => {
      this.setState({ loading: false, })
      placesOfInterest.forEach(p => {
        map.addPlaceOfInterest(p, { onClick: this.onPlaceOfInterestClick })
      })
    })

  }

  render() {
    const { classes } = this.props
    var { sideMenuOpen, selectedPoi, initializing, loading } = this.state
    selectedPoi = selectedPoi || {}

    return <Motion 
      defaultStyle={{
        menuX: 50,
        contentX: 0,
      }} 
      style={{
        menuX: spring(sideMenuOpen ? 0 : 50),
        contentX: spring(sideMenuOpen ? -25 : 0),
      }}
    >
      {value => <div className={classes.app}>
        <div onClick={this.closeSideMenu}
          className={classes.content}
          style={{transform: `translateX(${value.contentX}vw)`}} 
        >
          <div 
            className={classes.mapContainer} 
            ref={el => this.mapEle_ = el} 
            style={{opacity: initializing ? 0 : 1}}
          />
          {initializing ? null : <div className={classes.buttonContainer}>
            <div className={classes.buttonContainerInner}>
              <Button 
                className={classes.startTourButton} 
                onClick={this.startTour}
                disabled={loading}
              >
                {loading ? 'Retrieving...' : 'Start Tour'}
              </Button>
            </div>
          </div>}
        </div>
        {initializing ? null : <FloatingButton className={classes.menuButton} onClick={this.toggleSideMenu}>
          <svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </FloatingButton>}
        {initializing ? null : <SideMenu 
          open={sideMenuOpen} 
          style={{transform: `translateX(${value.menuX}vw)`}} 
          poiTitle={selectedPoi.title}
          poiContent={selectedPoi.contents}
          poiImages={selectedPoi.images}
        />}
        {initializing ? <Loader className={classes.loading} /> : null}
      </div>}
    </Motion>
    
  }
}

export default injectStyles(styles)(App)

