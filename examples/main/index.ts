import Post from "./models/post";
import { setupRecord } from "../../src/axios";

setupRecord({
  baseUrl: "https://my-json-server.typicode.com/typicode/demo/",
  debug: {
    // logRequest: true,
    // logResponseStatus: true,
  }
});

// await for posts to be fetched
await Post.api.getPosts();

// log the count of posts in the store
console.log(Post.store.count());