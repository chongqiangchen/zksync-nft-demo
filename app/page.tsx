"use client";

import ConnectButton from "@/components/connect-button";
import {useState} from "react";

enum EStep {
    CONNECT,
    MINT
}

export default function Home() {
    const [step, setStep] = useState(EStep.MINT);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {step === EStep.CONNECT && (
                <div className="px-10 py-8 bg-[#ffffff] rounded-lg shadow">
                    STEP1 CONNECT WALLET
                </div>
            )}
            {step === EStep.MINT && (
                <div className="px-10 py-8 bg-[#1E1E1E] rounded-lg shadow text-[#ffffff]">
                    STEP2 MINT NFT
                </div>
            )}
        </main>
    );
}
