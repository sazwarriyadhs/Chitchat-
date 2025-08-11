
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppContainer } from "@/components/AppContainer";
import Image from "next/image";

export default function SplashPage() {
  const [isShowing, setIsShowing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowing(false);
    }, 2000); 

    const redirectTimer = setTimeout(() => {
        router.push('/login');
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    }
  }, [router]);

  return (
    <AppContainer className="bg-card">
      <AnimatePresence>
        {isShowing && (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <Image src="https://storage.googleapis.com/stedi-dev-public/logomarker.png" alt="ChitChat Logo" width={240} height={120} className="w-auto h-72" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

    