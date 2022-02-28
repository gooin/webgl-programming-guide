/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    // Important: return the modified config
    config.module.rules.push({
      test:  /\.(vert|frag|glsl)$/,
      use: 'raw-loader',
    })
    return config
  }
}

module.exports = nextConfig
