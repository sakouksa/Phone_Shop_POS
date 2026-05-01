import axios from "axios";
import config from "./config";
import { profileStore } from "../store/profileStore";

export const request = (url = "", method = "", data = {}) => {
  let access_token = profileStore.getState().access_token;
  let headers = {
    "Content-Type": "application/json", //json data
  };
  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data", // form data
    };
  }
  return axios({
    url: config.base_url + url,
    method: method, //"get","post" ,"put","delete"
    data: data,
    headers: {
      Accept: "application/json",
      ...headers,
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
        if (status == 500) {
          //alert message error server
          errors.message =
            "500 : មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ សូមព្យាយាមម្តងទៀត!";
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
      return {
        error: true,
        errors: { message: "មិនអាចតភ្ជាប់ទៅកាន់ Server បានទេ!" },
      };
    });
};
