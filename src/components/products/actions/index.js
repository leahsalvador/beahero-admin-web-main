import Axios from 'axios';
import { headers } from '../../../utilities/token';

const GET_PRODUCTS = 'GET_PRODUCTS';
const GET_PRODUCTS_FULFILLED = 'GET_PRODUCTS_FULFILLED';
const GET_PRODUCTS_REJECTED = 'GET_PRODUCTS_REJECTED';

const GET_PRODUCTS_MERCHANT = 'GET_PRODUCTS_MERCHANT';
const GET_PRODUCTS_MERCHANT_FULFILLED = 'GET_PRODUCTS_MERCHANT_FULFILLED';
const GET_PRODUCTS_MERCHANT_REJECTED = 'GET_PRODUCTS_MERCHANT_REJECTED';

const GET_CATEGORIES = 'GET_CATEGORIES';
const GET_CATEGORIES_FULFILLED = 'GET_CATEGORIES_FULFILLED';
const GET_CATEGORIES_REJECTED = 'GET_CATEGORIES_REJECTED';

const CREATE_PRODUCT = 'CREATE_PRODUCT';
const CREATE_PRODUCT_FULFILLED = 'CREATE_PRODUCT_FULFILLED';
const CREATE_PRODUCT_REJECTED = 'CREATE_PRODUCT_REJECTED';

const DELETE_PRODUCT = 'DELETE_PRODUCT';
const DELETE_PRODUCT_FULFILLED = 'DELETE_PRODUCT_FULFILLED';
const DELETE_PRODUCT_REJECTED = 'DELETE_PRODUCT_REJECTED';

const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
const UPDATE_PRODUCT_FULFILLED = 'UPDATE_PRODUCT_FULFILLED';
const UPDATE_PRODUCT_REJECTED = 'UPDATE_PRODUCT_REJECTED';

const GET_MERCHANTS = 'GET_MERCHANTS';
const GET_MERCHANTS_FULFILLED = 'GET_MERCHANTS_FULFILLED';
const GET_MERCHANTS_REJECTED = 'GET_MERCHANTS_REJECTED';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchProducts = () => {
  return (dispatch) => {
    dispatch({
      type: GET_PRODUCTS,
    });
    return Axios.get(`${API_URL}/products`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_PRODUCTS_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_PRODUCTS_REJECTED,
          payload: error,
        });
      });
  };
};

export const fetchProductsMerchant = (merchantId) => {
  return (dispatch) => {
    dispatch({
      type: GET_PRODUCTS_MERCHANT,
    });
    return Axios.get(`${API_URL}/products-merchant/${merchantId}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_PRODUCTS_MERCHANT_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_PRODUCTS_MERCHANT_REJECTED,
          payload: error,
        });
      });
  };
};

export const fetchCategories = () => {
  return (dispatch) => {
    dispatch({
      type: GET_CATEGORIES,
    });
    return Axios.get(`${API_URL}/categories`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_CATEGORIES_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_CATEGORIES_REJECTED,
          payload: error,
        });
      });
  };
};

export const createProduct = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_PRODUCT,
      payload: { data },
    });
    return Axios.post(`${API_URL}/product`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: CREATE_PRODUCT_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: CREATE_PRODUCT_REJECTED,
          payload: error,
        });
      });
  };
};

export const deleteProduct = (id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_PRODUCT,
    });
    return Axios.delete(`${API_URL}/product/${id}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: DELETE_PRODUCT_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: DELETE_PRODUCT_REJECTED,
          payload: error,
        });
      });
  };
};

export const updateProduct = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PRODUCT,
    });
    return Axios.put(`${API_URL}/product/${data.id}`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: UPDATE_PRODUCT_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: UPDATE_PRODUCT_REJECTED,
          payload: error,
        });
      });
  };
};

export const fetchMerchants = () => {
  return (dispatch) => {
    dispatch({
      type: GET_MERCHANTS,
    });
    return Axios.get(`${API_URL}/merchants`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_MERCHANTS_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_MERCHANTS_REJECTED,
          payload: error,
        });
      });
  };
};
