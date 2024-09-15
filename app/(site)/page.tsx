import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="flex min-h-full justify-center sm:px-6 lg:px-8 bg-gray-100 py-12  flex-col ">
      <div className="sm:mx-auto bg-sky-500  pb-4 sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height="96"
          width="96"
          className="mx-auto w-auto"
          src="/images/logo.png"
          quality={100}
          priority
        />
        <h2 className=" text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to Your account!
        </h2>
      </div>

      <AuthForm />
    </div>
  );
}
