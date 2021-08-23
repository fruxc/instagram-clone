import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./component/posts/Post";
import { db } from "./firebase";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts").onSnapshot((postsData) => {
      setPosts(postsData.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, [posts]);
  return (
    <div className="app">
      {/* Header */}
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app__headerImage"
        />
      </div>
      {/* Header */}
      {/* Posts */}

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
      {/* Posts */}
    </div>
  );
}

export default App;
