import React, { FC } from "react";
import { styles } from "../../../styles/style";
import { useGetOrdersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  Line,
  Legend,
} from "recharts";

type Props = {
  isDashboard?: boolean;
};

const OrderAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

  const analyticsData: any = [];

  data &&
    data.orders.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.name, count: item.count });
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
              : "dark:bg-[#111C43] dark:shadow-md shadow-xl p-4 dark:border-none border border-slate-300 rounded-md"
          }`}
        >
          <div className={`${isDashboard ? "!ml-8 mb-2" : ""}`}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Orders Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 Months Analytics Data{" "}
              </p>
            )}
          </div>

          <div
            className={`w-full ${
              isDashboard ? "h-[35vh]" : "h-screen"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={!isDashboard ? "50%" : "100%"}
            >
              <LineChart
                width={500}
                height={300}
                data={analyticsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderAnalytics;
