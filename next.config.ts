import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // BUILD6_BOOKS_TOOLKITS_TRACE
  outputFileTracingIncludes: {
    "/api/admin/books-toolkits/free-book": ["./protected-resources/books-toolkits/BUILD6-High-School-Curiosity-Starter-FINAL-FREE.pdf"],
  
    "/api/admin/books-toolkits/internship-book": ["./protected-resources/books-toolkits/BUILD6-Internship-Playbook-REVIEW.pdf"],
    "/api/admin/pilot-case-study/file/*": ["./protected-resources/pilot-case-study/Tyler-Williams-Facility-Tour-Thank-You.txt"],
  },
  /* config options here */
};

export default nextConfig;
