//this is so JEST can workd
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
  "plugins": [
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
    ["@babel/plugin-proposal-private-methods", { "loose": true }]
  ]
};