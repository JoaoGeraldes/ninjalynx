/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // when true, will render the app twice (while on development)
  output: 'standalone', // Added this line to support Docker - This will build the project as a standalone app inside the Docker image.
  compiler: {
    styledComponents: true, // Support for styled-components to prevent weird side-effects (such as missing styles)
  },
};

module.exports = nextConfig;
