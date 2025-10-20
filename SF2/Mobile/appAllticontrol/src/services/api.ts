import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.162.238:3334'
})

export {api}

//Inicialização: npx expo start