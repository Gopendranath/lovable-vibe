"use client";

import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image
            src={"/logo.svg"}
            alt="Lovable_vibe"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
        <p className="text-muted-foreground text-center text-sm md:text-background">
          Choose the plan that fits your needs.
        </p>
      </section>
      <PricingTable
        appearance={{
          theme: currentTheme === "dark" ? dark : undefined,
          elements: {
            pricingTable: "border! shadow-none! rounded-lg!",
          },
        }}
      />
    </div>
  );
};

export default Page;
