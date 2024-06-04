import Link from "next/link";
import React from "react";
import {
  AiFillGithub,
  AiOutlineInstagram,
  AiOutlineLinkedin,
} from "react-icons/ai";
import { FaQuestion } from "react-icons/fa6";
import {
  MdHistory,
  MdOutlineAccountCircle,
  MdOutlineCall,
  MdOutlineDashboard,
  MdOutlineMail,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { SiCoursera } from "react-icons/si";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer>
      <div className="border font-Poppins border-[#00000034] dark:border-[#ffffff1e]">
        <br />
        <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-[20px] font-[600] text-black dark:text-white">
                About
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={"/about"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <MdHistory
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/privacy-policy"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <MdOutlinePrivacyTip
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/faq"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <FaQuestion
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-[20px] font-[600] text-black dark:text-white">
                Quick Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={"/courses"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <SiCoursera
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/profile"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <MdOutlineAccountCircle
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/course-dashboard"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <MdOutlineDashboard
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    Course Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-[20px] font-[600] text-black dark:text-white">
                Social Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={"https://www.github.com/OmkarBathe1410/"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <AiFillGithub
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    Github
                  </Link>
                </li>
                <li>
                  <Link
                    href={"https://www.instagram.com/b_omkar_1410/"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <AiOutlineInstagram
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href={"https://www.linkedin.com/in/omkar-bathe-3789b9211/"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    <AiOutlineLinkedin
                      size={20}
                      className="mt-[-2px] inline text-slate-950 dark:text-white"
                    />{" "}
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[20px] font-[600] text-black dark:text-white pb-3">
                Contact Info
              </h3>
              <div className="space-y-2">
                <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
                  <MdOutlineCall
                    size={20}
                    className="mt-[-2px] inline text-slate-950 dark:text-white"
                  />{" "}
                  <a href="tel:+918485088912">+918485088912</a>
                </p>
                <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
                  <MdOutlineMail
                    size={20}
                    className="mt-[-2px] inline text-slate-950 dark:text-white"
                  />{" "}
                  <a href="mailto:omi.bathe@gmail.com">omi.bathe@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
          <br />
          <p className="text-center text-black dark:text-white">
            &copy; {new Date().getFullYear()} Course Cosmos. All rights
            reserved.
          </p>
        </div>
        <br />
      </div>
    </footer>
  );
};

export default Footer;
