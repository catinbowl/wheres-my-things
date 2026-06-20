const upstreamTransformer = require("@expo/metro-config/babel-transformer");

module.exports.transform = function (props) {
  const { filename, src } = props;
  if (filename.endsWith(".sql")) {
    // For .sql files, transform them into a JS module that exports the file content as a string.
    // We use the upstream transformer on a virtual JS file to get the correct AST that Metro expects.
    return upstreamTransformer.transform({
      ...props,
      src: `module.exports = ${JSON.stringify(src)};`,
      filename: filename + ".js",
    });
  }
  // For all other files, delegate to the default @expo/metro-config/babel-transformer.
  return upstreamTransformer.transform(props);
};
