module.exports = {
  presets: [
    ["next/babel"],
    ["@babel/preset-typescript"],
    ["@babel/preset-react"],
  ],
  env: {
    test: {
      presets: [["@babel/preset-env"]],
    },
  },
};
