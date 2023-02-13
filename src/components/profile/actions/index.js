import Axios from 'axios';
import { headers } from '../../../utilities/token';

const GET_PROFILE = 'GET_PROFILE';
const GET_PROFILE_FULFILLED = 'GET_PROFILE_FULFILLED';
const GET_PROFILE_REJECTED = 'GET_PROFILE_REJECTED';

const EDIT_PROFILE = 'EDIT_PROFILE';
const EDIT_PROFILE_FULFILLED = 'EDIT_PROFILE_FULFILLED';
const EDIT_PROFILE_REJECTED = 'EDIT_PROFILE_REJECTED';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const getProfile = (id) => {
  return (dispatch) => {
    dispatch({
      type: GET_PROFILE,
    });
    return Axios.get(`${API_URL}/merchant/${id}`, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: GET_PROFILE_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: GET_PROFILE_REJECTED,
          payload: error,
        });
      });
  };
};


export const editProfile = (data) => {
  return (dispatch) => {
    dispatch({
      type: EDIT_PROFILE,
      payload: { data },
    });
    return Axios.put(`${API_URL}/merchant/${data.id}`, data, {
      headers,
    })
      .then(function (response) {
        dispatch({
          type: EDIT_PROFILE_FULFILLED,
          payload: response.data,
        });
        return response.data;
      })
      .catch(function (error) {
        dispatch({
          type: EDIT_PROFILE_REJECTED,
          payload: error,
        });
      });
  };
};
