import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import defaultAvatar from "../../../public/assets/avatar.png";
import { toast } from "react-hot-toast";
import {
  useAddAnswerToQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyToReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  id,
  data,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reviewReply, setReviewReply] = useState("");
  const [reviewId, setReviewId] = useState("");

  const [
    addNewQuestion,
    { isSuccess, isLoading: questionCreationLoading, error },
  ] = useAddNewQuestionMutation();
  const [
    addAnswerToQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerToQuestionMutation();

  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();

  const { data: courseData, refetch: courseDetailsRefetch } =
    useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });

  const [
    addReplyToReview,
    {
      isSuccess: replyToReviewSuccess,
      error: replyToReviewError,
      isLoading: replyToReviewCreationLoading,
    },
  ] = useAddReplyToReviewMutation();

  const course = courseData?.course;

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id
  );

  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Question can't be empty!");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  useEffect(() => {
    if (questionCreationLoading) {
      toast.loading("Question is getting added...");
    }
    if (isSuccess) {
      setQuestion("");
      refetch();
      toast.success("Question added successfully!");
      socketId.emit("notification", {
        user: user?._id,
        title: "New Question",
        message: `You have a new question in ${data[activeVideo].title}`,
      });
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Answer added successfully!");
      if (user?.role !== "admin") {
        socketId.emit("notification", {
          user: user?._id,
          title: "New Question Reply",
          message: `You have a new question reply in ${data[activeVideo]?.title}`,
        });
      }
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorData = answerError as any;
        toast.error(errorData.data.message);
      }
    }
    if (reviewSuccess) {
      setReview("");
      setRating(0);
      courseDetailsRefetch();
      toast.success("Review added successfully!");
      socketId.emit("notification", {
        user: user?._id,
        title: "New Review",
        message: `${user?.name} has given a review on ${course?.name}`,
      });
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errorData = reviewError as any;
        toast.error(errorData.data.message);
      }
    }
    if (replyToReviewSuccess) {
      setReviewReply("");
      courseDetailsRefetch();
      toast.success("Reply added successfully!");
    }
    if (replyToReviewError) {
      if ("data" in replyToReviewError) {
        const errorData = replyToReviewError as any;
        toast.error(errorData.data.message);
      }
    }
  }, [
    questionCreationLoading,
    isSuccess,
    answerSuccess,
    error,
    answerError,
    reviewSuccess,
    reviewError,
    replyToReviewSuccess,
  ]);

  const handleAnswerSubmit = () => {
    addAnswerToQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review cannot be empty!");
    } else {
      await addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (reviewReply === "") {
      toast.error("Reply cannot be empty!");
    } else {
      addReplyToReview({
        comment: reviewReply,
        courseId: course._id,
        reviewId: reviewId,
      });
    }
  };

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
            <div key={index} className="mb-5">
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
              className={`${
                styles.button
              } !w-max !px-6 !py-0 !h-max !text-[16px] mt-5 ${
                questionCreationLoading && "cursor-not-allowed"
              }`}
              onClick={questionCreationLoading ? () => {} : handleQuestion}
            >
              Submit
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] dark:bg-[#ffffff3b] bg-gray-300"></div>
          <div className="">
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}
      {activeBar === 3 && (
        <>
          <div className="w-full">
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
                      className="outline-none bg-transparent 800px:ml-3 border dark:border-[#ffffff57] border-gray-300 p-2 rounded w-[95%] 800px:text-[16px] font-Poppins text-black dark:text-white"
                      cols={40}
                      rows={5}
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${
                      styles.button
                    } !w-max !h-max 800px:mr-0 mr-2 mt-5 !text-[16px] !px-6 !py-0 ${
                      reviewCreationLoading && "cursor-no-drop"
                    }`}
                    onClick={
                      reviewCreationLoading ? () => {} : handleReviewSubmit
                    }
                  >
                    Submit
                  </div>
                </div>
                <br />
                <br />
                <div className="w-full h-[1px] dark:bg-[#ffffff3b] bg-gray-300"></div>
              </>
            )}
          </div>
          <div className="w-full">
            {(course?.reviews && [...course.reviews].reverse()).map(
              (item: any, index: number) => (
                <div className="w-full my-5" key={index}>
                  <div className="w-full flex">
                    <div>
                      <Image
                        src={
                          item?.user?.avatar?.url
                            ? item.user?.avatar?.url
                            : defaultAvatar
                        }
                        alt=""
                        width={50}
                        height={50}
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                    </div>

                    <div className="ml-2">
                      <h1 className="!text-[16px] dark:text-white text-black">
                        {item?.user.name}
                      </h1>
                      <Ratings rating={item.rating} />
                      <p className="dark:text-white text-[#000]">
                        {item.comment}
                      </p>
                      <small className="font-Poppins dark:text-[#ffffff83] text-[#000000bc] capitalize">
                        {format(item?.createdAt)}
                      </small>
                    </div>
                  </div>

                  {user?.role === "admin" &&
                    item.commentReplies.length === 0 && (
                      <div className="w-full flex mt-2" key={index}>
                        <span
                          className="800px:!pl-10 dark:text-[#ffffff83] text-[#000000be] cursor-pointer mr-2"
                          onClick={() => {
                            setIsReviewReply(!isReviewReply),
                              setReviewId(item._id);
                          }}
                        >
                          {!isReviewReply ? "Add Reply" : "Cancel Reply"}
                        </span>
                        <BiMessage
                          size={20}
                          className={`${
                            isReviewReply
                              ? "hidden"
                              : "cursor-pointer dark:text-[#ffffff83] text-[#0000007e]"
                          }`}
                        />
                      </div>
                    )}

                  {isReviewReply && reviewId === item._id && (
                    <>
                      {item.commentReplies.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="w-full flex 800px:!ml-16 my-5 dark:text-white text-black"
                        >
                          <div className="">
                            <Image
                              src={
                                item?.user?.avatar?.url
                                  ? item.user?.avatar?.url
                                  : defaultAvatar
                              }
                              alt=""
                              width={50}
                              height={50}
                              className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="pl-3">
                            <div className="flex items-center">
                              <h5 className="text-[16px] dark:text-white text-black">
                                {item?.user.name}
                              </h5>
                              {item?.user.role === "admin" && (
                                <VscVerifiedFilled
                                  className="dark:text-green-400 text-blue-700 ml-2"
                                  size={25}
                                />
                              )}
                            </div>
                            <p className="dark:text-white text-[#000000b8]">
                              {item?.comment}
                            </p>
                            <small className="dark:text-[#ffffff83] text-black capitalize">
                              {format(item?.createdAt)} •
                            </small>
                          </div>
                        </div>
                      ))}
                      <>
                        <div className="w-full flex relative dark:text-white text-black">
                          <input
                            type="text"
                            placeholder="Enter your reply..."
                            value={reviewReply}
                            onChange={(e: any) =>
                              setReviewReply(e.target.value)
                            }
                            className={`block 800px:ml-10 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[95%] ${
                              reviewReply === "" ||
                              (replyToReviewCreationLoading &&
                                "cursor-not-allowed")
                            }`}
                          />
                          <button
                            type="submit"
                            className="px-3 py-1 bg-green-400 rounded-lg absolute right-0 bottom-2"
                            onClick={handleReviewReplySubmit}
                            disabled={
                              reviewReply === "" || replyToReviewCreationLoading
                            }
                          >
                            Submit
                          </button>
                        </div>
                      </>
                    </>
                  )}
                </div>
              )
            )}
          </div>
          <br />
        </>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo]?.questions.map((item: any, index: number) => (
          <CommentItem
            key={index}
            item={item}
            data={data}
            activeVideo={activeVideo}
            answer={answer}
            setAnswer={setAnswer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  item,
  setQuestionId,
  questionId,
  answer,
  setAnswer,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div className="">
            <Image
              src={
                item?.user?.avatar?.url ? item.user?.avatar?.url : defaultAvatar
              }
              alt=""
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>
          <div className="pl-3">
            <h5 className="text-[16px] dark:text-white text-black">
              {item?.user.name}
            </h5>
            <p className="dark:text-white text-[#000000b8]">{item?.question}</p>
            <small className="dark:text-[#ffffff83] text-black capitalize">
              {format(item?.createdAt)} •
            </small>
          </div>
        </div>
        <div className="w-full flex">
          <span
            className="800px:pl-16 dark:text-[#ffffff83] text-[#000000b8] cursor-pointer mr-2"
            onClick={() => {
              setReplyActive(!replyActive), setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item?.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className="cursor-pointer dark:text-[#ffffff83] text-[#000000b8]"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">
            {item?.questionReplies.length}
          </span>
        </div>
        {replyActive && questionId === item._id && (
          <>
            {item.questionReplies.map((item: any, index: number) => (
              <div
                key={index}
                className="w-full flex 800px:!ml-16 my-5 dark:text-white text-black"
              >
                <div className="">
                  <Image
                    src={
                      item?.user?.avatar?.url
                        ? item.user?.avatar?.url
                        : defaultAvatar
                    }
                    alt=""
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[16px] dark:text-white text-black">
                      {item?.user.name}
                    </h5>
                    {item?.user.role === "admin" && (
                      <VscVerifiedFilled
                        className="dark:text-green-400 text-blue-700 ml-2"
                        size={25}
                      />
                    )}
                  </div>
                  <p className="dark:text-white text-[#000000b8]">
                    {item?.answer}
                  </p>
                  <small className="dark:text-[#ffffff83] text-black capitalize">
                    {format(item?.createdAt)} •
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className="w-full flex relative dark:text-white text-black">
                <input
                  type="text"
                  placeholder="Enter your answer..."
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
                  className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[95%] ${
                    answer === "" || (answerCreationLoading && "cursor-no-drop")
                  }`}
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-400 rounded-lg absolute right-0 bottom-2"
                  onClick={handleAnswerSubmit}
                  disabled={answer === "" || answerCreationLoading}
                >
                  Submit
                </button>
              </div>
              <br />
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;
