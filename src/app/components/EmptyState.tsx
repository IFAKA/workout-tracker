"use client";

import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export type LucideIconName = keyof typeof LucideIcons;
export type EmptyStateSize = "default" | "small";

interface EmptyStateProps {
  icon: LucideIconName;
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonOnClick?: () => void;
  size?: EmptyStateSize;
}

const calculateReadingTime = (text: string, wordsPerMinute = 200): number => {
  const words = text.trim().split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  return Math.ceil(minutes * 60 * 1000);
};

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: iconName,
  title,
  description,
  buttonText,
  buttonHref,
  buttonOnClick,
  size = "default",
}) => {
  const [wiggle, setWiggle] = useState(false);
  const Icon = LucideIcons[iconName] as React.ElementType;

  useEffect(() => {
    if (buttonText) {
      const combinedText = `${title} ${description} ${buttonText}`;
      const readingTime = calculateReadingTime(combinedText);

      const timer = setTimeout(() => setWiggle(true), readingTime);
      return () => clearTimeout(timer);
    }
  }, [title, description, buttonText]);

  const buttonClass = `${wiggle ? "wiggle-animation" : ""}`;

  const sizeStyles = {
    default: {
      container: "w-72",
      icon: 64,
      titleClass: "text-2xl font-semibold",
      descriptionClass: "text-gray-600 mb-2 text-balance",
    },
    small: {
      container: "w-48",
      icon: 32,
      titleClass: "text-lg font-semibold",
      descriptionClass: "text-gray-600 mb-1 text-xs text-balance",
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${currentSize.container} mt-8 mb-5 mx-auto`}
    >
      <Icon size={currentSize.icon} className="text-gray-400" />
      <h2 className={currentSize.titleClass}>{title}</h2>
      <p className={currentSize.descriptionClass}>{description}</p>
      {buttonText && (
        <>
          {buttonHref ? (
            <Link href={buttonHref} passHref legacyBehavior>
              <Button
                size={size === "small" ? "sm" : "lg"}
                asChild
                className={buttonClass}
              >
                <a>{buttonText}</a>
              </Button>
            </Link>
          ) : buttonOnClick ? (
            <Button
              size={size === "small" ? "sm" : "lg"}
              onClick={buttonOnClick}
              className={buttonClass}
            >
              {buttonText}
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
};

export default EmptyState;
