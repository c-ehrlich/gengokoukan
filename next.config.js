/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */

import iwebpack from "webpack";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    instrumentationHook: true,
  },
  // TODO: is this still needed?
  webpack: (config, _options) => {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        new iwebpack.NormalModuleReplacementPlugin(
          /@opentelemetry\/exporter-jaeger/,
          path.resolve(path.join(__dirname, "./polyfills.js")),
        ),
      ],
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          stream: false,
          zlib: false,
          http: false,
          tls: false,
          net: false,
          http2: false,
          dns: false,
          os: false,
          fs: false,
          path: false,
          https: false,
        },
      },
    };
  },
};

export default config;
