/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { storage, db } from "../../firebase.config";
import { getAuth } from "firebase/auth";
import "../../App.css";
import { BsPlus } from "react-icons/bs";
import PostSkeleton from "../components/PostSkeleton";
import PostSection from "../components/PostSection";

function Feeds() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(user?.uid);
  const [inputValues, setInputValues] = useState({
    userNameInput: user?.displayName || "User", // default username if null
    profilePhoto: user?.photoURL || "/default-profile.jpg", // default profile image URL
  });

  // Default profile image in case photoURL is undefined
  const ProfileImg = "/default-profile.jpg";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollectionRef = collection(db, "posts"); // Adjust collection name if different
        const querySnapshot = await getDocs(postsCollectionRef);

        const allPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(allPosts);
      } catch (error) {
        navigate("/");
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const usersCollectionRef = collection(db, "usersData");

    if (!storedUser) {
      const authUser = {
        username: user?.displayName || "User", // fallback to 'User' if displayName is unavailable
        photoURL: user?.photoURL || ProfileImg, // fallback to ProfileImg if photoURL is unavailable
        bio: "Hi I am using Vibesnap",
        loggedIn: true,
      };

      const userDocRef = doc(db, "users", authUser.username);

      getDoc(userDocRef).then((docSnap) => {
        if (!docSnap.exists()) {
          setDoc(userDocRef, authUser).then(() => {
            console.log("User created in Firestore");
          });
          addDoc(usersCollectionRef, authUser);
          console.log("users added");
        }
      });

      localStorage.setItem("user", JSON.stringify(authUser));
    }

    const fetchCurrentUser = async () => {
      try {
        const userUid = auth.currentUser?.uid;
        if (!userUid) {
          console.error("No authenticated user found.");
          return;
        }
        setCurrentUserId(userUid);

        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("uid", "==", userUid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error("No user document found for the current user.");
          return;
        }

        const userData = querySnapshot.docs[0].data();
        setInputValues({
          userNameInput: userData.username || "User", // fallback if username is not available
          profilePhoto: userData.photoURL || ProfileImg, // fallback if photoURL is not available
        });
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [auth]);

  const handleLike = async (postId) => {
    try {
      const userId = auth.currentUser.uid; // Get the current user's ID
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const currentLikes = postData.likes || 0;
        const likedBy = postData.likedBy || [];
        if (liked) {
          // User has already liked the post, perform "unlike" action
          await updateDoc(postRef, {
            likes: currentLikes - 1,
            likedBy: likedBy.filter((id) => id !== userId), // Remove user ID from likedBy array
          });

          // Update local state for UI
          setLiked(false);

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: currentLikes - 1,
                    likedBy: likedBy.filter((id) => id !== userId),
                  }
                : post
            )
          );
        } else {
          await updateDoc(postRef, {
            likes: currentLikes + 1,
            likedBy: [...likedBy, userId], // Add user ID to likedBy array
          });
          setLiked(true);
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes: currentLikes + 1,
                    likedBy: [...likedBy, userId],
                  }
                : post
            )
          );
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="flex items-center relative justify-center flex-col ">
      <div className="w-[360px] flex relative  flex-col border gap-2">
        <nav className="flex mx-2">
          <button
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img
              src={inputValues.profilePhoto}
              alt="profile image"
              className="w-[50px] h-[50px] rounded-full"
            />
          </button>
          <div className="items-center mt-1 px-2">
            <div className="text-xs">Welcome Back</div>
            <div className="font-semibold">{inputValues.userNameInput || "user"}</div>
          </div>
        </nav>
        <div className="font-semibold text-[24px] mx-3">Feeds</div>
        <section className="flex flex-col gap-2 mx-3 overflow-y-scroll  h-screen">
          {posts.length === 0 ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            posts.map((post, i) => (
              <PostSection
                key={post.id}
                name={post.username}
                time={post.time}
                post={post.postURL}
                likes={post.likes}
                likedBy={liked}
                caption={post.caption}
                photoURL={post.photoURL}
                background={i % 2 === 0 ? "bg-[#f7ebff]" : "bg-[#fffaee]"}
                handleLike={handleLike}
                postId={post.id}
              />
            ))
          )}
        </section>
        <button
          className="w-[50px] h-[50px] absolute z-10 rounded-full bottom-32 right-2 bg-[#000000] text-white flex justify-center items-center "
          onClick={() => {
            navigate("/createPosts");
          }}
        >
          <BsPlus fontSize={30} />
        </button>
      </div>
    </div>
  );
}

export default Feeds;