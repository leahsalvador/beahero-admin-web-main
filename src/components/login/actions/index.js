import Axios from 'axios'

const POST_LOGIN_DATA = 'POST_LOGIN_DATA'
const POST_LOGIN_DATA_FULFILLED = 'POST_LOGIN_DATA_FULFILLED'
const POST_LOGIN_DATA_REJECTED = 'POST_LOGIN_DATA_REJECTED'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const submitLogin = (data) => {
  return dispatch => {
    dispatch({
      type: POST_LOGIN_DATA,
      payload: {}
    })
    return Axios.post(`${API_URL}/login`, { ...data })
      .then(function (response) {
        console.log("LOGS", response.data.token)
        if (response.data.token) {
          localStorage.setItem('SESSION_TOKEN', response.data.token)
          dispatch({
            type: POST_LOGIN_DATA_FULFILLED,
            payload: response.data
          })
        } else {
          dispatch({
            type: POST_LOGIN_DATA_REJECTED
            // payload: error
          })
        }
      })
      .catch(function (error) {
        dispatch({
          type: POST_LOGIN_DATA_REJECTED,
          payload: error
        })
      })
  }
}
