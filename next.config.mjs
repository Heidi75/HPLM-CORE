/** @type {import('next').NextConfig} */
const nextConfig = {
  // This prevents the server from "Guessing" the route
  // and forces it to accept the POST request from your phone.
  trailingSlash: false,
};

export default nextConfig;
