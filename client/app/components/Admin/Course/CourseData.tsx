"use client";
import { styles } from "../../../../app/styles/style";
import React, { FC } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";
import toast from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = [...benefits];
    updatedBenefits.splice(index, 1);
    setBenefits(updatedBenefits);
  };

  const handlepPrerequisiteChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const handleRemovePrerequisite = (index: number) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites.splice(index, 1);
    setPrerequisites(updatedPrerequisites);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill the fields before going further!");
    }
  };

  return (
    <div className="w-[80%] m-auto block">
      <div>
        <label htmlFor="email" className={`${styles.label}`}>
          What are the benefits for students in this course?
        </label>
        <br />
        {benefits?.map((benefit: any, index: number) => (
          <>
            <input
              type="text"
              key={index}
              name="benefits"
              placeholder="Benefits of the course..."
              required
              className={`${styles.input} my-2 text-[14px]`}
              value={benefit.title}
              onChange={(e) => handleBenefitChange(index, e.target.value)}
            />
            <div className="flex items-center justify-between">
              <IoIosAddCircle
                className="my-[5px] mx-[0px] cursor-pointer text-slate-800 text-2xl dark:text-white"
                onClick={handleAddBenefit}
              />
              <AiFillMinusCircle
                className={`my-[5px] mx-[0px] cursor-pointer text-slate-800 text-2xl dark:text-white ${
                  benefits.length === 1 ? "hidden" : ""
                }`}
                onClick={(e) => handleRemoveBenefit(index)}
              />
            </div>
          </>
        ))}
      </div>
      <br />
      <div>
        <label htmlFor="email" className={`${styles.label}`}>
          What are the prerequisites for starting this course?
        </label>
        <br />
        {prerequisites?.map((prerequisite: any, index: number) => (
          <>
            <input
              type="text"
              key={index}
              name="prerequisites"
              placeholder="Prerequisites of the course..."
              required
              className={`${styles.input} my-2 text-[14px]`}
              value={prerequisite.title}
              onChange={(e) => handlepPrerequisiteChange(index, e.target.value)}
            />
            <div className="flex items-center justify-between">
              <IoIosAddCircle
                className="my-[5px] mx-[0px] cursor-pointer text-slate-800 text-2xl dark:text-white"
                onClick={handleAddPrerequisite}
              />
              <AiFillMinusCircle
                className={`my-[5px] mx-[0px] cursor-pointer text-slate-800 text-2xl dark:text-white ${
                  prerequisites.length === 1 ? "hidden" : ""
                }`}
                onClick={(e) => handleRemovePrerequisite(index)}
              />
            </div>
          </>
        ))}
      </div>
      <div className="w-full flex items-center justify-between">
        <div
          className={`${styles.prev_next_button}`}
          onClick={() => prevButton()}
        >
          Prev
        </div>
        <div
          className={`${styles.prev_next_button}`}
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
