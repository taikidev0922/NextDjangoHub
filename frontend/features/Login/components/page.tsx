"use client";
import { useAuth } from "@/context/AuthContext";
import { request } from "@/lib/axiosUtils";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { useLoading } from "@/context/LoadingContext";

export default function Login() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const { login } = useAuth();
  const onSubmit = async (username: string, password: string) => {
    const data = {
      username,
      password,
    };
    startLoading();
    const res = await request({
      url: "/api/v1/auth/login/",
      method: "post",
      data,
    });
    login(res.data.user, res.data.access_token);
    stopLoading();
    router.replace("/sample");
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <LoginForm login={onSubmit} />
    </section>
  );
}
