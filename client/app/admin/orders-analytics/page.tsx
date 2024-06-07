"use client";
import React, { useState } from "react";
import Heading from "../../utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../../hooks/adminProtected";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import OrderAnalytics from "../../components/Admin/Analytics/OrderAnalytics";

type Props = {};

const Page = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <AdminProtected>
        <div>
          <Heading
            title="Course Cosmos - Admin"
            description="Course Cosmos is a mid-scale Learning Management System (LMS) platform designed to empower learners and educators with a universe of knowledge at their fingertips. With an intuitive interface, a diverse range of courses, and a commitment to continuous growth, Course Cosmos offers an engaging and immersive learning experience for users of all backgrounds and skill levels. Explore the cosmos of learning and unlock your potential with Course Cosmos."
            keywords="Learning Management System (LMS), Online learning, Skill development, Educational platform, Course Cosmos, Online courses, Virtual learning, Educational technology, Self-paced learning, Global learning community, Personalized learning"
          />
          <div className="flex">
            <div className="1500px:w-[16%] w-1/5">
              <AdminSidebar activeItem={"Orders Analytics"} />
            </div>
            <div className="w-[85%]">
              <DashboardHeader open={open} setOpen={setOpen} />
              <OrderAnalytics />
            </div>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
