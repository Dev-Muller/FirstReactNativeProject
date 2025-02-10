import axios from "axios";

import { AppError } from "@utils/AppError";

const api = axios.create({
  baseURL: 'http://192.168.56.1:3333'
});

api.interceptors.response.use(response => response, error => {
  if(error.response && error.response.data){
    return Promise.reject(new AppError(error.response.data.message));
  } else {
    return Promise.reject(new AppError('Erro no servidor. Tente novamente mais tarde'));
  }
})

// api.interceptors.response.use(
//   response => {
//     console.log("Response: ", response);
//     return response; // Retorne a resposta aqui
//   },
//   error => {
//     if (error.response && error.response.data) {
//       return Promise.reject(new AppError(error.response.data.message));
//     } else {
//       return Promise.reject(new AppError('Erro no servidor. Tente novamente mais tarde'));
//     }
//   }
// );

export { api };