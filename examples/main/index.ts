import Post from "./models/post";
import { setupRecord } from "../../src/main";

setupRecord({
  api: {
    axiosConfig: {
      baseURL: "https://my-json-server.typicode.com/typicode/demo/",
    },
    debug: {
      logRequest: true,
    },
  },
});

// await for posts to be fetched
await Post.api.get().then((data) => {
    console.log(data);
}).catch((e) => {
  console.log(e);
    console.log('error');
});