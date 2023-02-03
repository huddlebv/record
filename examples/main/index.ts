import axios from "axios";
import Post from "./models/post.js";
import { setupRecord } from "../../src/main.js";

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

// await for posts to be fetched
await Post.api.get();
