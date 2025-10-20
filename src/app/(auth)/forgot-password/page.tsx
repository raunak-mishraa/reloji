import { Metadata } from "next";
import ForgotPasswordPage from "@/components/ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
