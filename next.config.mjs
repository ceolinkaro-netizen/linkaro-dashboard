/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  experimental: {
    middlewareClientMaxBodySize: "50mb", // or false to disable the cap entirely
  },
};

export default nextConfig;
