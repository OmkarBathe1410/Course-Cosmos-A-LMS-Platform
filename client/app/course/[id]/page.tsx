"use client";
import React from "react";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";
import { useGetCourseDetailsQuery } from "../../../redux/features/courses/coursesApi";
import Loader from "../../../app/components/Loader/Loader";

const Page = ({ params }: any) => {
  const id = params.id;

  const {
    data,
    isLoading,
    refetch: courseDetailsRefetch,
  } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseDetailsPage
            data={data}
            courseDetailsRefetch={courseDetailsRefetch}
          />
        </div>
      )}
    </>
  );
};

export default Page;
