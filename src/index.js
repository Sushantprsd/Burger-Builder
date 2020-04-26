import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import burgerBuilderReducer from './Store/reducers/burgerBuilder'
import orderReducer from './Store/reducers/order';
import authReducer from './Store/reducers/auth'
import * as serviceWorker from './serviceWorker';
import thunk from 'redux-thunk';


const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :null|| compose;

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order:orderReducer,
  auth:authReducer
})

const store = createStore(rootReducer,composeEnhancers(
  applyMiddleware(thunk)
))

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();
