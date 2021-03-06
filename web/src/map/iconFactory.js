import React from 'react'
import PLACE_TYPE from './PLACE_TYPE'
import ReactDOM from 'react-dom'
import MuseumIcon from './../modules/icons/Museum'
import MarkerIcon from './../modules/icons/Marker'
import AmericanFootballIcon from './../modules/icons/AmericanFootball'
import ArtGalleryIcon from './../modules/icons/ArtGallery'
import CemeteryIcon from './../modules/icons/Cemetery'
import CinemaIcon from './../modules/icons/Cinema'
import IndustryIcon from './../modules/icons/Industry'
import InformationIcon from './../modules/icons/Information'
import LibraryIcon from './../modules/icons/Library'
import MonumentIcon from './../modules/icons/Monument'
import NaturalIcon from './../modules/icons/Natural'
import PicnicSiteIcon from './../modules/icons/PicnicSite'
import ParkIcon from './../modules/icons/Park'
import TownHllIcon from './../modules/icons/TownHall'
import AmusementIcon from './../modules/icons/Amusement'
import TheatreIcon from './../modules/icons/Theatre'

import L from 'leaflet'

function IconFactory(){

}


// dark green #4e9a06
// dark blue #204a07
// 



/**
 * Returns a dom element. Leaflet requires a DOM node
 */
IconFactory.prototype.createSvgIcon = function(type, iconOptions = {}){

  var div = document.createElement('div')
  div.style.display = 'inline-block'

  var { width, height } = iconOptions

  switch (type){
    case PLACE_TYPE.GALLERY: var Icon = ArtGalleryIcon; var color = '#a40000'; break; // dark red
    case PLACE_TYPE.LIBRARY: var Icon = LibraryIcon; var color = '#d3d7cf'; break; // light grey
    case PLACE_TYPE.MUSEUM: var Icon = MuseumIcon; var color = '#8f5902'; break; // dark brown
    case PLACE_TYPE.CINEMA: var Icon = CinemaIcon; var color = '#2e3436'; break; // dark grey
    case PLACE_TYPE.BURIAL_GROUND: var Icon = CemeteryIcon; var color = '#734a08'; break;
    case PLACE_TYPE.PARK: var Icon = ParkIcon; var color = '#4e9a06'; break; // dark green
    case PLACE_TYPE.PICNIC_AREA: var Icon = PicnicSiteIcon; var color = '#734a08'; break;
    case PLACE_TYPE.SPORTSGROUND: var Icon = AmericanFootballIcon; var color = '#204a87'; break; // dark blue
    case PLACE_TYPE.AMUSEMENT: var Icon = AmusementIcon; var color = '#cc0000'; break; // bright red
    case PLACE_TYPE.CULTURAL: var Icon = TheatreIcon; var color = '#e9b96e'; break; // light chocolate
    case PLACE_TYPE.HISTORICAL: var Icon = MuseumIcon; var color = '#ad7fa8'; break; // pale purple
    case PLACE_TYPE.INDUSTRIAL: var Icon = IndustryIcon; var color = '#888a85'; break; // mid grey
    case PLACE_TYPE.INFORMATION: var Icon = InformationIcon; var color = '#729fcf'; break; // pale blue
    case PLACE_TYPE.NATURAL_FEATURE: var Icon = NaturalIcon; var color = '#73d216'; break; // mid green
    case PLACE_TYPE.URBAN_ART: var Icon = MonumentIcon; var color = '#fce94f'; break; // butter yellow
    case 'startLocation': var Icon = MarkerIcon; width=40; height=40; color='#8ae234';break; // light green (i.e. go)
    default: var Icon = MarkerIcon; var color = '#f57900'; // orange
  }

  // The color in options takes precedence
  if (iconOptions.color)
    color = iconOptions.color

  ReactDOM.render(<Icon 
    width={width} 
    height={height} 
    fill={color} 
    zIndex={1000} // To put above any routing elements
  />, div)
  return div
}

IconFactory.prototype.getIconAnchorPos = function(placeType){
  if (placeType == PLACE_TYPE.MUSEUM){
    return { left: 10, top: 10 }
  } else if (placeType == 'startLocation'){
    return {left: 20, top: 40 }  
  }//else {
  //  return { left: 10, top: 20 }
  //}
}

IconFactory.prototype.createLeafletIcon = function(type, options = {}){

  var svgIcon = this.createSvgIcon(type, {
    width: 20,
    height: 20, 
    ...options,
  })

  // Do a bit of trickery to change the icon to an svg
  var anchorPos = this.getIconAnchorPos(type) || {}
  var icon = L.icon({
    iconUrl: 'test',
    iconSize: [options.width || 20, options.height || 20],
    iconAnchor: [(anchorPos.left || (options.width || 20) / 2), (anchorPos.top || (options.height || 20) / 2)],
  })
  
  // Override the internal method so that we can return an svg
  
  icon._createIcon = function(name, oldIcon){
    var src = this._getIconUrl(name);

    if (!src) {
      if (name === 'icon') {
        throw new Error('iconUrl not set in Icon options (see the docs).');
      }
      return null;
    }

    var img = svgIcon
    this._setIconStyles(img, name);

    return img;
  }

  return icon
}

IconFactory.prototype.createHiddenLeafletIcon = function(){
  return this.createLeafletIcon(null, { width: 0, height: 0})
}

var instance = new IconFactory
export default instance
