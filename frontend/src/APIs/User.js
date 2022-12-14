import axios from 'axios';

async function loginUser(req) {
  return axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, req);
}

async function signUpUser(req) {
  return axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/add`, req);
}

async function resetPwdForUser(req) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/users/forgotpwd`,
    req
  );
}

export { loginUser, signUpUser, resetPwdForUser };
