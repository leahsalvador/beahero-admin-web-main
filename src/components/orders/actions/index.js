import Axios from 'axios';
import { headers } from '../../../utilities/token';

const UPDATE_TRANSACTION_STATUS = 'UPDATE_TRANSACTION_STATUS';
const UPDATE_TRANSACTION_STATUS_FULFILLED =
  'UPDATE_TRANSACTION_STATUS_FULFILLED';
const UPDATE_TRANSACTION_STATUS_REJECTED = 'UPDATE_TRANSACTION_STATUS_REJECTED';

const GET_MERCHANT_TRANSACTIONS = 'GET_MERCHANT_TRANSACTIONS';
const GET_MERCHANT_TRANSACTIONS_FULFILLED = 'GET_MERCHANT_TRANSACTIONS_FULFILLED';
const GET_MERCHANT_TRANSACTIONS_REJECTED = 'GET_MERCHANT_TRANSACTIONS_REJECTED';

const GET_MERCHANTS = 'GET_MERCHANTS';
const GET_MERCHANTS_FULFILLED = 'GET_MERCHANTS_FULFILLED';
const GET_MERCHANTS_REJECTED = 'GET_MERCHANTS_REJECTED';

const API_URL = process.env.REACT_APP_API_BASE_URL;


export const updateTransactionStatus = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_TRANSACTION_STATUS,
    });
    return Axios.put(`${API_URL}/transaction-status/${data.id}`, data, {
      headers,
    })
      .then(function () {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS_FULFILLED,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: UPDATE_TRANSACTION_STATUS_REJECTED,
          payload: error,
        });
      });
  };
};

export const fetchMerchantTransactions = (merchantId) => {
  return (dispatch) => {
    dispatch({
      type: GET_MERCHANT_TRANSACTIONS,
    });
    return Axios.get(`${API_URL}/merchant-transactions/${merchantId}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_MERCHANT_TRANSACTIONS_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_MERCHANT_TRANSACTIONS_REJECTED,
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
