import type { BaseLayoutProps } from "fumadocs-ui/layout";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: "Turbo Modern Starter Docs",
    links: [
      {
        text: "GitHub",
        href: "https://github.com/CodingButterBot/turbo-modern-starter"
      }
    ]
  },
  footer: {
    text: `© ${new Date().getFullYear()} Turbo Modern Starter. All rights reserved.`
  }
};