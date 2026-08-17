import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/ambassador/",
          "/api/",
          "/admin/",
          "/super-admin/",
          "/student-portal/",
          "/facilitator-hub/",
          "/partner-portal/",
          "/employer-hub/",
        ],
      },
    ],
  };
}
