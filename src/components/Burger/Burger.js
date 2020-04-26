import React from 'react';
import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import {withRouter} from 'react-router-dom'

const Burger = (props) => {
   let transformedIngredient = Object.keys(props.ingredients)//it will give an array of key and values are not passed
      .map(igKey =>{
         return [...Array(props.ingredients[igKey])].map((_, i)=>{
            return <BurgerIngredient key={igKey + i} type={igKey} />
         })
      })
      .reduce((arr,i)=>{
         return arr.concat(i);
      },[]);

      if(transformedIngredient.length === 0){
         transformedIngredient = <p>Please Start Adding Ingredients</p>;
      }

   return (
      <div className={classes.Burger}>
         <BurgerIngredient type='bread-top' />
         {transformedIngredient}
         <BurgerIngredient type='bread-bottom'/>    
      </div>
   );
};

export default withRouter(Burger);