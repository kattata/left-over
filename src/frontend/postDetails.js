async function appendPostDetails() {
  let allPostsJson = await fetchPosts();
  console.log("I work", allPostsJson);
}
