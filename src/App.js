import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./component/posts/post";
import ImageUpload from "./component/imageUpload/imageUpload";
import { db, auth } from "./firebase";
import { Modal, Button, Input, makeStyles } from "@material-ui/core";
import firebase from "firebase";

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const signUp = (event) => {
    event.preventDefault();
    if (username && password && email) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          db.collection("users").add({
            username: username,
            password: password,
            email: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          res.user.updateProfile({
            displayName: username,
          });
          alert("User has been registered successfully");
          setOpen(false);
        })
        .catch((error) => alert(error.message));
      setUsername("");
      setEmail("");
      setPassword("");
    } else {
      alert("Each field is mandatory!");
    }
  };

  const login = (event) => {
    event.preventDefault();
    if (email && password) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setOpenLogin(false);
        })
        .catch((error) => alert(error.message));
      setEmail("");
      setPassword("");
    } else {
      alert("Each field is mandatory!");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((postsData) => {
        setPosts(
          postsData.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]);
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__login">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage"
              />
            </center>
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={login}>
              Login
            </Button>
          </form>
        </div>
      </Modal>
      {/* Header */}
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app__headerImage"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenLogin(true)}>Login</Button>
            <Button onClick={() => setOpen(true)}>SignUp</Button>
          </div>
        )}
      </div>
      {/* Header */}
      {/* Posts */}
      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <center>
          <h3>Sorry! you need to login first to upload any post</h3>
        </center>
      )}
      {/* Caption input */}
      {/* File picker */}
      {/* Post button */}
      {/* Posts */}
    </div>
  );
};

export default App;
