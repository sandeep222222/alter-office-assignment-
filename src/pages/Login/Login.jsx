/* eslint-disable no-unused-vars */
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { app, db } from "../../firebase.config";
import Banner from "../../assets/Profile/banner.png";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { images } from "./Images";
import Logo from "../../assets/Login/logo-vibe.png";

function returnTheTag(inputString) {
  const noSpaces = inputString.split(" ").join("");
  const randomThreeDigit = Math.floor(100 + Math.random() * 900);
  return noSpaces + randomThreeDigit;
}

function Login() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const authUser = {
        username: user.displayName || "user",
        email: user.email,
        photoURL: user.photoURL || "default_photo_url",
        bio: "Hi I am using Vibesnap",
        loggedIn: true,
        bannerURL: user.bannerURL || Banner,
        tag: returnTheTag(user.displayName),
        uid: user.uid,
      };

      // Reference the collection
      const userCollectionRef = collection(db, "users");

      // Query to check if a user with the same email already exists
      const q = query(userCollectionRef, where("email", "==", authUser.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const docRef = await addDoc(userCollectionRef, authUser);
        // console.log("User added to Firestore with ID:", docRef.id);
      }

      localStorage.setItem("user", JSON.stringify(authUser));
      navigate("/feeds");
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  return (
    <div className="flex items-center relative justify-center flex-col ">
      <div className="flex flex-col h-[800px]">
        <div className="columns-3 w-[360px] relative">
          {images.map((x, i) => (
            <img src={x} className="mb-3" alt={i} key={i} />
          ))}
        </div>
        <div className="absolute rounded-[60px] bg-white w-[360px] h-[250px] bottom-[80px] z-10 flex flex-col items-center gap-4">
          <div className="flex mt-10">
            <img src={Logo} alt="Logo" />
            <div className="font-semibold text-lg">Vibesnap</div>
          </div>
          <div>Moments That Matter, Shared Forever.</div>
          <button
            onClick={handleGoogleSignIn}
            className="border border-black w-[200px] bg-[#292929] text-white p-3 rounded-[26px] flex items-center justify-around"
          >
            <FcGoogle fontSize={18} />
            <div className="text-sm">Continue with Google</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;