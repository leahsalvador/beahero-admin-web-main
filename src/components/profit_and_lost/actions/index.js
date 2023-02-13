import Axios from "axios";

const GET_CUSTOMERS = "GET_CUSTOMERS";
const GET_CUSTOMERS_FULFILLED = "GET_CUSTOMERS_FULFILLED";
const GET_CUSTOMERS_REJECTED = "GET_CUSTOMERS_REJECTED";

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchCustomers = () => {
  return (dispatch) => {
    dispatch({
      type: GET_CUSTOMERS
    });
    return Axios.get(`${API_URL}/customers`, {
      accept: "application/json",
      "Content-Type": "application/json",
    })
      .then(function (response) {
        dispatch({
          type: GET_CUSTOMERS_FULFILLED,
          payload: response.data,
        });
        return response.data
      })
      .catch(function (error) {
        dispatch({
          type: GET_CUSTOMERS_REJECTED,
          payload: error,
        });
      });
  };
};

