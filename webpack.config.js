import path from "path";

const public_path = `./public/scripts/`;
const __dirname = path.dirname(public_path);

const client = {
  target: "web",
  entry: "./public/scripts/main.js",
  output: {
    filename: "main.min.js",
    path: path.resolve(__dirname, "out"),
  },
  experiments: {
    topLevelAwait: true,
  },
};

const server = {
  target: "node",
  entry: "./index.js",
  output: {
    filename: "index.min.cjs",
    path: path.resolve("./"),
  },
  experiments: {
    topLevelAwait: true,
  },
};

export default [client, server];
