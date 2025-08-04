"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div>
      {/* <Appbar /> */}
    <div className="flex justify-center px-4">
  <div className="flex flex-col md:flex-row pt-8 max-w-5xl w-full gap-8">
    {/* Left Side - Features */}
    <div className="flex-1 w-full md:w-1/2 pt-10">
      <div className="font-semibold text-3xl pb-4">
        Join millions worldwide who automate their work using Axon.
      </div>
      <div className="pb-4 pt-4">
        <CheckFeature label={"Easy setup, no coding required"} />
      </div>
      <div className="pb-4">
        <CheckFeature label={"Free forever for core features"} />
      </div>
      <CheckFeature label={"14-day trial of premium features & apps"} />
    </div>

    {/* Right Side - Form */}
    <div className="flex-1 w-full md:w-1/2 p-6 border rounded">
      <Input
        onChange={(e) => setEmail(e.target.value)}
        label={"Email"}
        type="text"
        placeholder="Your Email"
      />
      <Input
        onChange={(e) => setPassword(e.target.value)}
        label={"Password"}
        type="password"
        placeholder="Password"
      />
      <div className="pt-4">
        <PrimaryButton
          onClick={async () => {
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
              username: email,
              password,
            });
            localStorage.setItem("token", res.data.token);
            router.push("/dashboard");
          }}
          size="big"
        >
          Login
        </PrimaryButton>
      </div>
    </div>
  </div>
</div>

    </div>
  );
}
