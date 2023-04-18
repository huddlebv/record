import axios from "axios";
import { setupRecord } from "../../src/main.js";
import runTests from "./tests.js";

setupRecord({
  api: {
    axiosInstance: axios.create({
      baseURL: "https://my-json-server.typicode.com/typicode/demo/",
    }),
    debug: {
      logRequest: true,
    },
  },
});

runTests();
