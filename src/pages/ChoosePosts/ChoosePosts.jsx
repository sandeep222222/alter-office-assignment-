import React from "react";
import { HiCash, HiCamera } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io"; 
import Post from "../../assets/ChoosePosts/posts.png";

function ChoosePosts() {
  return (
    <div className="flex items-center relative justify-center flex-col ">
      <div className="w-[360px] h-[800px] flex flex-col border relative border-black gap-1">
        <nav className="flex absolute justify-between w-full items-center py-3 text-white ">
          <div className="px-3">
            <IoMdArrowBack fontSize={20} />
          </div>
          <div className="text-[20px] pr-4 font-bold">Next</div>
        </nav>
        <div>
          <img src={Post} alt="" />
        </div>
        <div className="flex border-black items-center justify-between h-12 px-3">
          <div>Gallery</div>
          <div className="flex w-20 justify-between">
            <button className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center">
              <HiCash fontSize={16} />
            </button>
            <button className="bg-[#F5F5F5] text-black rounded-full w-8 h-8 flex items-center justify-center">
              <HiCamera fontSize={16} />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-center items-center">
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
          <div className="w-[115px] h-[115px] bg-green-300"></div>
        </div>
      </div>
    </div>
  );
}

export default ChoosePosts;