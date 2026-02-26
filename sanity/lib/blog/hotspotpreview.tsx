import { Box } from "@sanity/ui";
import { HotspotTooltipProps } from "sanity-plugin-hotspot-array";
import { RenderPreviewCallback, useSchema } from "sanity";

export function HotspotPreview({
  value,
  schemaType,
  renderPreview,
}: HotspotTooltipProps) {
  return (
    <Box padding={2} style={{ minWidth: 200 }}>
      {renderPreview({
        value,
        schemaType,
        layout: "default",
      })}
    </Box>
  );
}

export function ProductPreview({
  value,
  renderPreview,
}: {
  value: any;
  renderPreview: any;
}) {
  const productSchemaType = useSchema().get("product");
  return (
    <Box padding={2} style={{ minWidth: 200 }}>
      {value?.product?._ref
        ? renderPreview({
            value,
            schemaType: productSchemaType,
            layout: "default",
          })
        : `No reference selected`}
    </Box>
  );
}
