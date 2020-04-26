import * as actionTypes from './actionsTypes'
import axios from '../../axios-order'
// import axios from 'axios  '


export const addIngredients = (name) => {
   return {
      type: actionTypes.ADD_INGREDIENT,
      ingredientName: name
   }
}

export const removeIngredient = (name) => {
   return {
      type: actionTypes.REMOVE_INGREDIENT,
      ingredientName: name
   }
}

export const setIngredients = (ingredients) => {
   return {
      type:actionTypes.SET_INGREDIENTS,
      ingredients: ingredients
   };
};

export const fetchIngredientsFailed = ()=>{
   return {
      type:actionTypes.FETCH_INGREDIENTS_FAILED,
   }
}

export const initIngredients = () => {
   return dispatch => {
      axios.get("/ingredients.json")
         .then(response => {
            dispatch(setIngredients(response.data))
         })
         .catch(err => {
            dispatch(fetchIngredientsFailed())
         })
   };
}; 