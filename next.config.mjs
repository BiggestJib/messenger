/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]], // Corrected the typo and structure
  },
  images: {
    domains: [
      "res.cloudinary.com", // Correct for Cloudinary
      "lh3.googleusercontent.com", // Correct for Google
      "avatars.githubusercontent.com", // Correct for GitHub
    ],
  },
};

export default nextConfig;
