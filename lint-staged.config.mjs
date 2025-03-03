export default {
  "**/*.ts": [
    "yarn prettify",
    "yarn lint",
    () => "yarn typecheck"
  ]
}