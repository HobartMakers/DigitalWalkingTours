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
  content: {
    position: 'relative',
  },
}

class App extends Component {

  componentDidMount = () => {
    map.load(this.mapEle_)
    this.updatePlacesOfInterest()
    //var mymap = window.L.map('map')
    
    //map.loadRouting()
  };

  updatePlacesOfInterest = () => {
    var testData = [
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
    })
  };

  onPlaceOfInterestClick = (e, poi, marker) => {
    
    this.unselectMarker()

    // Change the icon
    var icon = iconFactory.createLeafletIcon(poi.type, {color: 'red'})
    marker.setIcon(icon)
    
    e.originalEvent.stopPropagation()
    this.setState({
      sideMenuOpen: true,
      poiContent: poi.content,
      poiImages: poi.images,
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
  };

  closeSideMenu = () => {
    this.unselectMarker()
    this.setState({ sideMenuOpen: false })
  };

  toggleSideMenu = () => this.setState({ sideMenuOpen: !this.state.sideMenuOpen });

  render() {
    const { classes } = this.props
    const { sideMenuOpen, poiContent, poiImages } = this.state
    
    return <Motion 
      defaultStyle={{
        menuX: 40,
        contentX: 0,
      }} 
      style={{
        menuX: spring(sideMenuOpen ? 0 : 40),
        contentX: spring(sideMenuOpen ? -20 : 0),
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
          />
          <div className={classes.buttonContainer}>
            <div className={classes.buttonContainerInner}>
              <Button className={classes.startTourButton}>Start Tour</Button>
            </div>
          </div>
        </div>
        <FloatingButton className={classes.menuButton} onClick={this.toggleSideMenu}>
          <svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </FloatingButton>
        <SideMenu 
          open={sideMenuOpen} 
          style={{transform: `translateX(${value.menuX}vw)`}} 
          poiContent={poiContent}
          poiImages={poiImages}
        />
      </div>}
    </Motion>
    
  }
}

export default injectStyles(styles)(App)

