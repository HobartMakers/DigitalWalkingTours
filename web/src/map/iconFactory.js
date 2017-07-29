import React from 'react'
import PLACE_TYPE from './PLACE_TYPE'
import MuseumIcon from './../modules/icons/Museum'
import ReactDOM from 'react-dom'
import MarkerIcon from './../modules/icons/Marker'
import L from 'leaflet'

function IconFactory(){

}


/**
 * Returns a dom element. Leaflet requires a DOM node
 */
IconFactory.prototype.createSvgIcon = function(placeType, iconOptions = {}){

  var div = document.createElement('div')
  div.style.display = 'inline-block'

  var { width, height, color } = iconOptions

  if (placeType == PLACE_TYPE.MUSEUM){
    var Icon = MuseumIcon
  } else {
    var Icon = MarkerIcon
  }

  ReactDOM.render(<Icon 
    width={width} 
    height={height} 
    fill={color} 
  />, div)
  return div
}

IconFactory.prototype.getIconAnchorPos = function(placeType){
  if (placeType == PLACE_TYPE.MUSEUM){
    return { left: 10, top: 10 }
  } else {
    return { left: 10, top: 20 }
  }
}

IconFactory.prototype.createLeafletIcon = function(type, options = {}){
  var svgIcon = this.createSvgIcon(type, {
    width: 20,
    height: 20, 
    ...options,
  })

  // Do a bit of trickery to change the icon to an svg
  var anchorPos = this.getIconAnchorPos(type)
  var icon = L.icon({
    iconUrl: 'test',
    iconSize: [20, 20],
    iconAnchor: [anchorPos.left, anchorPos.top],
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

var instance = new IconFactory
export default instance