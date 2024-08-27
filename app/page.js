"use client";

import LandingPage from "./landing/page";
import SigninPage from "./login/page";
import SignupPage from "./signup/page";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  if (pathname == "/signup") {
    return <LandingPage />;
  }
  if (pathname == "/login") {
    return <SigninPage />;
  }

  return <SignupPage />;
};

export default Page;
