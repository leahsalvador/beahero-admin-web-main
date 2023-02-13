const initialData = {
  loggingIn: false,
  loggedIn: false,
  loginRejected: false,
  loggedData:
      {
        user: {
          username: '',
          email: ''
        }
      }

}
export default function login (state = initialData, action) {
  switch (action.type) {
    case 'POST_LOGIN_DATA':
      return {
        ...state,
        loggingIn: true,
        loggedIn: false,
        loginRejected: false
      }
    case 'POST_LOGIN_DATA_FULFILLED':
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        loggedData: action.payload
      }
    case 'POST_LOGIN_DATA_REJECTED':
      return {
        ...state,
        loggingIn: false,
        loginRejected: true
      }
    default:
      return {
        ...state
      }
  }
}
