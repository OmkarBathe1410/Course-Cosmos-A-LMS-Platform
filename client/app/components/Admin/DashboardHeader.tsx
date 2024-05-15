"use client";
import { ThemeSwitcher } from "../../../app/utils/ThemeSwitcher";
import React, { FC, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  return (
    <div className="w-full flex items-center justify-end p-6 top-0 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-1 -right-1 bg-[#3ccba0] rounded-full w-[18px] h-[18px] text-[10px] flex items-center justify-center text-white">
          3
        </span>
      </div>
      {open && (
        <div className="w-[25vw] h-[50vh] dark:bg-[#111C43] bg-white border border-[rgba(0,0,0,0.1)] shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[16px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          <div className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]">
            <div className="w-full flex items-center justify-between p-2 text-[14px]">
              <p className="text-black dark:text-white">
                New Question Received
              </p>
              <p className="text-black dark:text-white cursor-pointer">
                Mark as read
              </p>
            </div>
            <p className="px-2 text-black dark:text-white text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Laudantium, tenetur.
            </p>
            <p className="p-2 text-black dark:text-white text-[12px]">
              5 days ago
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
