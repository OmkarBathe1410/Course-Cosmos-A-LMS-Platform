import React, { FC, useEffect } from "react";
import { styles } from "../../../styles/style";
import { useGetUsersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  isDashboard?: boolean;
};

const data = [
  { month: "Jun 2023", count: 440 },
  { month: "Jul 2023", count: 8200 },
  { month: "Aug 2023", count: 4033 },
  { month: "Sept 2023", count: 4502 },
  { month: "Oct 2023", count: 2042 },
  { month: "Nov 2023", count: 3454 },
  { month: "Dec 2023", count: 356 },
  { month: "Jan 2024", count: 5667 },
  { month: "Feb 2024", count: 1320 },
  { month: "Mar 2024", count: 6526 },
  { month: "Apr 2024", count: 5480 },
  { month: "May 2024", count: 485 },
];

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
  // const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { isLoading } = useGetUsersAnalyticsQuery({});

  const analyticsData: any = [];

  // data &&
  //   data.users.last12Months.forEach((item: any) => {
  //     analyticsData.push({ month: item.month, count: item.count });
  //   });
  data &&
    data.forEach((item: any) => {
      analyticsData.push({ month: item.month, count: item.count });
    });
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`${
            !isDashboard
              ? ""
              : "dark:bg-[#111C43] dark:shadow-md shadow-xl dark:border-none border border-slate-300 p-4 rounded-md"
          }`}
        >
          <div className={`${isDashboard ? "!ml-8 mb-2" : ""}`}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Users Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 Months Analytics Data{" "}
              </p>
            )}
          </div>

          <div
            className={`w-full ${
              isDashboard ? "h-[37vh]" : "h-screen"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={!isDashboard ? "50%" : "100%"}
            >
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4d62d9"
                  fill="#4d62d9"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalytics;
