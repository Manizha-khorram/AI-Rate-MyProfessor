"use client";

import LandingPage from "./landing/page";
import LoginPage from "./signin/page";
import SignupPage from "./signup/page";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  if (pathname == "/signup") {
    return <LandingPage />;
  }
  if (pathname == "/signin") {
    return <LoginPage />;
  }

  return <SignupPage />;
};

export default Page;
