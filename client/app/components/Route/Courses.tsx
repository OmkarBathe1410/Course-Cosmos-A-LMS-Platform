import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import Loader from "../Loader/Loader";

type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className={`w-[90%] 800px:w-[80%] m-auto`}>
            <h1 className="text-center font-Poppins text-[22px] leading-[30px] sm:text-2xl lg:text-3xl xl:text-4xl dark:text-white 800px:!leading-[50px] text-slate-950 font-[700] tracking-tight">
              Expand your career {" "}
              <span className="dark:bg-gradient-to-l bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-transparent transition duration-1000">
                Opportunity
              </span>
              <br />
              Opportunity with our courses
            </h1>
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {courses &&
                courses.map((item: any, index: number) => (
                  <>
                    <CourseCard item={item} key={index} />
                  </>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Courses;
