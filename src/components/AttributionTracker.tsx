"use client";

import { useEffect } from "react";
import { captureAcquisitionTouchpoint } from "@/lib/acquisition";

export default function AttributionTracker() {
  useEffect(() => {
    captureAcquisitionTouchpoint();
  }, []);

  return null;
}
