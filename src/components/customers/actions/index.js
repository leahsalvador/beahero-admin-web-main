import Axios from 'axios';
import { headers } from '../../../utilities/token';

const GET_CUSTOMERS = 'GET_CUSTOMERS';
const GET_CUSTOMERS_FULFILLED = 'GET_CUSTOMERS_FULFILLED';
const GET_CUSTOMERS_REJECTED = 'GET_CUSTOMERS_REJECTED';

const CREATE_CUSTOMER = 'CREATE_CUSTOMER';
const CREATE_CUSTOMER_FULFILLED = 'CREATE_CUSTOMER_FULFILLED';
const CREATE_CUSTOMER_REJECTED = 'CREATE_CUSTOMER_REJECTED';

const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
const UPDATE_CUSTOMER_FULFILLED = 'UPDATE_CUSTOMER_FULFILLED';
const UPDATE_CUSTOMER_REJECTED = 'UPDATE_CUSTOMER_REJECTED';

const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
const DELETE_CUSTOMER_FULFILLED = 'DELETE_CUSTOMER_FULFILLED';
const DELETE_CUSTOMER_REJECTED = 'DELETE_CUSTOMER_REJECTED';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchCustomers = () => {
  return (dispatch) => {
    dispatch({
      type: GET_CUSTOMERS,
    });
    return Axios.get(`${API_URL}/customers`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_CUSTOMERS_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_CUSTOMERS_REJECTED,
          payload: error,
        });
      });
  };
};

export const createCustomer = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_CUSTOMER,
      payload: { data },
    });
    return Axios.post(`${API_URL}/customer`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: CREATE_CUSTOMER_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: CREATE_CUSTOMER_REJECTED,
          payload: error,
        });
      });
  };
};

export const deleteCustomer = (id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_CUSTOMER,
    });
    return Axios.delete(`${API_URL}/customer/${id}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: DELETE_CUSTOMER_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: DELETE_CUSTOMER_REJECTED,
          payload: error,
        });
      });
  };
};

export const updateCustomer = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CUSTOMER,
    });
    return Axios.put(`${API_URL}/customer/${data.id}`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: UPDATE_CUSTOMER_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: UPDATE_CUSTOMER_REJECTED,
          payload: error,
        });
      });
  };
};
