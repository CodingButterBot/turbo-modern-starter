// Simplified version without fumadocs for compatibility
import fs from 'fs';
import path from 'path';

// Mock document data
export const allDocs = [
  {
    title: "Introduction",
    description: "Getting started with Turbo Modern Starter",
    slug: "index",
    data: {}
  },
  {
    title: "Installation",
    description: "How to install and set up Turbo Modern Starter",
    slug: "getting-started/installation",
    data: {}
  }
];

export function getPage(slug: string[]) {
  return allDocs.find(
    (page) => page.slug === (slug?.join('/') || 'index')
  );
}

export const searchAPI = {
  search: (query: string) => []
};