import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        // Todas as requisições que começarem com /api/ serão reescritas
        // para o seu backend na Railway.
        source: "/api/:path*",
        destination: "https://orquestradorbmad.up.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
