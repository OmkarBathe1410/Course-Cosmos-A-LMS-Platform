import React from "react";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div className="text-slate-950 dark:!text-white font-Poppins">
      <br />
      <h1 className="font-Poppins min-[240px]:text-xl sm:text-2xl lg:text-3xl text-center py-2 !text-slate-950 dark:!text-white !font-semibold">
        Terms and Conditions
      </h1>
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto text-justify">
        <p className="min-[240px]:text-sm sm:text-base xl:text-lg">
          These Terms and Conditions ("Terms") govern your use of the Course
          Cosmos platform ("Platform"), which includes all services, features,
          and content provided by Course Cosmos.
          <br />
          <br />
          By using the Platform, you agree to be bound by these Terms:
          <br />
          <br />
          1. Account Creation and Use: To use the Platform, you must create an
          account. You must provide accurate and complete information during the
          registration process. You are responsible for maintaining the
          confidentiality of your account and password. You agree not to share
          your account or password with anyone.
          <br />
          2. Content and Ownership: The Platform contains content, including
          text, images, videos, and other materials ("Content"). The Content is
          owned by Course Cosmos or its licensors. You are granted a limited
          license to use the Content for personal, non-commercial purposes. You
          agree not to reproduce, modify, or distribute the Content without
          permission.
          <br />
          3. Payment: Course Cosmos offers various payment plans and courses.
          You agree to pay for the services you use, and you are responsible for
          any applicable taxes.
          <br />
          4. Dispute Resolution: Any disputes arising from these Terms will be
          resolved through arbitration, as described in the arbitration clause.
          <br />
          5. Changes to Terms: Course Cosmos reserves the right to modify these
          Terms at any time. You agree to review these Terms regularly and be
          bound by any changes.
          <br />
          <br />
          By using the Platform, you acknowledge that you have read, understand,
          and agree to be bound by these Terms.
        </p>
      </div>
      <br />
    </div>
  );
};

export default Policy;
