export const TOOLKIT = {
 id: "teamwork-communication-v1", title: "BUILD6™ Teamwork & Communication Facilitator Session Kit",
 priceCents: 9900, version: "2026.10-v1", termsVersion: "2026.10-v1",
 freeUrl: "https://build6-free-bingo.jaime791312.chatgpt.site",
 paymentUrl: "https://connect.intuit.com/pay/LinkLakeNorman/scs-v1-35a29876cf4646eca810805965138aa28240569a88de4d5d9afbf741de1b7d086d59d6cb46ae4c7eb0f597c0ce873edf-1?locale=EN_US&cta=paylinkbuybutton",
} as const;
export const READY = process.env.BUILD6_TOOLKIT_SALES_ENABLED === "true" && Boolean(process.env.BUILD6_TOOLKIT_SUPPORT_EMAIL) && Boolean(process.env.BUILD6_TOOLKIT_ORIGIN) && (process.env.BUILD6_TOOLKIT_SESSION_SECRET?.length ?? 0) >= 32 && process.env.BUILD6_TOOLKIT_POLICIES_APPROVED === "true" && process.env.BUILD6_TOOLKIT_PAYMENT_CHECKED === "true";
