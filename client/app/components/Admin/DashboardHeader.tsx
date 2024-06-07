"use client";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "../../../redux/features/notifications/notificationsApi";
import { ThemeSwitcher } from "../../../app/utils/ThemeSwitcher";
import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import Image from "next/image";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();

  const audioObj = new Audio(
    "https://res.cloudinary.com/dlglvxu6c/video/upload/v1717143771/notificationRingtone.mp3"
  );

  const [notifications, setNotifications] = useState<any>([]);
  const [audio, setAudio] = useState(audioObj);

  const notificationSoundPlayer = () => {
    audio.play();
  };

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
    audio.load();
  }, [data, isSuccess]);

  useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
      notificationSoundPlayer();
    });
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="w-full flex items-center justify-end p-6 top-0 right-0 font-Poppins">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-1 -right-1 bg-[#3ccba0] rounded-full w-[18px] h-[18px] text-[10px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {open && (
        <div className="w-[25vw] h-[50vh] overflow-auto dark:bg-[#111C43] bg-white border border-[rgba(0,0,0,0.1)] shadow-xl absolute top-16 right-10 z-10 rounded">
          <h5 className="text-center text-[16px] font-Poppins text-black dark:text-white dark:bg-transparent bg-slate-200 p-3 dark:!border-b dark:border-slate-500">
            Notifications
          </h5>
          {notifications.length === 0 ? (
            <>
              <div className="flex flex-col justify-center items-center my-8">
                <Image
                  src={require("../../../public/assets/No-Notification-Found.png")}
                  alt=""
                  width={200}
                  height={200}
                />
                <br />
                <p className="text-black dark:text-white font-medium">
                  NO NOTIFICATIONS YET
                </p>
              </div>
            </>
          ) : (
            <>
              {notifications.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="dark:bg-[#2d3a4ea1] bg-[#fff] my-2 mx-2 font-Poppins border border-[rgba(0,0,0,0.1)] dark:border-none rounded-lg pb-1 shadow-xl"
                  >
                    <div className="w-full flex items-center justify-between p-2 text-[14px]">
                      <p className="text-white bg-gradient-to-tr rounded-md from-blue-400 via-purple-500 to-blue-400 px-3 py-1">
                        {item?.title}
                      </p>
                      <p
                        className="text-white cursor-pointer rounded-md bg-red-500 px-3 py-1"
                        onClick={() =>
                          handleNotificationStatusChange(item?._id)
                        }
                      >
                        Mark as read
                      </p>
                    </div>
                    <div className="w-full p-2">
                      <p className="px-1 text-black dark:text-white text-[14px] mb-2">
                        {item?.message}
                      </p>
                      <p className="!w-max text-black capitalize dark:text-white text-[12px] px-3 py-1 rounded-full bg-gray-200 dark:bg-[#546278]">
                        {format(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
