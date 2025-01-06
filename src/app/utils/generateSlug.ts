import slugify from "slugify";

export const generateSlug = (input: string): string => {
  const baseSlug = slugify(input, {
    lower: true,
    strict: true,
    replacement: "-",
  });

  const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  return `${baseSlug}-${dateSuffix}`;
};

export const productSlug = (name: string, sku: string) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${slug}-${sku}`;
};
