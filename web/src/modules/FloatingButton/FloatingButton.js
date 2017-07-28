import React, { Component } from 'react'
import classNames from 'classnames'
import injectStyles from 'react-jss'

const styles = {
  button: {
    height: 48,
    width: 48,
    borderRadius: '50%',
    color: 'white',
    backgroundColor: '#00addf',
    border: 'none',
  },
}

class FloatingButton extends Component {
  render = () => {
    const { classes, children, className, ...otherProps } = this.props
    return <button 
      className={classNames(classes.button, className)}
      {...otherProps}
    >
      {children}
    </button>
  }
}

export default injectStyles(styles)(FloatingButton)
