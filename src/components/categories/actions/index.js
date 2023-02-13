import Axios from 'axios';
import { headers } from '../../../utilities/token';

const GET_CATEGORIES = 'GET_CATEGORIES';
const GET_CATEGORIES_FULFILLED = 'GET_CATEGORIES_FULFILLED';
const GET_CATEGORIES_REJECTED = 'GET_CATEGORIES_REJECTED';

const GET_CATEGORIES_MERCHANT = 'GET_CATEGORIES_MERCHANT';
const GET_CATEGORIES_MERCHANT_FULFILLED = 'GET_CATEGORIES_MERCHANT_FULFILLED';
const GET_CATEGORIES_MERCHANT_REJECTED = 'GET_CATEGORIES_MERCHANT_REJECTED';

const CREATE_CATEGORY = 'CREATE_CATEGORY';
const CREATE_CATEGORY_FULFILLED = 'CREATE_CATEGORY_FULFILLED';
const CREATE_CATEGORY_REJECTED = 'CREATE_CATEGORY_REJECTED';

const DELETE_CATEGORY = 'DELETE_CATEGORY';
const DELETE_CATEGORY_FULFILLED = 'DELETE_CATEGORY_FULFILLED';
const DELETE_CATEGORY_REJECTED = 'DELETE_CATEGORY_REJECTED';

const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
const UPDATE_CATEGORY_FULFILLED = 'UPDATE_CATEGORY_FULFILLED';
const UPDATE_CATEGORY_REJECTED = 'UPDATE_CATEGORY_REJECTED';

const GET_MERCHANTS = 'GET_MERCHANTS';
const GET_MERCHANTS_FULFILLED = 'GET_MERCHANTS_FULFILLED';
const GET_MERCHANTS_REJECTED = 'GET_MERCHANTS_REJECTED';

const API_URL = process.env.REACT_APP_API_BASE_URL;

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

export const fetchCategoriesMerchant = (merchantId) => {
  return (dispatch) => {
    dispatch({
      type: GET_CATEGORIES_MERCHANT,
    });
    return Axios.get(`${API_URL}/categories-merchant/${merchantId}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_CATEGORIES_MERCHANT_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_CATEGORIES_MERCHANT_REJECTED,
          payload: error,
        });
      });
  };
};

export const createCategory = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_CATEGORY,
      payload: { data },
    });
    return Axios.post(`${API_URL}/category`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: CREATE_CATEGORY_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: CREATE_CATEGORY_REJECTED,
          payload: error,
        });
      });
  };
};

export const deleteCategory = (id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_CATEGORY,
    });
    return Axios.delete(`${API_URL}/category/${id}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: DELETE_CATEGORY_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: DELETE_CATEGORY_REJECTED,
          payload: error,
        });
      });
  };
};

export const updateCategory = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CATEGORY,
    });
    return Axios.put(`${API_URL}/category/${data.id}`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: UPDATE_CATEGORY_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: UPDATE_CATEGORY_REJECTED,
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
