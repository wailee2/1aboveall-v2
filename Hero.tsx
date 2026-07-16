import React from "react";
import ScrollReveal from '@/components/ScrollReveal';

export default function Hero() {
  return (
    <section id="home">
      <ScrollReveal
        className="p-0 text-[#22293c]" 
        innerClassName="bg-black pointer-events-none"
        startHeightVh={1.2}
        endHeightVh={100}
        startWidthPercent={75}
        endWidthPercent={100}
        pinDurationVh={300}
        ease="power3.out"
        durationMs={200}
      >
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-(--text) z-5 bg-(--primary-color)s " />jd
          </div>
          
          <div className="relative z-10 flex items-center justify-center h-full w-full pointer-events-auto">
            <h1 className="text-4xl font-bold hicdden text-[#131010]s text-[#4a71c4]">Wailee</h1>
            <h1 className='text-[#4a71c4]'>wwwwwww</h1>
          </div>
        </div>
        <div className="absolute bottom-5 right-10 header-nav-links">[SCROLL 👇🏿]</div>
      </ScrollReveal>
    </section>
  );
}
