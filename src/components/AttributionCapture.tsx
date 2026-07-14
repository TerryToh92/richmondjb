"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** 落地即捕获广告点击 id + UTM（一次性，存 localStorage）。挂在根 layout。 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
