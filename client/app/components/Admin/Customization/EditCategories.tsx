"use client";
import {
  useEditLayoutMutation,
  useGetLayoutDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

type Props = {};

const EditCategories: FC<Props> = (props) => {
  const { data, isLoading } = useGetLayoutDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: categoriesSuccess, error }] =
    useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data?.layout?.categories);
    }
    if (categoriesSuccess) {
      toast.success("Categories Edited Successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [data, categoriesSuccess, error]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((c) => c.title === "");
  };

  const newCategoriesHandler = () => {
    if (categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty!");
    } else {
      setCategories((prevCategory: any) => [...prevCategory, { title: "" }]);
    }
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data.layout.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories &&
            categories.map((item: any, index: number) => {
              return (
                <div className="p-3">
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] !border-none !text-[16px]`}
                      value={item.title}
                      onChange={(e) =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                      placeholder="Enter category title here..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[16px] cursor-pointer"
                      onClick={() => {
                        setCategories((prevCategory: any) =>
                          prevCategory.filter((i: any) => i._id !== item._id)
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[20px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <br />
          <div className="flex justify-end">
            <div
              className={`${
                styles.button
              } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
                areCategoriesUnchanged(data?.layout?.categories, categories) ||
                isAnyCategoryTitleEmpty(categories)
                  ? "!cursor-not-allowed"
                  : "!cursor-pointer !bg-[#42d383]"
              } !rounded relative right-12`}
              onClick={
                areCategoriesUnchanged(data?.layout?.categories, categories) ||
                isAnyCategoryTitleEmpty(categories)
                  ? () => null
                  : editCategoriesHandler
              }
            >
              Save
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;