"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Appbar />
      <div className="flex justify-center px-4">
        <div className="flex flex-col md:flex-row pt-8 max-w-5xl w-full gap-8">
          {/* Left: Features */}
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

          {/* Right: Signup Form */}
          <div className="flex-1 w-full md:w-1/2 p-6 border rounded">
            <Input
              label={"Name"}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your name"
            />
            <Input
              label={"Email"}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Your Email"
            />
            <Input
              label={"Password"}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <div className="pt-4">
              <PrimaryButton
                onClick={async () => {
                  const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
                    username: email,
                    password,
                    name,
                  });
                  router.push("/login");
                }}
                size="big"
              >
                Get started free
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
