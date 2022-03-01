/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
        // If you use `MDXProvider`, uncomment the following line.
        // providerImportSource: "@mdx-js/react",
    },
});

const nextConfig = {
    reactStrictMode: true,
    webpack: (config, options) => {
        // Important: return the modified config
        config.module.rules.push({
            test: /\.(vert|frag|glsl)$/,
            use: 'raw-loader',
        });
        return config;
    },
};

module.exports = withMDX({
    ...nextConfig,
    pageExtensions: ['md', 'mdx', 'tsx', 'jsx'],
});
