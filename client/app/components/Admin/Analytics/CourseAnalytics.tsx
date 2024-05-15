import React, { FC } from "react";
import { styles } from "../../../styles/style";
import { useGetCoursesAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Label,
  Bar,
  LabelList,
} from "recharts";

type Props = {
  isDashboard?: boolean;
};

const data = [
  { month: "Jun 2023", count: 5 },
  { month: "Jul 2023", count: 6 },
  { month: "Aug 2023", count: 2 },
  { month: "Sept 2023", count: 3 },
  { month: "Oct 2023", count: 4 },
  { month: "Nov 2023", count: 1 },
  { month: "Dec 2023", count: 6 },
  { month: "Jan 2024", count: 3 },
  { month: "Feb 2024", count: 5 },
  { month: "Mar 2024", count: 4 },
  { month: "Apr 2024", count: 4 },
  { month: "May 2024", count: 7 },
];

const CourseAnalytics: FC<Props> = ({ isDashboard }) => {
  // const { data, isLoading } = useGetCoursesAnalyticsQuery({});
  const { isLoading } = useGetCoursesAnalyticsQuery({});

  const analyticsData: any = [];

  // data &&
  //   data.courses.last12Months.forEach((item: any) => {
  //     analyticsData.push({ month: item.month, count: item.count });
  //   });

  data &&
    data.forEach((item: any) => {
      analyticsData.push({ month: item.month, count: item.count });
    });

  const minValue = 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`${
            !isDashboard ? "" : "dark:bg-[#111C43] shadow-sm pb-5 rounded-lg"
          }`}
        >
          <div className={`${isDashboard ? "!ml-8 mb-5" : ""}`}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Courses Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 Months Analytics Data{" "}
              </p>
            )}
          </div>
          <div
            className={`w-full ${
              isDashboard ? "h-[30vh]" : "h-screen"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={!isDashboard ? "50%" : "100%"}
            >
              <BarChart width={150} height={300} data={analyticsData}>
                <XAxis dataKey="month">
                  <Label offset={0} position={"insideBottom"} />
                </XAxis>
                <YAxis domain={[minValue, "auto"]} />
                <Bar dataKey="count" fill="#3faf82">
                  <LabelList dataKey="count" position={"top"} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
