import { createConfig } from "@fmss/commitlint-plugin";

export default createConfig({
  additionalScopes: ["commitlint-plugin"],
  ignores: [(commit) => commit.includes("Version Packages")],
});
