import Post from "./models/post";
import {setup} from "../../src/axios";
import QueryOperator from "../../src/orm/enums/queryOperator";

setup({
  baseUrl: "https://my-json-server.typicode.com/typicode/demo/",
});

// await for posts to be fetched
await Post.api.getPosts();

const post4 = new Post({
  id: 4,
  title: "foo4",
})

const post5 = new Post({
  id: 5,
  title: "foo5",
})

const posts = Post.store.save([post4, post5]);

console.log(posts);