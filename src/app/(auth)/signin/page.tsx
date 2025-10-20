import { Metadata } from "next";
import SigninForm from "@/components/SigninForm"; // Client component

export const metadata: Metadata = {
  title: "Signin",
  description: "Signin to your account",
};

export default function SigninPage() {
  return <SigninForm />;
}
