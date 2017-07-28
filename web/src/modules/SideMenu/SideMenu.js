import React, { Component } from 'react'
import injectStyles from 'react-jss'
import { Motion, spring } from 'react-motion'
import Button from './../Button'

const styles = {
  sideMenu: {
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    width: 160,
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
    const { classes, open } = this.props
    console.log(open)
    return <Motion 
      defaultStyle={{
        menuX: 160,
      }} 
      style={{
        menuX: spring(open ? 0 : 160),
      }}
    >
      {value => <div 
        className={classes.sideMenu}
        style={{transform: `translateX(${value.menuX}px)`}} 
      >
        <Button>Art</Button>
        <Button>Heritage</Button>
        <Button>Museums</Button>
      </div>}
    </Motion>
  }
}

export default injectStyles(styles)(SideMenu)
