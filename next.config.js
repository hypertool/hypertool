/** @type {import('next').NextConfig} */
module.exports = {
  basePath: "/hypertool.github.io",
  assetPrefix: "/hypertool.github.io/",
  reactStrictMode: true,
  exportPathMap: async () => ({
    "/": { page: "/" },
  }),
};
