/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */

import { normalizeHttpOrigin } from './normalizeHttpOrigin';

/** Where `/api/*` is forwarded in local dev (Nest default). Override with API_PROXY_TARGET in `.env`. */
const API_DEV_PROXY_TARGET =
  normalizeHttpOrigin(process.env.API_PROXY_TARGET) ||
  'http://localhost:3000';

export default {
  /** Local NestJS API (see apps/api) */
  dev: {
    '/api/': {
      target: API_DEV_PROXY_TARGET,
      changeOrigin: true,
    },
  },
  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://pro-api.ant-design-demo.workers.dev/api/**
    '/api/': {
      target: 'https://pro-api.ant-design-demo.workers.dev',
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
    },
  },
};
