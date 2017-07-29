import React, { Component } from 'react'
import injectStyles from 'react-jss'
import Button from './../Button'
import classNames from 'classnames'
import POIOverview from './../POIOverview'

const styles = {
  sideMenu: {
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    width: '50%',
    backgroundColor: 'white',
    top: 0,
    right: 0,
    borderLeft: '1px solid #00addf',
    zIndex: 402,
    boxSizing: 'border-box',
  },
}

class SideMenu extends Component {

  render = () => {
    const { 
      classes, 
      className, 
      poiImages,
      poiContent,
      poiTitle,
      ...otherProps, 
    } = this.props
    return <div 
      {...otherProps}
      className={classNames(classes.sideMenu, className)}
    >
      {/*<Button>Art</Button>
      <Button>Heritage</Button>
      <Button>Museums</Button>*/}
      <POIOverview images={poiImages} content={poiContent} title={poiTitle} />
    </div>
  }
}

export default injectStyles(styles)(SideMenu)
