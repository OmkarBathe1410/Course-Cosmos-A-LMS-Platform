import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="!text-slate-950 dark:!text-white font-Poppins">
      <br />
      <h1 className="font-Poppins min-[240px]:text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-center py-2 !text-slate-950 dark:!text-white !font-semibold">
        What actually is <span className="text-gradient">Course Cosmos</span>?
      </h1>
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto text-justify">
        <p className="min-[240px]:text-sm sm:text-base xl:text-lg">
          Are your ready to take your programming skills to the next level? Look
          no further than Course Cosmos, the premium programming community
          dedicated to helping new programmers achieve their goals and reach
          their full potential
          <br />
          <br />
          As the founder of Course Cosmos, I know firsthand the challenges that
          come with learning and growing in the programming industry.
          That&apos;s why I created Course Cosmos - to provide new programmers
          with the resources and support they need to succeed.
          <br />
          <br />
          Our affordable courses are designed to give you the high-quality
          education you need to succeed in the industry, without breaking the
          bank.
          <br />
          <br />
          At Course Cosmos, we believe that price should never be a barrier to
          achieving your dreams. That&apos;s why our courses are priced low - so
          that anyone, regardless of their financial situation, can access the
          tools and knowledge they need to succeed.
          <br />
          <br />
          But Course Cosmos is more than just a community - we&apos;re a family.
          Our supportive community of like-minded individuals is here to help
          you every step of the way, whether you&apos;re just starting out or
          looking to take your skills to the next level.
          <br />
          <br />
          With Course Cosmos by your side, there&apos;s nothing standing between
          you and your dream job. Our courses and community will provide you
          with the guidance, support, and motivation you need to unleash your
          full potential and become a skilled programmer.
          <br />
          <br />
          So what are you waiting for? Join the Course Cosmos family today and
          let&apos;s conquer the programming industry together! With our
          affordable courses, informative videos, and supportive community, the
          sky&apos;s the limit.
        </p>
        <br />
        <br />
        <div className="flex flex-col items-center text-center">
          <h1 className="min-[240px]:text-lg min-[460px]:text-xl lg:text-2xl !font-semibold">
            Omkar Satish Bathe
            <span className="block min-[240px]:text-sm min-[460px]:text-sm lg:text-base !font-medium">
              Founder of Course Cosmos
            </span>
          </h1>
        </div>
      </div>
      <br />
    </div>
  );
};

export default About;
