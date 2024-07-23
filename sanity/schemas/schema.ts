import { type SchemaTypeDefinition } from "sanity";
import {
  amigurumiCategorySchema,
  amigurumiMenuSchema,
  amigurumiProductSchema,
  amigurumiUniversSchema,
  heroBannerAmigurumiSchema,
} from "./amigurumis/schema";
import {
  bijouCategorySchema,
  bijouFleurSchema,
  bijouMatiereSchema,
  bijouMenuSchema,
  bijouProductSchema,
  heroBannerBijouSchema,
} from "./bijoux/schema";
import { blogCategorySchema, blogPostSchema } from "./blog/schema";

const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
};

schema.types.push(amigurumiMenuSchema);
schema.types.push(amigurumiCategorySchema);
schema.types.push(amigurumiUniversSchema);
schema.types.push(amigurumiProductSchema);
schema.types.push(heroBannerAmigurumiSchema);

schema.types.push(bijouMenuSchema);
schema.types.push(bijouCategorySchema);
schema.types.push(bijouMatiereSchema);
schema.types.push(bijouFleurSchema);
schema.types.push(bijouProductSchema);
schema.types.push(heroBannerBijouSchema);

schema.types.push(blogCategorySchema);
schema.types.push(blogPostSchema);

export default schema;
