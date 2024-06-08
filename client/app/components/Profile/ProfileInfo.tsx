import Image from "next/image";
import { styles } from "../../../app/styles/style";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "../../../redux/features/user/userApi";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess: avatarSuccess, error: avatarError }] =
    useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);
  const { isLoading } = useLoadUserQuery(undefined, {
    skip: loadUser ? false : true,
  });
  const [editProfile, { isSuccess: profileSuccess, error: profileError }] =
    useEditProfileMutation();

  const imageHandler = async (e: any) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          const avatar = fileReader.result;
          updateAvatar(avatar);
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    } else {
      toast.error(
        "Please upload a valid image file (PNG, JPEG, JPG, WEBP) and ensure it's less than 5MB."
      );
    }
  };

  useEffect(() => {
    if (avatarSuccess || profileSuccess) {
      setLoadUser(true);
      toast.success("Profile updated successfully!");
    }
    if (avatarError) {
      if ("data" in avatarError) {
        const errorData = avatarError as any;
        toast.error(errorData.data.message);
      }
    }
    if (profileError) {
      if ("data" in profileError) {
        const errorData = profileError as any;
        toast.error(errorData.data.message);
      }
    }
  }, [avatarSuccess, profileSuccess, avatarError, profileError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (name.trim() === "") {
      toast.error("Name cannot be empty.");
      return;
    }

    if (name !== user.name) {
      await editProfile({
        name: name,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex justify-center">
            <div className="relative">
              <Image
                src={
                  user.avatar || avatar ? user.avatar.url || avatar : avatarIcon
                }
                alt=""
                width={120}
                height={120}
                className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
              />
              <input
                type="file"
                name=""
                id="avatar"
                className="hidden"
                onChange={imageHandler}
                accept="image/png, image/jpeg, image/jpg, image/webp"
              />
              <label htmlFor="avatar">
                <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                  <AiOutlineCamera size={20} className="z-1" />
                </div>
              </label>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full p-6 800px:pl-10">
            <form onSubmit={handleSubmit}>
              <div className="800px:w-[50%] m-auto block pb-4">
                <div className="w-[100%]">
                  <label className="block text-black dark:text-[#fff]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} mb-4 800px:mb-0 text-black dark:text-[#fff]`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] pt-2">
                  <label className="block text-black dark:text-[#fff]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`${styles.input} mb-1 800px:mb-0 text-black dark:text-[#fff]`}
                    required
                    value={user?.email}
                    disabled
                  />
                </div>
                <input
                  className={`w-full h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
                  value="Update"
                  type="submit"
                />
              </div>
            </form>
            <br />
          </div>
        </>
      )}
    </>
  );
};

export default ProfileInfo;
