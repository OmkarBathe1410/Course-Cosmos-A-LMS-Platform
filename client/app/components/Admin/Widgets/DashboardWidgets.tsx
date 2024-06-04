import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrderAnalytics from "../Analytics/OrderAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [usersComparePercentage, setUsersComparePercentage] = useState<any>();

  const { data: ordersData, isLoading } = useGetOrdersAnalyticsQuery({});
  const { data: usersData, isLoading: usersDataLoading } =
    useGetUsersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading && usersDataLoading) {
      return;
    } else {
      if (usersData && ordersData) {
        const usersLastTwoMonths = usersData.users.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length == 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange =
            usersPreviousMonth !== 0
              ? ((usersCurrentMonth - usersPreviousMonth) /
                  usersPreviousMonth) *
                100
              : 100;

          const ordersPercentChange =
            ordersPreviousMonth !== 0
              ? ((ordersCurrentMonth - ordersPreviousMonth) /
                  ordersPreviousMonth) *
                100
              : 100;

          setUsersComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [isLoading, usersDataLoading, usersData, ordersData]);

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-[75%,25%]">
        <div className="p-8">
          <UserAnalytics isDashboard={true} />
        </div>
        <div className="pt-[35px] pr-8">
          <div className="w-full dark:bg-[#111C43] rounded-md shadow-xl dark:border-none border border-slate-300">
            <div className="flex items-center p-5 justify-between">
              <div className="">
                <BiBorderLeft className="text-black text-[25px] dark:text-[#45CBA0]" />
                <h5 className="pt-2 font-Poppins dark:text-white text-black !text-[18px]">
                  {ordersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black !text-[16px] !font-[400]">
                  Sales Obtained
                </h5>
              </div>
              <div className="flex flex-col items-center justify-center">
                <CircularProgressWithLabel
                  value={ordersComparePercentage?.percentChange}
                  open={open}
                />
                <h5 className="text-center dark:text-white text-black pt-4">
                  {ordersComparePercentage?.percentChange > 0
                    ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                    : ordersComparePercentage?.percentChange.toFixed(2)}{" "}
                  %
                </h5>
              </div>
            </div>
          </div>
          <div className="w-full dark:bg-[#111C43] rounded-md my-8 shadow-xl dark:border-none border border-slate-300">
            <div className="flex items-center p-5 justify-between">
              <div className="">
                <PiUsersFourLight className="text-black text-[25px] dark:text-[#45CBA0]" />
                <h5 className="pt-2 font-Poppins dark:text-white text-black text-[18px]">
                  {usersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[16px] font-[400]">
                  New Users
                </h5>
              </div>
              <div className="flex flex-col items-center justify-center">
                <CircularProgressWithLabel
                  value={usersComparePercentage?.percentChange}
                  open={open}
                />
                <h5 className="text-center dark:text-white text-black pt-4">
                  {usersComparePercentage?.percentChange > 0
                    ? "+" + usersComparePercentage?.percentChange.toFixed(2)
                    : usersComparePercentage?.percentChange.toFixed(2)}{" "}
                  %
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[65%,35%]">
        <div className="p-8">
          <OrderAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          <h5 className="dark:text-white text-black text-[20px] font-[400] font-Poppins pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
