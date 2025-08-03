"use client"
import { useRouter } from "next/navigation"
import { Feature } from "./Feature"
import { PrimaryButton } from "./buttons/PrimaryButton"
import { SecondaryButton } from "./buttons/SecondaryButton"

export const Hero = () => {
    const router = useRouter();
    return (
        <div className="px-4">
            <div className="flex justify-center">
                <div className="text-3xl sm:text-5xl font-bold text-center pt-8 max-w-xl">
                    Automate as fast as you can type    
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <div className="text-base sm:text-xl font-normal text-center pt-4 max-w-2xl">
                    AI gives you automation superpowers, and Axon puts them to work. Pairing AI and Axon helps you turn ideas into workflows and bots that work for you.
                </div>
            </div>

            <div className="flex justify-center pt-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <PrimaryButton onClick={() => {
                        router.push("/signup")
                    }} size="big">
                        Get Started Free
                    </PrimaryButton>
                    <SecondaryButton onClick={() => {}} size="big">
                        Contact Sales
                    </SecondaryButton>
                </div>
            </div>

            <div className="hidden sm:flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 text-center">
                <Feature title={"Free Forever"} subtitle={"for core features"} />
                <Feature title={"More apps"} subtitle={"than any other platforms"} />
                <Feature title={"Cutting Edge"} subtitle={"AI Features"} />
            </div>

        </div>
    );
}
