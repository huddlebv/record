import Post from "./models/post.js";

export default async function runTests() {
  await runApiTests();
  await runUpdateTests();
}

async function runApiTests() {
  await Post.api.get("");

  if (Post.store.count() !== 3) {
    console.error("Post count is not 3");
  }

  await Post.api.post("", {
    id: 4,
    title: "Hello World 4!",
  });

  if (Post.store.count() !== 4) {
    console.error("Api POST is not working, count should be 4");
  }

  if (Post.store.last()!.id !== 4) {
    console.error("Api POST append not working, last id should be 4");
  }

  await Post.api.post("", {
    id: 5,
    title: "Hello World 4!",
  }, {
    prepend: true,
  });

  if (Post.store.first()!.id !== 5) {
    console.error("Api POST prepend not working, first id should be 5");
  }
}

async function runUpdateTests() {
  Post.store.clear();

  if (Post.store.count() !== 0) {
    console.error("Post store should be cleared and count 0");
  }

  await Post.api.get("");

  Post.store.save({
    id: 1,
    title: "Hello World 1!",
    /*user: {
      id: 1,
      name: "User 1",
    },*/
    likes: [
      {
        id: 1,
      },
    ],
    likedNames: ["Jeffrey", "Dahmer"]
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
    likedNames: ["User 1", "User 2"],
  });

  if (Post.store.first()!.user?.name !== "User 2") {
    console.error("Post user name is not User 2");
  }

  if (Post.store.first()!.user?.upperName !== "USER 2") {
    console.error("Post user name is not USER 2");
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

  if (Post.store.first()!.likedNames?.length !== 2) {
    console.error("Post likedNames length is not 2");
  }

  if (Post.store.first()!.likedNames![0] !== "User 1") {
    console.error("Post likedNames[0] is not User 1");
  }

  Post.store.update(1, {
    id: 4,
    title: "Hello World 21!",
  });

  if (Post.store.count() !== 3) {
    console.error("Post count is not 3 after updating id");
  }

  if (Post.store.first()!.id !== 2) {
    console.log("Post with id 1 should no longer exist");
  }

  if (Post.store.last()!.id !== 4) {
    console.log("Post with id 4 should exist");
  }

  const updatedPost = Post.store.update(4, {
    title: "Updated title",
  });

  if (updatedPost!.title !== "Updated title") {
    console.log("Post title is not Updated title");
  }

  // test prepend
  Post.store.save({
    id: 5,
    title: "Prepended post",
  }, {
    prepend: true,
  });

  if (Post.store.first()!.id !== 5) {
    console.log("Post with id 5 should be first");
  }

  Post.store.clear();

  // Test orderBy
  Post.store.save([
    { id: 6, title: "A Post" },
    { id: 7, title: "B Post" },
    { id: 8, title: "C Post" }
  ]);

  const ascendingPosts = Post.store.query().orderBy('title', 'asc').get();
  if (ascendingPosts[0].title !== "A Post") {
    console.error("OrderBy ascending not working correctly");
  }

  const descendingPosts = Post.store.query().orderBy('title', 'desc').get();
  if (descendingPosts[0].title !== "C Post") {
    console.error("OrderBy descending not working correctly");
  }

  // Test orderBy with function
  const postsById = Post.store.query().orderBy((post: { id: number }) => post.id, 'desc').get();
  if (postsById[0].id !== 8) {
    console.error("OrderBy with function not working correctly");
  }
}