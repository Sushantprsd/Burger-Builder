import React, { Component } from 'react';
import Model from '../../components/UI/Model/modal';
import Aux from '../Auxiliary/Auxiliary'

const withErrorHandler = (WrappedComponent, axios) => {
   return class extends Component {
      state = {
         error: null
      }
      componentDidMount() {
         this.requestInterceptor = axios.interceptors.request.use(req => {
            this.setState({ error: null });
            return req
         })
         this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
            this.setState({ error: error })
         })
      }
      componentWillUnmount() {
         axios.interceptors.request.eject(this.requestInterceptor)
         axios.interceptors.response.eject(this.responseInterceptor)
      }

      errorConfirmedHandler = () => {
         return this.setState({ error: null })
      }

      render() {
         return (
            <Aux>
               <Model show={this.state.error} modelClosed={this.errorConfirmedHandler}>
                  {this.state.error ? this.state.error.message : null}
               </Model>
               <WrappedComponent {...this.props} />

            </Aux>
         );
      }
   }
}
export default withErrorHandler