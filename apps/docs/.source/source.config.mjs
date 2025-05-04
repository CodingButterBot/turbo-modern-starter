// source.config.ts
import { defineConfig } from "fumadocs-core/config";
var source_config_default = defineConfig({
  rootDir: "content",
  baseUrl: "/docs",
  name: "Turbo Modern Starter",
  description: "Documentation for the Turbo Modern Starter monorepo"
});
export {
  source_config_default as default
};
