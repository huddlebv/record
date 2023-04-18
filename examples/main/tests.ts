import Post from "./models/post";

export default async function runTests() {
  await runSimpleFetchTests();
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
    user: {
      id: 1,
      name: "User 1",
    },
    likes: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ]
  });

  Post.store.update(1, {
    title: "Hello World 21!",
    hobbies: [
      {
        id: 1,
        name: "Hobby 11",
        postId: 1,
      },
      {
        id: 2,
        name: "Hobby 23",
        postId: 1,
      },
    ],
    user: {
      id: 1,
      name: "User 2",
    },
    likes: [],
  });

  if (Post.store.first()!.user?.name !== "User 2") {
    console.error("Post user name is not User 2");
  }

  if (Post.store.first()!.title !== "Hello World 21!") {
    console.error("Post title is not Hello World 21!");
  }

  if (Post.store.first()!.hobbies?.length !== 2) {
    console.error("Post hobbies length is not 2");
  }

  if (Post.store.first()!.hobbies![0]!.uppercaseName !== "HOBBY 11") {
    console.error("Post hobbies[0] uppercaseName is not HOBBY 11");
  }

  if (Post.store.first()!.likes?.length !== 0) {
    console.error("Post likes length is not 0");
  }
}