import Axios from 'axios';
import { headers } from '../../../utilities/token';

const GET_RIDERS = 'GET_RIDERS';
const GET_RIDERS_FULFILLED = 'GET_RIDERS_FULFILLED';
const GET_RIDERS_REJECTED = 'GET_RIDERS_REJECTED';

const CREATE_RIDER = 'CREATE_RIDER';
const CREATE_RIDER_FULFILLED = 'CREATE_RIDER_FULFILLED';
const CREATE_RIDER_REJECTED = 'CREATE_RIDER_REJECTED';

const UPDATE_RIDER = 'UPDATE_RIDER';
const UPDATE_RIDER_FULFILLED = 'UPDATE_RIDER_FULFILLED';
const UPDATE_RIDER_REJECTED = 'UPDATE_RIDER_REJECTED';

const DELETE_RIDER = 'DELETE_RIDER';
const DELETE_RIDER_FULFILLED = 'DELETE_RIDER_FULFILLED';
const DELETE_RIDER_REJECTED = 'DELETE_RIDER_REJECTED';

const CREATE_WALLET = 'CREATE_WALLET';
const CREATE_WALLET_FULFILLED = 'CREATE_WALLET_FULFILLED';
const CREATE_WALLET_REJECTED = 'CREATE_WALLET_REJECTED';

const UPDATE_WALLET = 'UPDATE_WALLET';
const UPDATE_WALLET_FULFILLED = 'UPDATE_WALLET_FULFILLED';
const UPDATE_WALLET_REJECTED = 'UPDATE_WALLET_REJECTED';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchRiders = () => {
  return (dispatch) => {
    dispatch({
      type: GET_RIDERS,
    });
    return Axios.get(`${API_URL}/riders`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_RIDERS_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_RIDERS_REJECTED,
          payload: error,
        });
      });
  };
};

export const createRider = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_RIDER,
      payload: { data },
    });
    return Axios.post(`${API_URL}/rider`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: CREATE_RIDER_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: CREATE_RIDER_REJECTED,
          payload: error,
        });
      });
  };
};

export const deleteRider = (id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_RIDER,
    });
    return Axios.delete(`${API_URL}/rider/${id}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: DELETE_RIDER_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: DELETE_RIDER_REJECTED,
          payload: error,
        });
      });
  };
};

export const updateRider = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_RIDER,
    });
    return Axios.put(`${API_URL}/rider/${data.id}`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: UPDATE_RIDER_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: UPDATE_RIDER_REJECTED,
          payload: error,
        });
      });
  };
};

export const createWallet = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_WALLET,
      payload: { data },
    });
    return Axios.post(`${API_URL}/wallet`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: CREATE_WALLET_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: CREATE_WALLET_REJECTED,
          payload: error,
        });
      });
  };
};

export const updateWallet = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_WALLET,
    });
    return Axios.put(`${API_URL}/wallet/${data.walletId}`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: UPDATE_WALLET_FULFILLED,
          payload: response.data,
        });
        return;
      })
      .catch(function (error) {
        dispatch({
          type: UPDATE_WALLET_REJECTED,
          payload: error,
        });
      });
  };
};
