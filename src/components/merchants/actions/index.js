import Axios from 'axios';
import { headers } from '../../../utilities/token';

const GET_MERCHANTS = 'GET_MERCHANTS';
const GET_MERCHANTS_FULFILLED = 'GET_MERCHANTS_FULFILLED';
const GET_MERCHANTS_REJECTED = 'GET_MERCHANTS_REJECTED';

const CREATE_MERCHANT = 'CREATE_MERCHANT';
const CREATE_MERCHANT_FULFILLED = 'CREATE_MERCHANT_FULFILLED';
const CREATE_MERCHANT_REJECTED = 'CREATE_MERCHANT_REJECTED';

const UPDATE_MERCHANT = 'UPDATE_MERCHANT';
const UPDATE_MERCHANT_FULFILLED = 'UPDATE_MERCHANT_FULFILLED';
const UPDATE_MERCHANT_REJECTED = 'UPDATE_MERCHANT_REJECTED';

const DELETE_MERCHANT = 'DELETE_MERCHANT';
const DELETE_MERCHANT_FULFILLED = 'DELETE_MERCHANT_FULFILLED';
const DELETE_MERCHANT_REJECTED = 'DELETE_MERCHANT_REJECTED';

const API_URL = process.env.REACT_APP_API_BASE_URL;

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

export const createMerchant = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_MERCHANT,
      payload: { data },
    });
    return Axios.post(`${API_URL}/merchant`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: CREATE_MERCHANT_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: CREATE_MERCHANT_REJECTED,
          payload: error,
        });
      });
  };
};

export const deleteMerchant = (id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_MERCHANT,
    });
    return Axios.delete(`${API_URL}/merchant/${id}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: DELETE_MERCHANT_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: DELETE_MERCHANT_REJECTED,
          payload: error,
        });
      });
  };
};

export const updateMerchant = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_MERCHANT,
    });
    return Axios.put(`${API_URL}/merchant/${data.id}`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: UPDATE_MERCHANT_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: UPDATE_MERCHANT_REJECTED,
          payload: error,
        });
      });
  };
};
