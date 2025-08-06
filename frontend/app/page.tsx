"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="pb-48">
      <Appbar />
      <Hero />
      <div className="pt-8">
      <HeroVideo />
      </div>
      <Footer/>
    </main>
  );
}
