import React, { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

const LoadingModal = () => {
  return (
    <Transition show as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {}}
        aria-labelledby="loading-modal"
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 transition-opacity bg-opacity-75" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="flex items-center justify-center">
              {/* Custom CSS-based loader */}
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoadingModal;
