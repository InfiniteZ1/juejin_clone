/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,//关闭严格模式
  //路径重写
  async rewrites() {
    return [
      {
        source: '/:tab',
        destination: '/'
      },
      {
        source: '/:tab/:tag',
        destination: '/'
      }
    ]
  }
}

module.exports = nextConfig
