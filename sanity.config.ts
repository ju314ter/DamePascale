"use client";

import { imageHotspotArrayPlugin } from "sanity-plugin-hotspot-array";
import { singletonTools } from "sanity-plugin-singleton-tools";
import { StructureResolver, structureTool } from "sanity/structure";
import {
  singletonDocumentListItem,
  singletonDocumentListItems,
  filteredDocumentListItems,
} from "sanity-plugin-singleton-tools";
import { PlugIcon } from "@sanity/icons";
/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import schema from "./sanity/schemas/schema";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      // Create a list item for each singleton document in your schema that links directly to a document view
      ...singletonDocumentListItems({ S, context }),
      // Create a list item for a specific singleton
      singletonDocumentListItem({
        S,
        context,
        // Schema type
        type: "configBoutiqueSchema",
        // Required for showing multiple singletons of the same schema type
        title: "Configuration boutique",
        // Required for showing multiple singletons of the same schema type
        id: "uniqueConfigBoutique",
        // Specify a custom icon
        icon: PlugIcon,
      }),
      S.divider(),
      // Filter singleton documents out of the default S.documentTypeListItems() to prevent them from being rendered as lists or as duplicates
      ...filteredDocumentListItems({ S, context }),
    ]);

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    structureTool({}),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    singletonTools(),
    imageHotspotArrayPlugin(),
  ],
});
