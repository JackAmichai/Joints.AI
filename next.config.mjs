/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
  // typedRoutes deliberately off: StepNav accepts hrefs as plain strings.
  // Re-enable once we migrate to Route-typed href props.
};

export default nextConfig;
