import AppConfig from '../environment/config';
import axios from 'axios';

// const baseUrl = 'http://localhost:8080/api/';

export const getMoon = async () => {
  const url = `${AppConfig.BASE_URL}moon/o0i5GOhxxmQvjnNGeMfp`;
  const config = {
          method: 'get',
          url: url,
          headers: {
            'Content-Type': 'application/json',
          },
        };
  const response = await axios.get(url);
  console.log('getMoon response', response)
  return response;
};

export const addTransaction = async (body) => {
  const url = `${AppConfig.BASE_URL}transaction`;
  const response = await axios.post(url, body);
  console.log('addTransaction response', response)
  return response;
};

export const updateMoon = async (body) => {
  const url = `${AppConfig.BASE_URL}moon/o0i5GOhxxmQvjnNGeMfp`;
  const response = await axios.put(url, body);
  console.log('getMoon response', response)
  return response;
};

export const getTransaction = async (param) => {
  const url = `${AppConfig.BASE_URL}transaction/`+param;
  const response = await axios.get(url);
  console.log('getTransaction response', response)
  return response;
};

export const getAllTransactions = async () => {
  const url = `${AppConfig.BASE_URL}allTransactions`;
  const response = await axios.get(url);
  console.log('getAllTransaction response', response)
  return response;
};

// const BackendService = () => {
//   const getMoon = async () => {
//     const url = `${baseUrl}moon/o0i5GOhxxmQvjnNGeMfp`;
//     const config = {
//       method: 'get',
//       url: url,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
//     const response = await axios.post(url, config);
   
//     return response;
//   };
// }

// export default BackendService;

