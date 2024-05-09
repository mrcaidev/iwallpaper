/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/settings",
      destination: "/settings/profile",
      permanent: true,
    },
  ],
  experimental: {
    typedRoutes: true,
  },
};

export default config;
