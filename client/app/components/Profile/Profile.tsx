"use client";
import React, { FC, useState } from "react";
import SidebarProfile from "./SidebarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logoutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <>
      <div className="w-[85%] flex mx-auto">
        <div
          className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000010] rounded-[5px] dark:shadow-sm shadow-xl mt-[80px] mb-[80px] sticky ${
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
      </div>
    </>
  );
};

export default Profile;