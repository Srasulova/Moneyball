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

const path = require("path");

module.exports = (api) => {
  api.cache(true);

  const isTest = process.env.NODE_ENV === "test";

  return isTest
    ? {
        presets: [
          "@babel/preset-env",
          ["@babel/preset-react", { runtime: "automatic" }], // Support for JSX/React during tests
          "@babel/preset-typescript", // TypeScript support
        ],
      }
    : {
        presets: ["next/babel"], // For regular build, using Next.js's Babel configuration
      };
};
