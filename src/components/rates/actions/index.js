import Axios from 'axios';
import { headers } from '../../../utilities/token';

const GET_RATES = 'GET_RATES';
const GET_RATES_FULFILLED = 'GET_RATES_FULFILLED';
const GET_RATES_REJECTED = 'GET_RATES_REJECTED';

const POST_RATES = 'POST_RATES';
const POST_RATES_FULFILLED = 'POST_RATES_FULFILLED';
const POST_RATES_REJECTED = 'POST_RATES_REJECTED';


const API_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchRates = () => {
  return (dispatch) => {
    dispatch({
      type: GET_RATES,
    });
    return Axios.get(`${API_URL}/rates`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_RATES_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_RATES_REJECTED,
          payload: error,
        });
      });
  };
};

export const postRates = (data) => {
  return (dispatch) => {
    dispatch({
      type: POST_RATES,
      payload: { data },
    });
    return Axios.post(`${API_URL}/rate`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: POST_RATES_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: POST_RATES_REJECTED,
          payload: error,
        });
      });
  };
};


