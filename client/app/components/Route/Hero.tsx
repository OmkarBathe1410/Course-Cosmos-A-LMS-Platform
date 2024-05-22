'use client'
import React, { FC } from "react";
import Link from "next/link";

type Props = {};
const Hero: FC<Props> = (props) => {
  return (
    <div className="w-[95%] m-auto flex justify-center items-center min-[280px]:h-[70vh] 800px:!h-[90vh] translate-y-0 opacity-100 transition-all duration-1000 ease-in-out">
      <div className="w-[100%]">
        <h1 className="font-extrabold text-2xl min-[460px]:text-[1.6rem] sm:text-3xl md:!text-4xl xl:!text-5xl xl:!leading-[3.5rem] tracking-tight text-center dark:text-white text-slate-900 font-Poppins">
          Empowering{" "}
          <span className="text-gradient hero_animation">Learning</span>
          <br /> Enriching{" "}
          <span className="text-gradient hero_animation">Futures</span>
          <br /> Your Path to{" "}
          <span className="text-gradient hero_animation">Knowledge</span>{" "}
          Excellence!
        </h1>
        <div className="pt-2"></div>
        <div className="w-full text-center">
          <p className="800px:block hidden font-Poppins 800px:text-[18px] text-[16px] font-normal dark:text-gray-400 text-gray-700 mt-5 mb-10">
            Accelerate Your Learning Journey with Course Cosmos
            <br />
            An Engaging and Interactive LMS
          </p>
          <p className="800px:hidden block font-Poppins 800px:text-[20px] text-[16px] font-normal dark:text-gray-400 text-gray-700 mt-5 mb-10">
            Accelerate Your Learning Journey with Course Cosmos
            <br />
            An Engaging and Interactive LMS
          </p>
          <div className="flex w-full justify-center font-Poppins font-[600]">
            <Link href={"/courses"}>
              <div className="flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer min-h-[45px] w-full text-[16px] font-Poppins font-semibold bg-gradient-to-r from-[#964be1] to-[#4d88c4] dark:bg-gradient-to-r dark:from-[#4d88c4] dark:to-[#964be1]">
                Explore Courses
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;