"use client";

import ConnectButton from "@/components/connect-button";
import {useState} from "react";
import StepConnectWallet from "@/app/(main)/step-connect-wallet";
import StepMint from "@/app/(main)/step-mint";

enum EStep {
    CONNECT,
    MINT
}

export default function Home() {
    const [step, setStep] = useState(EStep.MINT);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {step === EStep.CONNECT && (
                <StepConnectWallet/>
            )}
            {step === EStep.MINT && (
                <StepMint/>
            )}
        </main>
    );
}
