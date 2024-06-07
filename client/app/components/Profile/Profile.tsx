"use client";
import React, { FC, useEffect, useState } from "react";
import SidebarProfile from "./SidebarProfile";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import Loader from "../Loader/Loader";
import CourseCard from "../Course/CourseCard";
import { useGetUsersAllCoursesQuery } from "../../../redux/features/courses/coursesApi";

type Props = {
  user: any;
  logoutHandler: any;
  logoutLoading: boolean;
};

const Profile: FC<Props> = ({ user, logoutHandler, logoutLoading }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [courses, setCourses] = useState([]);
  const { data, isLoading: userCoursesDataLoading } =
    useGetUsersAllCoursesQuery(undefined, {});

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course._id !== undefined);
      setCourses(filteredCourses);
    }
  }, [data]);

  return (
    <>
      {userCoursesDataLoading || logoutLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] flex mx-auto">
          <div
            className={`w-[60px] 800px:w-[360px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000010] rounded-[5px] dark:shadow-sm shadow-xl mt-[80px] mb-[80px] sticky ${
              scroll ? "top-[120px]" : "top-[30px]"
            } left-[30px]`}
          >
            <SidebarProfile
              user={user}
              active={active}
              avatar={avatar}
              setActive={setActive}
              logoutHandler={logoutHandler}
            />
          </div>
          {active === 1 && (
            <div className="w-full h-full bg-transparent mt-[80px]">
              <ProfileInfo avatar={avatar} user={user} />
            </div>
          )}
          {active === 2 && (
            <div className="w-full h-full bg-transparent mt-[80px]">
              <ChangePassword />
            </div>
          )}
          {active === 3 && (
            <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[80px]">
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                {courses &&
                  courses.map((item: any, index: number) => (
                    <>
                      <CourseCard item={item} key={index} isProfile={true} />
                    </>
                  ))}
              </div>
              {courses.length === 0 && (
                <h1 className="text-center text-[18px] font-Poppins">
                  You haven&apos;t purchased any course!
                </h1>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
