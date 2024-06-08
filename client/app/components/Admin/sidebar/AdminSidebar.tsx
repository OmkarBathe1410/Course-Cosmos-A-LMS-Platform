"use client";
import { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";

import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  ExitToAppIcon,
} from "./Icon";

import avatarDefault from "../../../../public/assets/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

type Props = {
  activeItem: string;
};

const AdminSidebar: FC<Props> = ({ activeItem }) => {
  const { user } = useSelector((state: any) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(activeItem);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${
            theme === "dark" ? "#111C43 !important" : "#fff !important"
          }`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px -1px 5px 5px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: `${theme !== "dark" && "#000"}`,
        },
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "15%",
        }}
      >
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Link href="/">
                  <h3 className="text-[20px] font-Poppins uppercase dark:text-white text-black">
                    Course Cosmos
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block !p-0"
                >
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={80}
                  height={80}
                  src={user.avatar ? user.avatar.url : avatarDefault}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "3px solid #5b6fe6",
                  }}
                  className="w-[80px] h-[80px]"
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  className="!text-[18px] text-black dark:text-[#ffffffc1]"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name}
                </Typography>

                <Typography
                  variant="h6"
                  className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.role}
                </Typography>
              </Box>
            </Box>
          )}
          <Box paddingLeft={isCollapsed ? undefined : "5%"}>
            <MenuItem
              active={selected === "Dashboard"}
              onClick={() => setSelected("Dashboard")}
              icon={<HomeOutlinedIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Dashboard
              </Typography>
              <Link href={"/admin"} />
            </MenuItem>

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 8px" }}
              className="!text-[16px] text-black dark:text-[#ffffffc1] capitalize !font-[600]"
            >
              {!isCollapsed && "Data"}
            </Typography>

            <MenuItem
              active={selected === "Users"}
              onClick={() => setSelected("Users")}
              icon={<GroupsIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Users
              </Typography>
              <Link href={"/admin/users"} />
            </MenuItem>

            <MenuItem
              active={selected === "Invoices"}
              onClick={() => setSelected("Invoices")}
              icon={<ReceiptOutlinedIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Invoices
              </Typography>
              <Link href={"/admin/invoices"} />
            </MenuItem>

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 8px" }}
              className="!text-[16px] text-black dark:text-[#ffffffc1] capitalize !font-[600]"
            >
              {!isCollapsed && "Content"}
            </Typography>

            <MenuItem
              active={selected === "Create Course"}
              onClick={() => setSelected("Create Course")}
              icon={<VideoCallIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Create Course
              </Typography>
              <Link href={"/admin/create-course"} />
            </MenuItem>

            <MenuItem
              active={selected === "Live Courses"}
              onClick={() => setSelected("Live Courses")}
              icon={<OndemandVideoIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Live Courses
              </Typography>
              <Link href={"/admin/courses"} />
            </MenuItem>

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 8px" }}
              className="!text-[16px] text-black dark:text-[#ffffffc1] capitalize !font-[600]"
            >
              {!isCollapsed && "Customization"}
            </Typography>

            <MenuItem
              active={selected === "FAQ"}
              onClick={() => setSelected("FAQ")}
              icon={<QuizIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                FAQ
              </Typography>
              <Link href={"/admin/faq"} />
            </MenuItem>

            <MenuItem
              active={selected === "Categories"}
              onClick={() => setSelected("Categories")}
              icon={<WysiwygIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Categories
              </Typography>
              <Link href={"/admin/categories"} />
            </MenuItem>

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 8px" }}
              className="!text-[16px] text-black dark:text-[#ffffffc1] capitalize !font-[600]"
            >
              {!isCollapsed && "Controllers"}
            </Typography>

            <MenuItem
              active={selected === "Manage Team"}
              onClick={() => setSelected("Manage Team")}
              icon={<PeopleOutlinedIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Manage Team
              </Typography>
              <Link href={"/admin/team"} />
            </MenuItem>

            <Typography
              variant="h6"
              sx={{ m: "15px 0 5px 8px" }}
              className="!text-[16px] text-black dark:text-[#ffffffc1] capitalize !font-[600]"
            >
              {!isCollapsed && "Analytics"}
            </Typography>

            <MenuItem
              active={selected === "Courses Analytics"}
              onClick={() => setSelected("Courses Analytics")}
              icon={<BarChartOutlinedIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Courses Analytics
              </Typography>
              <Link href={"/admin/courses-analytics"} />
            </MenuItem>

            <MenuItem
              active={selected === "Orders Analytics"}
              onClick={() => setSelected("Orders Analytics")}
              icon={<MapOutlinedIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Orders Analytics
              </Typography>
              <Link href={"/admin/orders-analytics"} />
            </MenuItem>

            <MenuItem
              active={selected === "Users Analytics"}
              onClick={() => setSelected("Users Analytics")}
              icon={<ManageHistoryIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Users Analytics
              </Typography>
              <Link href={"/admin/users-analytics"} />
            </MenuItem>

            <Typography
              variant="h6"
              sx={{ m: "15px 0 5px 8px" }}
              className="!text-[16px] text-black dark:text-[#ffffffc1] capitalize !font-[600]"
            >
              {!isCollapsed && "Extras"}
            </Typography>

            <MenuItem
              active={selected === "Back to Profile Page"}
              onClick={() => setSelected("Back to Profile Page")}
              icon={<ExitToAppIcon />}
            >
              <Typography className="!text-[14px] !font-Poppins">
                Back to Profile Page
              </Typography>
              <Link href={"/profile"} />
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;
