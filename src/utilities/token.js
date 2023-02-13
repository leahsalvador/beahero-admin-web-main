import jwt_decode from "jwt-decode";


export const getToken = () => {
  return window.localStorage.getItem('SESSION_TOKEN')
}

export const getUser = () => {
  let sessionName
  if (window.location.pathname.includes('/admin')) sessionName = 'ADMIN_SESSION_TOKEN'
  else sessionName = 'SESSION_TOKEN'
  return jwt_decode(window.localStorage.getItem(sessionName))
}


export const headers = {
  "Authorization": `Bearer ${getToken()}`,
  "Accept": "application/json",
  "Content-Type": "application/json"
}
