import { AppLink } from "@/components/navigation/AppLink";
import Link from "next/link";

export function About() {
  return (
    <section className="section-p-x p-[3em] ">
      <div className="grid-main  xs:grid">
        <div className="  col-span-full sm:col-span-10 md:col-span-7 lg:col-span-7 xl:col-span-4  lg:col-start-2 xl:col-start-2  leading-[1.27em] tracking-[0.02em] text-[clamp(1*1rem,((1-((1.25-1)/(128-20)*20))*1rem+((1.25-1)/(128-20))*100vw),1.25*1rem)]">
          <p className="  ">
            Hello, my name is Wailee. I’m a developer & designer. I build unique products and intriguing experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
