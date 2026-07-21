import { AppLink } from "@/components/navigation/AppLink";
import Link from "next/link";

export function About() {
  return (
    <section className="section-p-x ">
      <div className=" grid-main sm:grid grid-cols-12 flex-center">
        <div className="indent-[1.5em] lg:col-start-3 xl:col-start-3 col-span-10 lg:col-span-7 xl:col-span-6  text-left">
          <div className="inline-block align-text-bottom aspect-square min-w-60 max-w-[37%] mr-[0.5em] ">
            <img
              src="/img/picture-of-wailee.jpg"
              alt="Wailee Oluwaferanmi Ayeni"
              className=" size-full object-cover "
            />
          </div>

          <span>
            Hey, I’m Wailee. I’m a developer & designer. I’m a freelance web designer and developer working across full-stack builds, UI/UX design, and the occasional data-heavy project — I care as much about how a product feels to use as how well it's engineered underneath.
          </span>
        </div>
      </div>
      
      <div className="hidden mgrid-main  mxs:grid">
        <div className="  col-span-full sm:col-span-10 md:col-span-7 lg:col-span-7 xl:col-span-6  lg:col-start-2 xl:col-start-2  leading-[1.27em]n leading-[1.3] tracking-[0.02em] text-[clamp(1*1rem,((1-((1.25-1)/(128-20)*20))*1rem+((1.25-1)/(128-20))*100vw),1.25*1rem)]">
          <p className="  ">
            Hey, I’m Wailee. I’m a developer & designer. I build unique products and intriguing experiences.
            Established in 2021, SIRNIK is a design and development studio working on digital products and websites. Our approach is built around structure, systems, and clear design decisions. We focus on creating interfaces and experiences that are composed, functional, and visually precise. Every project is shaped through thoughtful design and technical execution, resulting in digital work that feels coherent and considered.
          </p>
        </div>
      </div>
    </section>
  );
}
