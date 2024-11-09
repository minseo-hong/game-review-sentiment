import Axios from 'axios';

const axios = Axios.create();

axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_API_URL}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
