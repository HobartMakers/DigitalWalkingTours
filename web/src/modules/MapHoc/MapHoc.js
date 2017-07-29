import React, { Component } from 'react'
import L from 'leaflet'

class MapHoc extends Component {

  load = () => {

    const { container } = this.props
    if (!container)
      throw new Error('MapHoc requires a container prop to render the map in')

    this.map = L.map(container)

    this.map.on('locationerror', (e) => this.onLocationError(e))

    this.map.on('locationfound', (e) => this.onLocationFound(e));
    //map.on('locationerror', that.onLocationError);

    this.map.locate({setView: true, maxZoom: 16,});

    // Load tiles
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(this.map);

    window.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }



  render = () => {
    const { children } = this.props
    return React.Children.only(children)
  }
}

export default MapHoc