module.exports = {
  pwa: {
    name: "Nearby",
    themeColor: "#546E7A",
    msTileColor: "#26A69A",
    manifestOptions: {
      background_color: "#819CA9",
      icons: [{
          src: "/img/logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/img/logo.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
  transpileDependencies: ["vuetify"],
};