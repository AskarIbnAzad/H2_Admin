import axios from "axios";
import { save_tokens_constant } from "../../Utils/asyncStatus";
import { session_expired } from "../../Utils/constants";

export const exit_session = () => {
  localStorage.setItem(session_expired, true);
  window.location.reload();
  localStorage.removeItem("auth");
};
// export const baseURL = `https://stagging-server786.com/mol-hyd-backend/public/api/`;
// export const baseURL = `https://api.h2research.org/api/`; // this line used for live server
// export const baseURL = `http://127.0.0.1:8000/api/`; // This line used for local server
export const baseURL = `https://h2-research.site/api/`; // production

// server  https://h2research.stagging-server786.com/
// live  https://admin.h2research.org/

export const apiHandle = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "application/json"
  },

});


// axios.defaults.timeout = 15000;

apiHandle.interceptors.request.use(async (req) => {
  const authTokens = localStorage.getItem(save_tokens_constant.AUTH)
    ? localStorage.getItem(save_tokens_constant.AUTH)
    : null;
  if (authTokens) {
    req.headers.Authorization = `Bearer ${authTokens}`;
  }

  return req;
});


// import axios from "axios";
// import { save_tokens_constant } from "../../Utils/asyncStatus";
// import { session_expired } from "../../Utils/constants";

// export const exit_session = () => {
//   localStorage.setItem(session_expired, "true");


//   localStorage.removeItem(save_tokens_constant.AUTH);
//   localStorage.removeItem("auth");


//   window.location.href = "/login";
//   window.location.reload();
// };

// export const baseURL = `https://h2research.org/backend/public/api/`;

// export const apiHandle = axios.create({
//   baseURL: `${baseURL}`,
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json"
//   },
//   timeout: 15000
// });

// apiHandle.interceptors.request.use(async (req) => {
//   const authTokens = localStorage.getItem(save_tokens_constant.AUTH);

//   if (authTokens) {
//     req.headers.Authorization = `Bearer ${authTokens}`;
//   }

//   return req;
// }, (error) => {
//   return Promise.reject(error);
// });


// apiHandle.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;

//       if (status === 401) {
//         // exit_session();
//         localStorage.setItem(session_expired, "true");


//         localStorage.removeItem(save_tokens_constant.AUTH);
//         localStorage.removeItem("auth");


//         window.location.href = "/login";
//       }

//       else if (status === 403) {
//         console.error("Forbidden access!");
//       }
//     }

//     else if (error.request) {
//       console.error("Network Error - Server unreachable");
//     }

//     return Promise.reject(error);
//   }
// );