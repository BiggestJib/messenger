"use client";
import React from "react";
import Modal from "./Modal";
import Image from "next/image";
interface ImageModalProps {
  src: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return;
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="h-80 w-80">
        <Image
          src={src}
          alt="Image"
          fill
          className={`object-cover transition-opacity duration-500 ease-in-out `}
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
