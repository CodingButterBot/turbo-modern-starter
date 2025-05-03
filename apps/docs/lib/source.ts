import { createMDXSource } from "fumadocs-mdx";
import { loadPages } from "fumadocs-core/source";
import { docs } from "../source.config";

export const { source } = createMDXSource(
  loadPages(docs)
);