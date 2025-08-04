"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <div className="flex flex-col sm:flex-row border-b justify-between items-center p-4 space-y-4 sm:space-y-0">
      <div className="text-2xl font-extrabold">Axon</div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <LinkButton onClick={() => {}}>Contact Sales</LinkButton>

        {!isAuthenticated ? (
          <>
            <LinkButton onClick={() => router.push("/login")}>Login</LinkButton>
            <PrimaryButton onClick={() => router.push("/signup")}>Signup</PrimaryButton>
          </>
        ) : (
          <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
        )}
      </div>
    </div>
  );
};
