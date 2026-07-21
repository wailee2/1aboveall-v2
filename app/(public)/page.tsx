import type { Metadata } from "next";
import { Hero } from '@/app/(public)/home/Hero';
import { About } from "@/app/(public)/home/About";
import { SelectedWorks } from "@/app/(public)/home/SelectedWorks";
import { Services } from "@/app/(public)/home/Services";
import { CTA } from "@/app/(public)/home/CTA";
import FluidTypographyVisualizer from "@/components/FluidTypographyVisualizer";

export const metadata: Metadata = {
  title: "Home",
};



export default function Home() {
  return (
    <div className="">
      <main className="space-y-[7em]">
        <Hero/>
        <About/>
        <SelectedWorks/>
        <Services/>
        <CTA/>
      </main>
    </div>
  );
}
