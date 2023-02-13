import Axios from 'axios'

import config from '../config'

// Must have own file.
export const POST_LOGIN_DATA = 'POST_LOGIN_DATA'
export const POST_LOGIN_DATA_FULFILLED = 'POST_LOGIN_DATA_FULFILLED'
export const POST_LOGIN_DATA_REJECTED = 'POST_LOGIN_DATA_REJECTED'

export const submitLogin = (data) => {
  return dispatch => {
    dispatch({
      type: POST_LOGIN_DATA,
      payload: {}
    })
    return Axios.post(`${config.REACT_APP_API_BASE_URL}/login`, { ...data })
      .then(function (response) {
        dispatch({
          type: POST_LOGIN_DATA_FULFILLED,
          payload: response.data
        })
        localStorage.setItem('SESSION_TOKEN', response.data.success.token)
        localStorage.setItem('USER_AUTH_DATA', JSON.stringify(response.data.user))
      })
      .catch(function (error) {
        dispatch({
          type: POST_LOGIN_DATA_REJECTED,
          payload: error
        })
      })
  }
}
