/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["cdn.discordapp.com"] },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/home",
  //       permanent: false,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
