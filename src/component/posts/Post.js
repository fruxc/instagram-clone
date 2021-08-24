import React, { useState, useEffect } from "react";
import { Avatar, Button, Input } from "@material-ui/core";
import "./post.css";
import { db } from "../../firebase";
import firebase from "firebase";

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="./static/images/avatars/1.png"
        />
        <h3>{username}</h3>
      </div>
      {/* Header -> avatar + username*/}
      <img src={imageUrl} alt="" className="post__image" />
      {/* Image */}
      <h4 className="post__text">
        <strong>{username} </strong> {caption}
      </h4>

      {/* Username + caption */}

      {/* Comments */}

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user ? (
        <form className="post__commentBox">
          <Input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            color="primary"
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </Button>
        </form>
      ) : (
        <h3 className="post__comments">Sign in to comment</h3>
      )}
    </div>
  );
}

export default Post;
