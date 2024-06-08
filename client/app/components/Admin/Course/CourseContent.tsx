"use client";
import { toast } from "react-hot-toast";
import { styles } from "../../../../app/styles/style";
import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencil, BsLink45Deg } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any;
  setCourseContentData: (courseContentData: any) => void;
  handleSubmit: any;
};

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );

  const [activeSection, setActiveSection] = useState(1);

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index] = {
      ...updatedData[index],
      links: [...updatedData[index].links, { title: "", url: "" }],
    };
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.videoLength === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
    ) {
      toast.error("Please fill all the fields first!");
    } else {
      let newVideoSection = "";
      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        videoLength: "",
        title: "",
        description: "",
        videoSection: newVideoSection,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const addNewSection = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].videoLength === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Please fill all the fields first!");
    } else {
      setActiveSection(activeSection + 1);
      const newContent = {
        videoUrl: "",
        videoLength: "",
        title: "",
        description: "",
        videoSection: `Untitled Section ${activeSection}`,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
    }
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].description === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === "" ||
      courseContentData[courseContentData.length - 1].videoLength === "" ||
      courseContentData[courseContentData.length - 1].links[0].title === "" ||
      courseContentData[courseContentData.length - 1].links[0].url === ""
    ) {
      toast.error("Section cannot be empty!");
    } else {
      setActive(active + 1);
      handleCourseSubmit();
    }
  };

  return (
    <div className="w-[80%] m-auto p-3">
      <form>
        {courseContentData?.map((item: any, index: number) => {
            const showSectionInput =
              index === 0 ||
              item.videoSection !== courseContentData[index - 1].videoSection;
            return (
              <>
                <div
                  className={`w-full dark:bg-[#cdc8c817] bg-[#71717117] p-4 ${
                    showSectionInput ? "mt-2" : "mb-0"
                  }`}
                >
                  {showSectionInput && (
                    <>
                      <div className="flex w-full items-center">
                        <input
                          type="text"
                          className={`text-[18px] ${
                            item.videoSection === "Untitled Section"
                              ? "w-[170px]"
                              : "w-min"
                          } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                          value={item.videoSection}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index] = {
                              ...updatedData[index],
                              videoSection: e.target.value,
                            };
                            setCourseContentData(updatedData);
                          }}
                        />
                        <BsPencil className="cursor-pointer dark:text-white text-black" />
                      </div>
                      <br />
                    </>
                  )}
                  <div className="flex w-full items-center justify-between my-0">
                    {isCollapsed[index] ? (
                      <>
                        {item.title ? (
                          <p className="font-Poppins text-black dark:text-white">
                            {index + 1}. {item.title}
                          </p>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <div></div>
                    )}
                    <div className="flex items-center">
                      <AiOutlineDelete
                        className={`dark:text-white text-[18px] mr-2 text-black ${
                          index > 0 ? "cursor-pointer" : "cursor-no-drop"
                        }`}
                        onClick={() => {
                          if (index > 0) {
                            const updatedData = [...courseContentData];
                            updatedData.splice(index, 1);
                            setCourseContentData(updatedData);
                          }
                        }}
                      />
                      <MdOutlineKeyboardArrowDown
                        fontSize="large"
                        className="dark:text-white text-black cursor-pointer"
                        style={{
                          transform: isCollapsed[index]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                        onClick={() => handleCollapseToggle(index)}
                      />
                    </div>
                  </div>
                  {!isCollapsed[index] && (
                    <>
                      <div className="my-3">
                        <label className={`${styles.label}`}>Video Title</label>
                        <input
                          type="text"
                          placeholder="Enter video title here..."
                          className={`${styles.input} !text-[14px]`}
                          value={item.title}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index] = {
                              ...updatedData[index],
                              title: e.target.value,
                            };
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className={`${styles.label}`}>Video Url</label>
                        <input
                          type="text"
                          placeholder="Enter video url here..."
                          className={`${styles.input} !text-[14px]`}
                          value={item.videoUrl}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index] = {
                              ...updatedData[index],
                              videoUrl: e.target.value,
                            };
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className={`${styles.label}`}>
                          Video Length (in minutes)
                        </label>
                        <input
                          type="number"
                          placeholder="Enter video length here..."
                          className={`${styles.input} !text-[14px]`}
                          value={item.videoLength}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index] = {
                              ...updatedData[index],
                              videoLength: e.target.value,
                            };
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className={`${styles.label}`}>
                          Video Description
                        </label>
                        <textarea
                          rows={8}
                          cols={30}
                          placeholder="Enter video description here..."
                          className={`${styles.input} !h-min py-2 !text-[14px]`}
                          value={item.description}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index] = {
                              ...updatedData[index],
                              description: e.target.value,
                            };
                            setCourseContentData(updatedData);
                          }}
                        />
                        <br />
                      </div>
                      {item?.links?.map((link: any, linkIndex: number) => (
                          <div key={linkIndex} className="mb-3 block">
                            <div className="w-full flex items-center justify-between">
                              <label className={`${styles.label}`}>
                                Link {linkIndex + 1}
                              </label>
                              <AiOutlineDelete
                                className={`${
                                  linkIndex === 0
                                    ? "cursor-no-drop"
                                    : "cursor-pointer"
                                } text-black dark:text-white text-[20px]`}
                                onClick={() => {
                                  linkIndex === 0
                                    ? null
                                    : handleRemoveLink(index, linkIndex);
                                }}
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Enter link title here..."
                              className={`${styles.input} !text-[14px]`}
                              value={link.title}
                              onChange={(e) => {
                                const updatedData = [...courseContentData];
                                updatedData[index].links = [
                                  ...updatedData[index].links.slice(
                                    0,
                                    linkIndex
                                  ),
                                  {
                                    title: e.target.value,
                                    url: updatedData[index].links[linkIndex]
                                      .url,
                                  },
                                  ...updatedData[index].links.slice(
                                    linkIndex + 1
                                  ),
                                ];
                                setCourseContentData(updatedData);
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Enter link url here..."
                              className={`${styles.input} !text-[14px]`}
                              value={link.url}
                              onChange={(e) => {
                                const updatedData = [...courseContentData];
                                updatedData[index].links = [
                                  ...updatedData[index].links.slice(
                                    0,
                                    linkIndex
                                  ),
                                  {
                                    title:
                                      updatedData[index].links[linkIndex].title,
                                    url: e.target.value,
                                  },
                                  ...updatedData[index].links.slice(
                                    linkIndex + 1
                                  ),
                                ];
                                setCourseContentData(updatedData);
                              }}
                            />
                          </div>
                        ))}
                      <br />
                      <div className="inline-block mb-4">
                        <p
                          className="flex items-center text-[16px] dark:text-white text-black cursor-pointer"
                          onClick={() => handleAddLink(index)}
                        >
                          <BsLink45Deg className="mr-2" />
                          Add Link
                        </p>
                      </div>
                    </>
                  )}
                  <br />
                  {index === courseContentData.length - 1 && (
                    <div>
                      <p
                        className="flex items-center text-[16px] dark:text-white text-black cursor-pointer"
                        onClick={(e: any) => newContentHandler(item)}
                      >
                        <AiOutlinePlusCircle className="mr-2" />
                        Add New Content
                      </p>
                    </div>
                  )}
                </div>
              </>
            );
          })}
        <br />
        <div
          className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" />
          Add New Section
        </div>
      </form>
      <br />
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
      <br />
      <br />
      <br />
    </div>
  );
};

export default CourseContent;
