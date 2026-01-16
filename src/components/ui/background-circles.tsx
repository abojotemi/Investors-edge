"use client";

import { motion } from "framer-motion";

interface BackgroundCirclesProps {
  variant?: "default" | "dense" | "sparse";
}

const circleConfigs = {
  default: [
    // Green circles
    {
      color: "bg-primary-green/10",
      size: "w-64 h-64",
      top: "top-20",
      left: "left-10",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-green/15",
      size: "w-32 h-32",
      top: "top-1/3",
      right: "right-20",
      blur: "blur-2xl",
    },
    {
      color: "bg-primary-green/10",
      size: "w-48 h-48",
      bottom: "bottom-40",
      left: "left-1/4",
      blur: "blur-3xl",
    },
    // Orange circles
    {
      color: "bg-primary-orange/10",
      size: "w-56 h-56",
      top: "top-40",
      right: "right-10",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-orange/15",
      size: "w-40 h-40",
      bottom: "bottom-20",
      right: "right-1/3",
      blur: "blur-2xl",
    },
    {
      color: "bg-primary-orange/10",
      size: "w-24 h-24",
      top: "top-1/2",
      left: "left-20",
      blur: "blur-xl",
    },
    // Peach circles
    {
      color: "bg-primary-peach/10",
      size: "w-52 h-52",
      bottom: "bottom-10",
      left: "left-10",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-peach/15",
      size: "w-36 h-36",
      top: "top-10",
      right: "right-1/4",
      blur: "blur-2xl",
    },
    {
      color: "bg-primary-peach/10",
      size: "w-44 h-44",
      top: "top-2/3",
      right: "right-10",
      blur: "blur-3xl",
    },
  ],
  dense: [
    // Green circles
    {
      color: "bg-primary-green/10",
      size: "w-72 h-72",
      top: "top-10",
      left: "left-5",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-green/15",
      size: "w-40 h-40",
      top: "top-1/4",
      right: "right-16",
      blur: "blur-2xl",
    },
    {
      color: "bg-primary-green/10",
      size: "w-56 h-56",
      bottom: "bottom-32",
      left: "left-1/3",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-green/15",
      size: "w-28 h-28",
      top: "top-1/2",
      left: "left-1/2",
      blur: "blur-xl",
    },
    // Orange circles
    {
      color: "bg-primary-orange/10",
      size: "w-64 h-64",
      top: "top-32",
      right: "right-5",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-orange/15",
      size: "w-48 h-48",
      bottom: "bottom-16",
      right: "right-1/4",
      blur: "blur-2xl",
    },
    {
      color: "bg-primary-orange/10",
      size: "w-32 h-32",
      top: "top-2/3",
      left: "left-16",
      blur: "blur-xl",
    },
    {
      color: "bg-primary-orange/15",
      size: "w-20 h-20",
      top: "top-20",
      left: "left-1/3",
      blur: "blur-lg",
    },
    // Peach circles
    {
      color: "bg-primary-peach/10",
      size: "w-60 h-60",
      bottom: "bottom-5",
      left: "left-5",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-peach/15",
      size: "w-44 h-44",
      top: "top-5",
      right: "right-1/3",
      blur: "blur-2xl",
    },
    {
      color: "bg-primary-peach/10",
      size: "w-52 h-52",
      top: "top-1/2",
      right: "right-5",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-peach/15",
      size: "w-24 h-24",
      bottom: "bottom-1/3",
      right: "right-16",
      blur: "blur-xl",
    },
  ],
  sparse: [
    // Green circles
    {
      color: "bg-primary-green/10",
      size: "w-72 h-72",
      top: "top-20",
      left: "left-10",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-green/10",
      size: "w-40 h-40",
      bottom: "bottom-40",
      right: "right-1/4",
      blur: "blur-2xl",
    },
    // Orange circles
    {
      color: "bg-primary-orange/10",
      size: "w-64 h-64",
      top: "top-1/3",
      right: "right-10",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-orange/10",
      size: "w-32 h-32",
      bottom: "bottom-20",
      left: "left-1/3",
      blur: "blur-2xl",
    },
    // Peach circles
    {
      color: "bg-primary-peach/10",
      size: "w-56 h-56",
      bottom: "bottom-10",
      left: "left-10",
      blur: "blur-3xl",
    },
    {
      color: "bg-primary-peach/10",
      size: "w-36 h-36",
      top: "top-10",
      right: "right-1/3",
      blur: "blur-2xl",
    },
  ],
};

export default function BackgroundCircles({
  variant = "default",
}: BackgroundCirclesProps) {
  const circles = circleConfigs[variant];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {circles.map((circle, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${circle.color} ${circle.size} ${
            circle.top || ""
          } ${circle.bottom || ""} ${circle.left || ""} ${circle.right || ""} ${
            circle.blur
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
