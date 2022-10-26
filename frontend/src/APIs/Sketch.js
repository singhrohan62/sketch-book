import axios from 'axios';

async function getAllSketches() {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/sketches`);
}

async function getNamesOfAllSketches() {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/sketches/getNames`);
}

async function getContributorsForSketch(req) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/sketches/getContributors`,
    req
  );
}

async function getSketch(req) {
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/sketches/getSketch`,
    req
  );
}

async function addSketch(req) {
  return axios.post(`${process.env.REACT_APP_BACKEND_URL}/sketches/add`, req);
}

async function saveSketch(req) {
  return axios.put(`${process.env.REACT_APP_BACKEND_URL}/sketches/save`, req);
}

export {
  getAllSketches,
  getNamesOfAllSketches,
  getContributorsForSketch,
  getSketch,
  addSketch,
  saveSketch,
};
