"use client";

import { useEffect } from "react";
import { AwsRum, AwsRumConfig } from "aws-rum-web";

const config: AwsRumConfig = {
  sessionSampleRate: 1,
  identityPoolId: "us-east-1:e1e4d41d-4f54-4fb0-b9c8-04bba0f1cd56",
  endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
  telemetries: ["errors", "performance", "http"],
  allowCookies: true,
  enableXRay: false,
  signing: true,
};

const APPLICATION_ID = "684551e1-e1cc-4491-8979-395646dc903e";
const APPLICATION_VERSION = "1.0.0";
const APPLICATION_REGION = "us-east-1";

export function RumInit() {
  useEffect(() => {
    try {
      new AwsRum(
        APPLICATION_ID,
        APPLICATION_VERSION,
        APPLICATION_REGION,
        config
      );
    } catch (error) {
      console.error("CloudWatch RUM initialization failed", error);
    }
  }, []);

  return null;
}
