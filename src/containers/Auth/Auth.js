import React, { Component } from 'react'
import Input from '../../components/UI/Input/input'
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css'
import * as actions from '../../Store/actions/index'
import { connect } from 'react-redux';
import Spinner from '../../components/UI/spinner/Spinner';
import { Redirect } from 'react-router-dom';

class Auth extends Component {

   state = {
      controls: {
         email: {
            elementType: 'input',
            elementConfig: {
               type: 'email',
               placeholder: "Your Email"
            },
            value: '',
            validation: {
               required: true,
               isEmail: true
            },
            valid: false,
            touched: false
         },
         password: {
            elementType: 'input',
            elementConfig: {
               type: 'password',
               placeholder: "Password"
            },
            value: '',
            validation: {
               required: true,
               minLength: 6
            },
            valid: false,
            touched: false
         },
      },
      isSignUp: true
   }

   componentDidMount() {
      if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
         this.props.onSetAuthRedirectPath()
      }
   }
   checkValidity(value, rules) {
      let isValid = true
      if (!rules) {
         return true
      }
      if (rules.required) {
         isValid = (value.trim() !== '') && isValid
      }
      if (rules.minLength) {
         isValid = (value.length >= rules.minLength) && isValid
      }
      if (rules.maxLength) {
         isValid = (value.length <= rules.maxLength) && isValid
      }
      return isValid
   }

   switchAuthModeHandler = () => {
      this.setState(prevState => {
         return {
            isSignUp: !prevState.isSignUp
         }
      })
   }

   inputChangedHandler = (event, controlName) => {
      const updatedControls = {
         ...this.state.controls,
         [controlName]: {
            ...this.state.controls[controlName],
            value: event.target.value,
            valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
            touched: true
         }
      }
      this.setState({ controls: updatedControls })

   }

   submitHandler = (event) => {
      event.preventDefault();
      this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
   }



   render() {
      let formElementArray = [];
      for (let key in this.state.controls) {
         formElementArray.push({
            id: key,
            config: this.state.controls[key]
         })
      }
      let form = formElementArray.map(formElement => (
         <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)} />

      ))

      if (this.props.loading) {
         form = <Spinner />
      }

      let errorMessage = null;
      if (this.props.error) {
         if (this.props.error.message === "INVALID_EMAIL") {
            errorMessage = (
               <p className={classes.InvalidCredentials}>{"Invalid Email"}</p>
            )
         }
         if (this.props.error.message === "EMAIL_NOT_FOUND") {
            errorMessage = (
               <p className={classes.InvalidCredentials}>{"Email Not Found"}</p>
            )
         }
         if (this.props.error.message === "INVALID_PASSWORD") {
            errorMessage = (
               <p className={classes.InvalidCredentials}>{"Password Not Valid"}</p>
            )
         }
         if (this.props.error.message === "EMAIL_EXISTS") {
            errorMessage = (
               <p className={classes.InvalidCredentials}>{"Email Exists"}</p>
            )
         }
         if (this.props.error.message === "WEAK_PASSWORD : Password should be at least 6 characters") {
            errorMessage = (
               <p className={classes.InvalidCredentials}>{"Password Must Be 5 Character Long"}</p>
            )
         }

      }
      let authRedirect = null
      if (this.props.isAuthenticated) {
         authRedirect = <Redirect to={this.props.authRedirectPath} />
      }
      return (
         <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <form onSubmit={this.submitHandler}>
               {form}

               <Button btnType="Success">Submit</Button>

            </form>

            <Button
               clicked={this.switchAuthModeHandler}
               btnType="Danger"
            >SWITCH TO {this.state.isSignUp ? 'SIGNIN' : "SIGNUP"}</Button>

         </div>
      )
   }

}

const mapStateToProps = state => {
   return {
      loading: state.auth.loading,
      error: state.auth.error,
      isAuthenticated: state.auth.token !== null,
      buildingBurger: state.burgerBuilder.building,
      authRedirectPath: state.auth.authRedirect

   }
}

const mapDispatchToProps = dispatch => {
   return {
      onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
      onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(Auth)