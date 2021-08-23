import React from "react";
import Avatar from "@material-ui/core/Avatar";
import "./post.css";

function Post({ username, caption, imageUrl }) {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="username"
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
    </div>
  );
}

export default Post;
