import { Metadata } from "next";
import SignupPage from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create your account",
};

export default function Signup() {
  return <SignupPage />;
}
