import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.162.110:3334'
})

export {api}

//Inicialização: npx expo start