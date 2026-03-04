import axios from "axios";
import config from "./config";
import { profileStore } from "../store/profileStore";

export const request = (url = "", method = "", data = {}) => {
  let access_token = profileStore.getState().access_token;
  return axios({
    url: config.base_url + url,
    method: method, //"get","post" ,"put","delete"
    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer" + access_token,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      const response = error.response;
      if (response) {
        const status = response.status;
        const data = response.data;
        let errors = {
          message: data?.message,
        };
        // --- ផ្នែកបន្ថែមសម្រាប់ Error 500 ---
        if (status == 500) {
          window.location.href = "/500";
          return;
        }

        if (data.errors) {
          Object.keys(data.errors).map((key) => {
            errors[key] = {
              validateStatus: "error",
              help: data.errors[key][0], //get error message
              hasFeedback: true,
            };
          });
        }
        return {
          error: true,
          status: status,
          errors: errors,
        };
        }
        window.location.href = "/500";
      // ករណីគ្មាន Internet ឬ Server បិទ
      return {
        error: true,
        errors: { message: "មិនអាចតភ្ជាប់ទៅកាន់ Server បានទេ!" },
      };
    });
};
