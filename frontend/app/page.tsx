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


 useEffect(() => {
  const pingServices = () => {
    fetch("https://axon-b6it.onrender.com/").catch(() => {});
    fetch("https://axon-worker.onrender.com/").catch(() => {});
  };


  pingServices();

  const interval = setInterval(pingServices, 3000);

  return () => clearInterval(interval);
}, []);


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
