import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Image from "next/image";
import React, { useState } from "react";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import defaultAvatar from "../../../public/assets/avatar.png";

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
};

const CourseContentMedia = ({
  id,
  data,
  activeVideo,
  setActiveVideo,
  user,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const isReviewExists = data?.reviews?.find(
    (item: any) => item.user._id === user._id
  );

  return (
    <div className="!w-[95%] 800px:!w-[85%] py-4 font-Poppins m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${styles.button} !h-[unset] !w-max ${
            activeVideo === 0 && "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </div>
        <div
          className={`${styles.button} !h-[unset] !w-max ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[23px] text-slate-950 dark:text-white font-[600]">
        {data[activeVideo]?.title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between text-black dark:text-white bg-white border border-neutral-200 dark:border-none dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur shadow-lg dark:shadow-inner dark:shadow-slate-700 rounded">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`!text-[18px] cursor-pointer ${
              activeBar === index && "text-red-500 transition-all duration-75"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="!text-[16px] text-slate-950 dark:text-white whitespace-pre-line mb-3">
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div className="mb-5">
              <div className="800px:!text-[16px] 800px:!inline-block">
                <h2 className="text-slate-950 dark:text-white">
                  {item.title && item.title + " :"}
                </h2>
                <a
                  className="!inline-block text-[#4395c4] 800px:!text-[16px]"
                  href={item?.url}
                >
                  {item?.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={user?.avatar?.url ? user?.avatar?.url : defaultAvatar}
              alt=""
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full object-cover shadow-md shadow-gray-400"
            />
            <textarea
              name=""
              id=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write a question..."
              className="outline-none bg-transparent 800px:ml-3 border dark:border-[#ffffff57] border-gray-300 800px:w-full p-2 rounded w-[90%] 800px:text-[16px] font-Poppins text-black dark:text-white"
              cols={40}
              rows={5}
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !px-6 !py-0 !h-max !text-[16px] mt-5`}
            >
              Submit
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div className="">{/* questionReply */}</div>
        </>
      )}
      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="w-full flex">
                  <Image
                    src={user?.avatar?.url ? user?.avatar?.url : defaultAvatar}
                    alt=""
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover shadow-md shadow-gray-400"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[18px] font-[500] dark:text-white text-black">
                      Give a rating <span className="text-red-500">*</span>
                    </h5>
                    <div className="ml-2 pb-3 w-full flex">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            size={25}
                            className="mr-1 cursor-pointer"
                            color="rgb(246, 186, 0)"
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            size={25}
                            className="mr-1 cursor-pointer"
                            color="rgb(246, 186, 0)"
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      id=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Write your review..."
                      className="outline-none bg-transparent 800px:ml-3 border dark:border-[#ffffff57] border-gray-300 800px:w-full p-2 rounded w-[95%] 800px:text-[16px] font-Poppins text-black dark:text-white"
                      cols={40}
                      rows={5}
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${styles.button} !w-max !h-max 800px:mr-0 mr-2 mt-5 !text-[16px] !px-6 !py-0`}
                  >
                    Submit
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default CourseContentMedia;
