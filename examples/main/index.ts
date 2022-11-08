import Post from "./models/post";
import { setupRecord } from "../../src/main";
import QueryOperator from "../../src/orm/enums/queryOperator";

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
await Post.api.get();