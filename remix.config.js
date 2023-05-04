
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "vercel",
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  //serverBuildPath: "api/index.js",
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    /^remark.*/, /^rehype.*$/, /^hast.*$/, /^mdx.*$/, /^micromark.*$/, /^unist.*$/, /^vfile.*$/, /^unist-util.*$/, /^mdast.*$/, "decode-named-character-reference", /^estree.*$/, "is-plain-obj", "github-slugger", "ccount", "fault", "markdown-table", "character-entities"
],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
  future: {
		v2_meta: false,
    unstable_tailwind: true,
	},
};