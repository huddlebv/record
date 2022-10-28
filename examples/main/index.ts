import Post from "./models/post";
import { setup } from "../../src/axios";

setup({
  baseUrl: "https://my-json-server.typicode.com/typicode/demo/",
});

await Post.api.getPosts();

console.log(Post.store.count());