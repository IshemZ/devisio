module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://solkant.com",
  generateRobotsTxt: true,
  exclude: ["/dashboard/*", "/sentry-example-page", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
