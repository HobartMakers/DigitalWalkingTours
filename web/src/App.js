import React, { Component } from 'react'
import logo from './logo.svg'
import injectStyles from 'react-jss'
import Button from './modules/Button'

const styles = {
  app: {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${require('./testMap.png')})`,
    backgroundSize: 'cover',
  },
  buttonContainer: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    height: 0,
    width: '100vw',
  },
  buttonContainerInner: {
    position: 'relative',
  },
  startTourButton: {
    position: 'relative',
    margin: '0 auto',
    top: -(48 + 20),
  },
}

class App extends Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.app}>
        <div className={classes.buttonContainer}>
          <div className={classes.buttonContainerInner}>
            <Button className={classes.startTourButton} />
          </div>
        </div>
      </div>
    );
  }
}

export default injectStyles(styles)(App)

