import React, { Component } from 'react'
import injectStyles from 'react-jss'
import classNames from 'classnames'

const styles = {
  button: {
    color: 'white',
    height: 48,
    cursor: 'pointer',
    border: 'none',
    padding: '0 20px',
    fontSize: 12,
    minWidth: 160,
    boxSizing: 'border-box',
    borderRadius: 3,
    textTransform: 'uppercase',
    backgroundColor: '#00addf',
  },
}

class Button extends Component {
  render = () => {
    const { classes, className, children, } = this.props
    return <button className={classNames(classes.button, className)}>
      {children}
    </button>
  }
}

export default injectStyles(styles)(Button)
