import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

/** Builder d'image (sans jeton, utilisable côté navigateur). */
export const urlFor = (source: any) =>
  imageBuilder.image(source).auto("format").fit("max");

export const urlForImage = (source: any, width?: number) => {
  const builder = urlFor(source);
  return (width ? builder.width(width) : builder).url();
};
