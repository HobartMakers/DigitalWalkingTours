import React, { Component } from 'react'
import injectStyles from 'react-jss'

const styles = {
  container: {
    boxSizing: 'border-box',
    padding: 10,
    position: 'relative',
    fontSize: 12,
    '@global': {
      h2: {
        fontWeight: 'normal',
        fontSize: 22,
      },
      img: {
        maxWidth: '100%',
        marginBottom: 10,
        borderRadius: 2,
      },
    },
  }
}

class POIOverview extends Component {
  render = () => {
    const { title, images, content, classes } = this.props
    return <div className={classes.container}>
      <h2>{title}</h2>
      {formatImages(images)}
      {formatContent(content)}
    </div>
  }
}

function formatImages(images = []){
  if (images[0])
    return <img key={images[0]} src={images[0]} />
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

export default injectStyles(styles)(POIOverview)
