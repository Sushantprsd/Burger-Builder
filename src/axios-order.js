import axios from 'axios'

const instance = axios.create({
   baseURL: 'https://burger-builder-ad0cb.firebaseio.com/'
})

export default instance;