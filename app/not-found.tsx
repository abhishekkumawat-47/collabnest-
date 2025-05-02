"use client"

import React, { useEffect, useState } from "react";
import { useRive } from "rive-react";

const NotFoundPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { RiveComponent } = useRive({
    src: "/animations/404_purple.riv",
    autoplay: true,
  });

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen mb-20 mt-[-50px]">
      <div className="w-full h-3/4">
        <RiveComponent />
      </div>
      
    </div>
  );
};

export default NotFoundPage;
