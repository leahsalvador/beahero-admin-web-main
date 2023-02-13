import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import login from '../components/login/reducers';
import riders from '../components/riders/reducers';
import customers from '../components/customers/reducers';
import categories from '../components/categories/reducers';
import products from '../components/products/reducers';
import merchants from '../components/merchants/reducers';
import orders from '../components/orders/reducers';
import rates from '../components/rates/reducers';
import profile from '../components/profile/reducers';

const rootReducer = combineReducers({
  form,
  login,
  riders,
  customers,
  categories,
  products,
  merchants,
  orders,
  rates,
  profile
});

export default rootReducer;
