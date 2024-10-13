// module.exports = {
//   presets: [
//     "@babel/preset-env",
//     "@babel/preset-react",
//     "@babel/preset-typescript",
//   ],
// };

// module.exports = {
//   presets: ["next/babel"],
// };

// module.exports = (api) => {
//   api.cache(true);

//   const isTest = process.env.NODE_ENV === "test";

//   const presets = isTest
//     ? ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
//     : ["next/babel"]; // Use next/babel preset for production

//   return { presets };
// };

const path = require("path");

module.exports = (api) => {
  api.cache(true);

  const isTest = process.env.NODE_ENV === "test";

  // Use different configurations based on the environment
  return isTest
    ? require(path.resolve(__dirname, "babel.test.config.js"))
    : {
        presets: ["next/babel"],
      };
};
