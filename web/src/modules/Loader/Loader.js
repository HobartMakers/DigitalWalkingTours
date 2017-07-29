import React from 'react'
import classNames from 'classnames'
import './Loader.css'

const Loader = ({ className, ...otherProps }) => <div id="fountainG" {...otherProps} className={className}>
	<div id="fountainG_1" class="fountainG"></div>
	<div id="fountainG_2" class="fountainG"></div>
	<div id="fountainG_3" class="fountainG"></div>
	<div id="fountainG_4" class="fountainG"></div>
	<div id="fountainG_5" class="fountainG"></div>
	<div id="fountainG_6" class="fountainG"></div>
	<div id="fountainG_7" class="fountainG"></div>
	<div id="fountainG_8" class="fountainG"></div>
  Loading...
</div>

export default Loader