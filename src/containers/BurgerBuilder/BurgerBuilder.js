import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from 'E:/app/react-guide/burger-builder/src/components/Burger/BuildControls/BuildControls.js';
import Modal from '../../components/UI/Model/modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../Store/actions/index';



class BurgerBuilder extends Component {
   state = {
      purchasing: false,
   }

   componentDidMount() {
      this.props.onInitIngredients()
   }

   updatePurchaseState(ingredients) {
      const sum = Object.keys(ingredients)
         .map(igKey => {
            return ingredients[igKey];
         })
         .reduce((sum, el) => {
            return sum + el;
         }, 0);
      return sum > 0;
   }

   purchaseHandler = () => {
      if (this.props.isAuthenticated) {
         this.setState({ purchasing: true })
      }else{
         this.props.onSetAuthRedirectPath('/checkout')
         this.props.history.push('/auth')
      }
   }
   purchaseCancelHandler = () => {
      this.setState({ purchasing: false })
   }

   purchaseContinueHandler = () => {
      this.props.onInitPurchased();
      this.props.history.push('/checkout')
   }

   render() {
      const disabledInfo = {
         ...this.props.ings
      };
      for (let key in disabledInfo) {
         disabledInfo[key] = disabledInfo[key] <= 0;
      }
      let orderSummary = null;

      let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />

      if (this.props.ings) {
         burger = (
            <Aux>
               <Burger ingredients={this.props.ings} />
               <BuildControls
                  ingredientAdded={this.props.onIngredientAdded}
                  ingredientsRemove={this.props.onIngredientRemoved}
                  disable={disabledInfo}
                  purchasable={this.updatePurchaseState(this.props.ings)}
                  price={this.props.totalPrice}
                  ordered={this.purchaseHandler}
                  isAuth={this.props.isAuthenticated} />
            </Aux>
         );

         orderSummary = <OrderSummary
            price={this.props.totalPrice}
            ingredients={this.props.ings}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
      }


      return (
         <Aux>
            <Modal show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
               {orderSummary}
            </Modal>
            {burger}
         </Aux>
      );
   }
}

const mapStateToProps = state => {
   return {
      ings: state.burgerBuilder.ingredients,
      totalPrice: state.burgerBuilder.totalPrice,
      error: state.burgerBuilder.error,
      isAuthenticated: state.auth.token
   };
}


const mapDispatchToProps = dispatch => {
   return {
      onIngredientAdded: (ingName) => dispatch(actions.addIngredients(ingName)),
      onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
      onInitIngredients: () => dispatch(actions.initIngredients()),
      onInitPurchased: () => dispatch(actions.purchaseInit()),
      onSetAuthRedirectPath: (path)=>dispatch(actions.setAuthRedirectPath(path))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));