"use client";

import React, { useEffect } from "react";
import {  useRouter , usePathname  } from "next/navigation";

import { useRive} from "rive-react";


const Loader = () => {
  const router = useRouter();
  //current pathname by next/navigation
  const pathname = usePathname();
  console.log(pathname);

  
  useEffect(() => { // redirect to "/welcome" only if current pathname is "/"
    if (pathname==="/") {
      const timer = setTimeout(() => {
        router.push("/welcome");
      }, 1500); // Adjust the duration as needed
      return () => clearTimeout(timer);
      
    }
  }, [router]);

  const { RiveComponent } = useRive({
    src: "/animations/mixing_animations.riv", // Replace with your loader .riv file path
    autoplay: true,
  });

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="w-1/2 h-1/2">
        <RiveComponent />
      </div>
    </div>
  );
};

export default Loader;