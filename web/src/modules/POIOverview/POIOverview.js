import React, { Component } from 'react'

class POIOverview extends Component {
  render = () => {
    const { images, content } = this.props
    return <div>
      {formatImages(images)}
      {formatContent(content)}
    </div>
  }
}

function formatImages(images = []){
  if (images[0])
    return <img src={images[0]} />
  return null
}

function formatContent(content = ''){
  return content.split('\n').map(c => {
    return <div>
      {c}
      <br />
    </div>
  })
}

export default POIOverview