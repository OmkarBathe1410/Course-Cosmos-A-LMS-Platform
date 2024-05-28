"use client";

import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetLayoutDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import { BiSearch } from "react-icons/bi";
import { toast } from "react-hot-toast";

type Props = {};

const page = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetLayoutDataQuery("Categories", {});

  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    }
    if (category !== "All") {
      setCourses(
        data?.courses.filter((item: any) => item.category === category)
      );
    }
  }, [data, category]);

  const categories = categoriesData?.layout.categories;

  const handleSearch = () => {
    if (search === "") {
      toast.error("Please enter a valid title!");
    } else {
      setCourses(
        data?.courses.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-screen font-Poppins">
            <Heading
              title={"All Courses - Course Cosmos"}
              description={
                "Course Cosmos is a mid-scale Learning Management System (LMS) platform designed to empower learners and educators with a universe of knowledge at their fingertips. With an intuitive interface, a diverse range of courses, and a commitment to continuous growth, Course Cosmos offers an engaging and immersive learning experience for users of all backgrounds and skill levels. Explore the cosmos of learning and unlock your potential with Course Cosmos."
              }
              keywords={
                "Learning Management System (LMS), Online learning, Skill development, Educational platform, Course Cosmos, Online courses, Virtual learning, Educational technology, Self-paced learning, Global learning community, Personalized learning"
              }
            />
            <br />
            <div className="w-full flex items-center justify-center">
              <input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
                className="bg-transparent border border-slate-300 dark:border-transparent dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-l-xl p-2 w-full h-full outline-none text-black dark:text-white"
              />
              <BiSearch
                className="text-white bg-[#39c1f3] rounded-r-xl p-2"
                size={43}
                onClick={handleSearch}
              />
            </div>
            <br />
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-4 py-2 rounded-3xl flex items-center justify-center cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`${
                        category === item.title
                          ? "bg-[crimson]"
                          : "bg-[#5050cb]"
                      } m-3 px-4 py-2 rounded-3xl flex items-center justify-center cursor-pointer`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {courses && courses.length === 0 && (
              <p
                className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
              >
                {search
                  ? "No course found!"
                  : "No courses found in this category. Please try another one!"}
              </p>
            )}
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
        </>
      )}
    </div>
  );
};

export default page;
