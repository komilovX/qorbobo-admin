module.exports = {
  ssr: false,
  server: {
    port: 3000
    // host: "127.0.0.1"
  },
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    script: [
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.3/xlsx.full.min.js"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  loading: { color: "#409EFF" },

  css: [
    "element-ui/lib/theme-chalk/index.css",
    "element-ui/lib/theme-chalk/display.css",
    "@/styles/index.scss"
  ],

  plugins: [
    "@/plugins/element-ui",
    "@/plugins/imgDirective",
    "@/plugins/nuxt-client-init.js",
    "@/plugins/socket.js",
    "@/plugins/axios"
  ],

  buildModules: [],

  modules: ["@nuxtjs/axios", "@nuxtjs/pwa", "@nuxtjs/svg", "@nuxtjs/dotenv"],
  env: {
    limit: 30,
    baseUrl: "http://localhost:3000",
    secondUrl: "http://207.154.223.158:8000"
  },

  axios: {},

  build: {
    transpile: [/^element-ui/],

    extend(config, ctx) {}
  }
};
