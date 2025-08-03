"use client";
import { useRouter } from "next/navigation"
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row border-b justify-between items-center p-4 space-y-4 sm:space-y-0">
      <div className="text-2xl font-extrabold">Axon</div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <LinkButton onClick={() => {}}>Contact Sales</LinkButton>

        <LinkButton onClick={() => {
          router.push("/login")
        }}>Login</LinkButton>

        <PrimaryButton onClick={() => {
          router.push("/signup")
        }}>
          Signup
        </PrimaryButton>
      </div>
    </div>
  );
};
