import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../firebase.config"; 
import PostPlaceholder from "../../assets/CreatePosts/post.jpg";

function CreatePosts() {
  const navigate = useNavigate();

  // User details from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { username, photoURL, uid, email } = storedUser || {};

  // State management
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (!file || !caption.trim()) {
      alert("Please provide a caption and select a file.");
      return;
    }

    setUploading(true);

    const storageRef = ref(storage, `users/${uid}/posts/${file.name}`);
    try {
      // Upload file to Firebase Storage
      await uploadBytes(storageRef, file);
      const postURL = await getDownloadURL(storageRef);

      // Save post metadata to Firestore
      await addDoc(collection(db, "posts"), {
        caption,
        postURL,
        time: serverTimestamp(),
        uid,
        username,
        photoURL,
        email,
        likes: 0,  // Initial likes is set to 0
      });

      alert("Post created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error creating post:", error.message);
      alert("Failed to create post.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center relative justify-center flex-col">
      <div className="w-[360px] h-[800px] flex flex-col border relative  gap-2">
        {/* Navigation */}
        <nav className="flex items-center py-3">
          <button
            onClick={() => navigate("/profile")}
            className="px-3"
          >
            <IoMdArrowBack fontSize={20} />
          </button>
          <div className="text-[20px] font-bold">New Post</div>
        </nav>
        <div className="flex justify-center mt-4">
          <img
            src={file? URL.createObjectURL(file):PostPlaceholder}
            className="w-[280px] h-[285px]"
            alt="Preview"
          />
        </div>
        <div className="flex justify-center mt-2">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer px-4 py-2 bg-gray-300 rounded-full text-black"
          >
            Select File
          </label>
        </div>
        <div className="px-4 mt-3 text-black">
          <textarea
            id="caption"
            rows="4"
            className="mt-1 p-2 text-black w-full rounded-md border-gray-300 font-normal text-[14px]"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="w-full absolute bottom-36 flex justify-center">
          <button
            onClick={handleCreatePost}
            disabled={uploading}
            className={`w-full mx-2 rounded-full h-12 ${
              uploading ? "bg-gray-500" : "bg-[#000000]"
            } text-white flex justify-center items-center uppercase text-[16px] font-semibold`}
          >
            {uploading ? "Uploading..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePosts;