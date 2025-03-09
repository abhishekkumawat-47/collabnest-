"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRive } from "rive-react";

const Loader = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/welcome");
    }, 4000); // Adjust the duration as needed

    return () => clearTimeout(timer);
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