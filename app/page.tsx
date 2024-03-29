import Image from "next/image";
import ConnectButton from "@/components/connect-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectButton />
    </main>
  );
}
