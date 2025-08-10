"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppContainer } from "@/components/AppContainer";
import { ChatLogo } from "@/components/icons/ChatLogo";

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
    <AppContainer className="bg-primary dark:bg-primary">
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
              <ChatLogo className="w-24 h-24 text-primary-foreground" />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold text-primary-foreground mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              ChattyLite
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}
