/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        unoptimized: true
    },
    webpack: (config, { isServer }) => {
        // Add rule for .proto files
        config.module.rules.push({
            test: /\.proto$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/proto/[hash][ext]'
            }
        });

        // Ensure .proto files are copied to the output directory
        if (isServer) {
            config.resolve.alias = {
                ...config.resolve.alias,
            };
        }

        return config;
    }
};

export default nextConfig;