import React from 'react'
import classNames from 'classnames'
import './Loader.css'

const Loader = ({ className, ...otherProps }) => <div id="fountainG" {...otherProps} className={className}>
	<div id="fountainG_1" className="fountainG"></div>
	<div id="fountainG_2" className="fountainG"></div>
	<div id="fountainG_3" className="fountainG"></div>
	<div id="fountainG_4" className="fountainG"></div>
	<div id="fountainG_5" className="fountainG"></div>
	<div id="fountainG_6" className="fountainG"></div>
	<div id="fountainG_7" className="fountainG"></div>
	<div id="fountainG_8" className="fountainG"></div>
</div>

export default Loader