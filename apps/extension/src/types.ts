// Type definitions for extension
export type ExtensionConfig = {
  version: string;
  name: string;
  description: string;
};

export const defaultConfig: ExtensionConfig = {
  version: "0.0.1",
  name: "Turbo Modern Starter Extension",
  description: "A browser extension built with Turbo Modern Starter"
};