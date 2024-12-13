import React, { useState, useEffect } from "react";
import ProfileImg from "../../assets/Profile/profile.png";
import Banner from "../../assets/Profile/banner.png";
import { HiPencil } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { query, collection, where, getDocs, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase.config";
import { getAuth } from "firebase/auth";

function EditProfile() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [inputValues, setInputValues] = useState({
    userNameInput: 'user',
    bioInput: "Hi,I am using Vibesnap",
    profilePhoto: ProfileImg,
    bannerPhoto: Banner,
    isUploading: false,
  });

  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch the current user's data
  useEffect(() => {
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
          userNameInput: userData.username || "",
          bioInput: userData.bio || "",
          profilePhoto: userData.photoURL || ProfileImg,
          bannerPhoto: userData.bannerURL || Banner,
          isUploading: false,
        });
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setInputValues((prev) => ({ ...prev, isUploading: true }));

        const storageRef = ref(
          storage,
          `users/${auth.currentUser.uid}/${type}/${file.name}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        setInputValues((prev) => ({
          ...prev,
          [type]: downloadURL,
        }));
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setInputValues((prev) => ({ ...prev, isUploading: false }));
      }
    }
  };

  // Save profile data to Firestore
  const handleSaveProfile = async () => {
    try {
      if (!currentUserId) {
        console.error("No authenticated user found.");
        return;
      }

      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", currentUserId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("No user document found.");
        return;
      }

      const userDocRef = querySnapshot.docs[0].ref;

      const updatedData = {
        username: inputValues.userNameInput,
        bio: inputValues.bioInput,
        photoURL: inputValues.profilePhoto,
        bannerURL: inputValues.bannerPhoto,
      };

      await updateDoc(userDocRef, updatedData);

      // Update localStorage for immediate effect
      localStorage.setItem("user", JSON.stringify(updatedData));

      console.log("Profile updated successfully:", updatedData);
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="flex items-center relative justify-center flex-col">
      <div className="w-[360px] h-[800px] flex flex-col border relative gap-2">
        <div className="relative">
          <nav className="flex absolute text-white items-center py-3">
            <button className="px-3" onClick={() => navigate("/profile")}>
              <IoMdArrowBack fontSize={20} />
            </button>
            <div className="text-[20px] font-semibold">Edit Profile</div>
          </nav>
          <div className="h-[180px]">
            <img src={inputValues.bannerPhoto} className="w-full" alt="Banner" />
          </div>
          <button
            className="w-[27px] h-[27px] bg-[#F4F4F4] text-black absolute right-2 rounded-full flex justify-center items-center top-36"
            onClick={() => document.getElementById("bannerFileInput").click()}
          >
            <HiPencil />
          </button>
          <input
            id="bannerFileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, "bannerPhoto")}
          />

          <div className="absolute left-[10px] bottom-[-40px]">
            <img
              src={inputValues.profilePhoto}
              className="w-[112px] h-[112px] rounded-full"
              alt="Profile"
            />
          </div>
          <button
            className="w-[27px] h-[27px] bg-[#F4F4F4] text-black absolute left-24 rounded-full flex justify-center items-center"
            onClick={() => document.getElementById("profileFileInput").click()}
          >
            <HiPencil />
          </button>
          <input
            id="profileFileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, "profilePhoto")}
          />
        </div>

        <div className="flex flex-col justify-around h-[550px]">
          <div className="flex flex-col px-4 justify-around">
            <div className="flex flex-col mt-6 p-1 space-y-4 bg-white rounded-lg">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={inputValues.userNameInput}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      userNameInput: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border-gray-300"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  value={inputValues.bioInput}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      bioInput: e.target.value,
                    }))
                  }
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                ></textarea>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="bottom-1 rounded-full h-12 bg-[#000000] text-white flex justify-center items-center uppercase text-[16px] font-semibold"
          >
            {inputValues.isUploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;