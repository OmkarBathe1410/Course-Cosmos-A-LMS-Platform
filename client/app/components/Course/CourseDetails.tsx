import Ratings from "@/app/utils/Ratings";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Link from "next/link";
import { styles } from "@/app/styles/style";
import CourseContentList from "../Course/CourseContentList";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Payment/CheckoutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast";
import Image from "next/image";
import defaultAvatar from "../../../public/assets/avatar.png";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  data: any;
  stripePromise: any;
  clientSecret: string;
  setOpen: any;
  setRoute: any;
  courseDetailsRefetch: any;
};

const CourseDetails = ({
  data,
  stripePromise,
  clientSecret,
  setOpen: openAuthModal,
  setRoute,
  courseDetailsRefetch,
}: Props) => {
  const { data: userData, refetch: userRefetch } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  const discountPercentage =
    ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;

  const discountPercentagePrice = discountPercentage.toFixed(0);
  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);

  const handleOrder = (e: any) => {
    if (user) {
      setOpen(true);
    } else {
      toast.error("First please login to buy this course!");
      setRoute("Login");
      openAuthModal(true);
    }
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5 font-Poppins">
        <div className="w-full max-[800px]:flex max-[800px]:flex-col-reverse flex flex-row">
          <div className="800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data?.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data?.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data?.purchased} Students
              </h5>
            </div>
            <br />
            <h1 className="text-[23px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {data?.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-green-500 dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[23px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            <div>
              {data?.prerequisites?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-orange-500 dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <div>
              <h1 className="text-[23px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <div className="w-full">
              <h1 className="text-[23px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[16px] mt-[10px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data?.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[20px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating | {data?.reviews?.length} Review(s)
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex">
                      <div>
                        <Image
                          src={
                            item.user?.avatar?.url
                              ? item.user?.avatar?.url
                              : defaultAvatar
                          }
                          alt=""
                          width={75}
                          height={75}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="hidden 800px:block pl-2">
                        <div className="flex item-center">
                          <h5 className="text-[16px] pr-2 text-black dark:text-white">
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className="text-black dark:text-white">
                          {item.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)}
                        </small>
                      </div>
                      <div className="pl-2 flex 800px:hidden items-center">
                        <h5 className="text-[16px] pr-2 text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                    </div>
                    {item.commentReplies.map((item: any) => (
                      <div className="w-full flex 800px:!ml-16 my-5 dark:text-white text-black">
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
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoVideoUrl} title={data?.title} />
              {!isPurchased && (
                <div className="flex items-center">
                  <h1 className="pt-5 text-[22px] text-black dark:text-white">
                    {data?.price === 0 ? "FREE" : "₹" + data?.price}
                  </h1>
                  <h5 className="pl-3 text-[18px] mt-2 line-through opacity-80 text-black dark:text-white">
                    ₹{data?.estimatedPrice}
                  </h5>
                  <h4 className="ml-2 mt-4 px-3 text-[20px] text-white bg-[rgb(22,163,74)] rounded-full">
                    {discountPercentagePrice}% off
                  </h4>
                </div>
              )}
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-max my-4 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Enter to the course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-max my-2 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={handleOrder}
                  >
                    Buy now ₹{data?.price}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="pb-1 dark:text-white text-slate-900 !text-[16px]">
                  • Source code included
                </p>
                <p className="pb-1 dark:text-white text-slate-900 !text-[16px]">
                  • Full lifetime access
                </p>
                <p className="pb-5 800px:pb-1 dark:text-white text-slate-900 !text-[16px]">
                  • Premium support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50%] h-max bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      setOpen={setOpen}
                      data={data}
                      userRefetch={userRefetch}
                      user={user}
                      courseDetailsRefetch={courseDetailsRefetch}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
