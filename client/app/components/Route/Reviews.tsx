import { styles } from "../../../app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Gene Bates",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Student | Cambridge University",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quis accusamus vitae rem sequi laudantium eius quos alias quam nostrum.",
    ratings: 4.5,
  },
  {
    name: "Sophia Nguyen",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Software Engineer | Google",
    ratings: 4,
    comment:
      "Technology has the power to transform the world, and I'm passionate about using it to create positive change. Let's build something amazing together!",
  },
  {
    name: "Liam Patel",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    profession: "Entrepreneur | Founder, Acme Corp",
    ratings: 3,
    comment:
      "Entrepreneurship is about taking risks, embracing challenges, and turning dreams into reality. I'm excited to share my journey and inspire others to do the same.",
  },
  {
    name: "Olivia Hernandez",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    profession: "Graphic Designer | Freelance",
    ratings: 3.5,
    comment:
      "Design is not just about aesthetics, it's about creating experiences that captivate and inspire. I love bringing ideas to life and seeing the impact they can have.",
  },
  {
    name: "Ethan Gonzalez",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    profession: "Researcher | University of Oxford",
    ratings: 4,
    comment:
      "Curiosity and a thirst for knowledge drive me to explore the unknown and push the boundaries of what's possible. I'm dedicated to uncovering new insights that can make a difference.",
  },
  {
    name: "Isabella Morales",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    profession: "Nonprofit Director | Habitat for Humanity",
    ratings: 4,
    comment:
      "Giving back to the community and making a positive impact on people's lives is my passion. I'm committed to using my skills and resources to create a more just and equitable world.",
  },
  {
    name: "Jacob Ramirez",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    profession: "Chef | Owner, Bistro Deluxe",
    ratings: 2.5,
    comment:
      "Food is not just sustenance, it's an art form that brings people together and nourishes the soul. I'm dedicated to crafting exceptional culinary experiences that delight the senses and inspire the palate.",
  },
];

const Reviews = () => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assets/reviews-bg.png")}
            alt="review-bg"
            width={600}
            height={600}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3
            className={`${styles.title} !text-slate-950 font-semibold dark:!text-white sm:!text-[2rem] md:!text-[2rem] lg:!text-[2rem] xl:!text-[2.3rem]`}
          >
            Our Students Are Our{" "}
            <span className="dark:bg-gradient-to-l bg-gradient-to-r from-blue-800 via-violet-500 to-blue-800 bg-clip-text text-transparent transition duration-1000">
              Strength
            </span>{" "}
            <br /> See What They Say About Us
          </h3>
          <br />
          <p className={`${styles.label}`}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est ab
            quos voluptates quod. Sint nulla minima saepe facilis quidem et
            maiores harum voluptas.
          </p>
        </div>
        <br />
        <br />
      </div>
      <br />
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-[0]">
        {reviews &&
          reviews.map((item: any, index: number) => (
            <ReviewCard item={item} key={index} />
          ))}
      </div>
    </div>
  );
};

export default Reviews;
