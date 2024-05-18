import { useGetCourseDetailsQuery } from "../../../redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetCourseDetailsQuery(id);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data?.course.name + " - Course Cosmos"}
            description={
              "Course Cosmos is a mid-scale Learning Management System (LMS) platform designed to empower learners and educators with a universe of knowledge at their fingertips. With an intuitive interface, a diverse range of courses, and a commitment to continuous growth, Course Cosmos offers an engaging and immersive learning experience for users of all backgrounds and skill levels. Explore the cosmos of learning and unlock your potential with Course Cosmos."
            }
            keywords={data.course.tags}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <CourseDetails data={data.course} />
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;

// import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
// import React, { useState } from "react";
// import Loader from "../Loader/Loader";

// type Props = {
//   id: string;
// };

// const CourseDetailsPage = ({ id }: Props) => {
// const [route, setRoute] = useState("Login");
// const [open, setOpen] = useState(false);

// const { data, isLoading } = useGetCourseDetailsQuery(id);

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div>
//           <Heading
//             title={data?.course.name + " - Course Cosmos"}
//             description="Course Cosmos is a mid-scale Learning Management System (LMS) platform designed to empower learners and educators with a universe of knowledge at their fingertips. With an intuitive interface, a diverse range of courses, and a commitment to continuous growth, Course Cosmos offers an engaging and immersive learning experience for users of all backgrounds and skill levels. Explore the cosmos of learning and unlock your potential with Course Cosmos."
//             keywords={data.course.tags}
//           />
// <Header
//   route={route}
//   setRoute={setRoute}
//   open={open}
//   setOpen={setOpen}
//   activeItem={1}
// />
// <CourseDetails data={data.course} />
// <Footer />
//         </div>
//       )}
//     </>
//   );
// };

// export default CourseDetailsPage;
