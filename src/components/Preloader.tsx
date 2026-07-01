"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import styles from "./Preloader.module.css";

interface PreloaderProps {
  loading?: boolean;
}

export default function Preloader({ loading: externalLoading }: PreloaderProps) {
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    // Only use internal loading if externalLoading is not provided
    if (externalLoading !== undefined) return;

    const handleLoad = () => {
      setTimeout(() => setInternalLoading(false), 800);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [externalLoading]);

  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.preloader}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          <div className={styles.content}>
            <motion.div
              className={styles.iconWrapper}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <Loader2 className={styles.icon} />
            </motion.div>

            <p className={styles.loadingText}>AiHospitalERP</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
