import Post from "./models/post";

export default function runTests() {
  runSimpleFetchTests();
  runUpdateTests();
}

async function runSimpleFetchTests() {
  await Post.api.get("");

  if (Post.store.count() !== 3) {
    console.error("Post count is not 3");
  }
}

function runUpdateTests() {
  Post.store.save({
    id: 1,
    title: "Hello World 1!",
    /*hobbies: [
      {
        id: 1,
        name: "Hobby 1",
        postId: 1,
      },
    ],*/
    user: {
      id: 1,
      name: "User 1",
    },
  });

  Post.store.update(1, {
    title: "Hello World 21!",
    hobbies: [
      /*{
        id: 1,
        name: "Hobby 11",
        postId: 1,
      },
      {
        id: 2,
        name: "Hobby 23",
        postId: 1,
      },*/
    ],
    /*user: {
      id: 1,
      name: "User 1",
    },*/
    // user: null,
  });

  console.log(Post.store.first()!.user);
  // console.log(Post.store.first()!.hobbies![0]!.name);
  // console.log(Post.store.first()!.hobbies![1]!.name);

  // console.log(Post.store.first()!.hobbies!.length);

  // console.log(Post.store.first()!.hobbies![0]!.testy);
  // console.log(Post.store.first()!.hobbies![1]!.testy);
}