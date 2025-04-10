"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
