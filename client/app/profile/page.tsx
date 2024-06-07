"use client";
import React, { FC, useState } from "react";
import Protected from "../hooks/userProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import Profile from "../components/Profile/Profile";
import Footer from "../components/Footer";
import { useLogoutQuery } from "../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader/Loader";

type Props = {};

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const [logout, setLogout] = useState(false);
  const { isLoading: logoutLoading } = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });
  const { user } = useSelector((state: any) => state.auth);

  const logoutHandler = async () => {
    setLogout(true);
    toast.success("Logged out successfully!");
  };

  return (
    <>
      {logoutLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen">
          <Protected>
            <div>
              <Heading
                title={`${user.name} Profile - Course Cosmos`}
                description="Course Cosmos is a mid-scale Learning Management System (LMS) platform designed to empower learners and educators with a universe of knowledge at their fingertips. With an intuitive interface, a diverse range of courses, and a commitment to continuous growth, Course Cosmos offers an engaging and immersive learning experience for users of all backgrounds and skill levels. Explore the cosmos of learning and unlock your potential with Course Cosmos."
                keywords="Learning Management System (LMS), Online learning, Skill development, Educational platform, Course Cosmos, Online courses, Virtual learning, Educational technology, Self-paced learning, Global learning community, Personalized learning"
              />
              <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
              />
              <Profile
                user={user}
                logoutHandler={logoutHandler}
                logoutLoading={logoutLoading}
              />
              <br />
              <Footer />
            </div>
          </Protected>
        </div>
      )}
    </>
  );
};

export default Page;
