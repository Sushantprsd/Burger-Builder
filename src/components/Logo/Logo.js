import React from 'react'
import burgerLogo from '../../assets/images/27.1 burger-logo.png';
import classes from './Logo.css'


const Logo = (props)=>(
   <div className={classes.Logo}>
      <img src={burgerLogo} alt="MyBurger" />
   </div>
)

export default Logo;