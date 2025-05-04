declare module 'fumadocs-core/dist/config' {
  export function defineConfig(config: any): any;
}

declare module 'fumadocs-core/dist/source' {
  export function loadPages(options: any): {
    getPage: (slug: string[]) => any;
    getPages: () => any[];
    pageTree: any;
  };
}

declare module 'fumadocs-core/types' {
  export type PageTree = any;
}

declare module 'fumadocs-mdx/dist' {
  export function createMDXSource(config: any): any;
}

declare module 'fumadocs-mdx/dist/mdx-content' {
  export const MDXContent: React.FC<any>;
}

declare module 'fumadocs-mdx/dist/components' {
  export const MDXComponents: Record<string, any>;
}

declare module 'fumadocs-ui/dist/layout' {
  export function createConfig(options: any): any;
  export function getPageNav(options: any): any;
  export const Layout: React.FC<any>;
}

declare module '@mdx-js/react' {
  export type MDXComponents = Record<string, any>;
}