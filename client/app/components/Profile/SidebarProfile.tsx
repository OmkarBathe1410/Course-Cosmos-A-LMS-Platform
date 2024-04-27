import React, { FC } from "react";
import Image from "next/image";
// import Link from "next/link";
import avatarDefault from "../../../public/assets/avatar.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { RiLogoutCircleLine } from "react-icons/ri";
// import { MdOutlineAdminPanelSettings } from "react-icons/md";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SidebarProfile: FC<Props> = ({
  user,
  active,
  setActive,
  avatar,
  logoutHandler,
}) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 800px:px-3 800px:py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={
            user.avatar || avatar ? user.avatar.url || avatar : avatarDefault
          }
          width={20}
          height={20}
          alt=""
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
        />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          My Account
        </h5>
      </div>

      {/* My Account Div Ended Here */}

      <div
        className={`w-full flex items-center px-4 py-4 800px:px-5 800px:py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className="fill-black dark:fill-white" />
        <h5 className="pl-4 800px:block hidden font-Poppins dark:text-white text-black">
          Change Password
        </h5>
      </div>

      {/* Change Password Div Ended Here */}

      <div
        className={`w-full flex items-center px-4 py-4 800px:px-5 800px:py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="fill-black dark:fill-white" />
        <h5 className="pl-4 800px:block hidden font-Poppins dark:text-white text-black">
          Enrolled Courses
        </h5>
      </div>

      {/* Enrolled Courses Div Ended Here */}

      {/* {user.role === "admin" && (
        <Link
          className={`w-full flex items-center px-4 py-4 800px:px-5 800px:py-4 cursor-pointer ${
            active === 6 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
          }`}
          href={"/admin"}
        >
          <MdOutlineAdminPanelSettings
            size={20}
            className="fill-black dark:fill-white"
          />
          <h5 className="pl-4 800px:block hidden font-Poppins dark:text-white text-black">
            Admin Dashboard
          </h5>
        </Link>
      )} */}

      {/* Admin Dashboard Div Ended Here */}

      <div
        className={`w-full flex items-center px-4 py-4 800px:px-5 800px:py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => logoutHandler()}
      >
        <RiLogoutCircleLine size={20} className="text-black dark:text-white" />
        <h5 className="pl-4 800px:block hidden font-Poppins dark:text-white text-black">
          Logout
        </h5>
      </div>

      {/* Logout Div Ended Here */}
    </div>
  );
};

export default SidebarProfile;
