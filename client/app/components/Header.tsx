"use client";
import Link from "next/link";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineUserCircle } from "react-icons/hi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import avatar from "../../public/assets/avatar.png";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};
const Header: FC<Props> = ({ activeItem, setOpen, open, setRoute, route }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const { data } = useSession();
  const [logout, setLogout] = useState(false);
  const { } = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data.user?.email,
          name: data.user?.name,
          avatar: data.user?.image,
        });
      }
    }
    
    if (data === null) {
      if (isSuccess) {
        toast.success("Logged In Successfully!");
      }
    }

    if(data === null){
      setLogout(true);
    }

  }, [user!, data!]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 85) {
          setActive(true);
        } else {
          setActive(false);
        }
      });
    }
  }, []);

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };
  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-tl bg-white dark:from-gray-900 dark:to-gray-950 fixed top-0 left-0 w-full h-[80px] z-[80] transition duration-500 border-b dark:border-[#ffffff1c] shadow-xl"
            : "w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] dark:shadow"
        }`}
      >
        <div className="m-auto h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-5">
            <div>
              <Link href={"/"}>
                <Image
                  src={require("../logo/Course_Cosmos_Logo.png")}
                  alt="Logo"
                  width={280}
                />
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* Following code is only for mobile: */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {/* Above code is only for mobile: */}
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt=""
                    width={30}
                    height={30}
                    className="hidden min-[440px]:!block w-[30px] h-[30px] rounded-full cursor-pointer"
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "none",
                    }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        {/* Following code is only for mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed h-screen z-[99999] bg-white dark:bg-neutral-950 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              {!user ? (
                <>
                  <span
                    className="font-Poppins cursor-pointer text-black dark:text-white"
                    onClick={() => setOpen(true)}
                  >
                    <HiOutlineUserCircle
                      size={25}
                      className="inline cursor-pointer ml-5 my-3 text-black dark:text-white"
                    />{" "}
                    Login / Sign Up
                  </span>
                </>
              ) : (
                <Link href={"/profile"}>
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt=""
                    width={25}
                    height={25}
                    className="hidden min-[320px]:!inline-block ml-6 my-3 w-[25px] h-[25px] rounded-full cursor-pointer"
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "none",
                    }}
                  />
                  <span className="ml-3 text-black dark:text-white font-Poppins">
                    User Profile
                  </span>
                </Link>
              )}
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                {new Date().getFullYear() +
                  " Course Cosmos. All rights reserved."}
              </p>
            </div>
          </div>
        )}
        {/* Above code is only for mobile sidebar */}
      </div>
      {route == "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route == "Sign-Up" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route == "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};
export default Header;
