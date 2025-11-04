/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "idsfkvwjaiwadpitgjnu.supabase.co", // <= change to your project id host
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
