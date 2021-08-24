import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import { storage, db } from "../../firebase";
import firebase from "firebase";
import "./imageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handlePostUpload = () => {
    const uploadPostImage = storage.ref(`images/${image.name}`).put(image);
    uploadPostImage.on(
      "state_changed",
      (snapshot) => {
        // Progress bar
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progress} max="100" />
      <Input
        type="text"
        placeholder="Enter caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <Input type="file" onChange={handleImageUpload} />
      <Button onClick={handlePostUpload}>Post</Button>
    </div>
  );
}
export default ImageUpload;
