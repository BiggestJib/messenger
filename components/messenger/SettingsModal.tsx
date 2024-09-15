"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./Modal";
import Input from "./Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "./Button";

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="  z-50 space-y-12">
          <div className="border-b border-gray-500/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit Your Public Information
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <div className="relative inline-block rounded-full overflow-hidden w-9 h-9 md:h-11 md:w-11">
                    <CldUploadButton
                      options={{
                        maxFiles: 1, // Restrict to 1 file per upload
                        resourceType: "image", // Restrict to images only
                        clientAllowedFormats: ["jpg", "jpeg", "png", "gif"], // Allow specific image formats
                      }}
                      uploadPreset="acadrd0w" // Cloudinary upload preset
                      onSuccess={handleUpload} // Handle successful upload
                    >
                      <Image
                        width="48"
                        height="48"
                        className="rounded-full"
                        src={image || currentUser?.image || "/images/R.jpeg"}
                        alt="Avatar"
                      />
                    </CldUploadButton>
                  </div>

                  <CldUploadButton
                    options={{
                      maxFiles: 1, // Restrict to 1 file per upload
                      resourceType: "image", // Restrict to images only
                      clientAllowedFormats: ["jpg", "jpeg", "png", "gif"], // Allow specific image formats
                    }}
                    uploadPreset="acadrd0w" // Cloudinary upload preset
                    onSuccess={handleUpload} // Handle successful upload
                  >
                    <Button secondary type="button" disabled={isLoading}>
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mt-6 items-center justify-end gap-x-6">
            <Button secondary onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingModal;
