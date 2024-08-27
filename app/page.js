"use client";

import LandingPage from "./landing/page";
import LoginPage from "./signIn/page";
import SignupPage from "./signup/page";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  if (pathname == "/signup") {
    return <LandingPage />;
  }
  if (pathname == "/signIn") {
    return <LoginPage />;
  }

  return <SignupPage />;
};

export default Page;
