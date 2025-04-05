const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
  // 在Vercel上部署时，不需要这些路径前缀
  // assetPrefix: isProd ? "/aptos-wallet-adapter/nextjs-cross-chain-example" : "",
  // basePath: isProd ? "/aptos-wallet-adapter/nextjs-cross-chain-example" : "",
  webpack: (config) => {
    config.resolve.fallback = { "@solana/web3.js": false };
    return config;
  },
};

export default nextConfig;
