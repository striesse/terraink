import layoutsManifest from "../layouts/layouts.json";

export const CUSTOM_LAYOUT_ID = "custom";

const fallbackSymbol =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 40'><rect x='2' y='2' width='60' height='36' rx='5' fill='none' stroke='#9CC3DA' stroke-width='2'/><rect x='14' y='8' width='36' height='24' rx='3' fill='#4B91B7'/></svg>";

const fallbackLayout = {
  id: "print_poster_20x30",
  name: "Poster 20 x 30 cm",
  description: "Classic portrait poster size (2:3 ratio).",
  width: 20,
  height: 30,
  unit: "cm",
  widthCm: 20,
  heightCm: 30,
  symbol: fallbackSymbol,
  categoryId: "print",
  categoryName: "Print",
};

function toPositiveNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function normalizeUnit(value) {
  const unit = String(value ?? "").trim().toLowerCase();
  return unit === "px" ? "px" : "cm";
}

function formatDecimal(value) {
  const rounded = Math.round(Number(value) * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function createSymbolFromRatio(width, height) {
  const ratio = Math.max(0.15, Math.min(6, width / height));
  const maxInnerWidth = 50;
  const maxInnerHeight = 30;

  let innerWidth = maxInnerWidth;
  let innerHeight = innerWidth / ratio;

  if (innerHeight > maxInnerHeight) {
    innerHeight = maxInnerHeight;
    innerWidth = innerHeight * ratio;
  }

  const x = (64 - innerWidth) / 2;
  const y = (40 - innerHeight) / 2;
  const roundedX = Number(x.toFixed(2));
  const roundedY = Number(y.toFixed(2));
  const roundedWidth = Number(innerWidth.toFixed(2));
  const roundedHeight = Number(innerHeight.toFixed(2));

  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 40'><rect x='2' y='2' width='60' height='36' rx='5' fill='none' stroke='#9CC3DA' stroke-width='2'/><rect x='${roundedX}' y='${roundedY}' width='${roundedWidth}' height='${roundedHeight}' rx='3' fill='#4B91B7'/></svg>`;
}

function normalizeLayout(category, layout, fallbackIdSuffix) {
  const width = toPositiveNumber(layout?.width, fallbackLayout.width);
  const height = toPositiveNumber(layout?.height, fallbackLayout.height);
  const unit = normalizeUnit(layout?.unit);

  const widthCm = toPositiveNumber(
    layout?.posterWidthCm,
    unit === "cm" ? width : fallbackLayout.widthCm,
  );
  const heightCm = toPositiveNumber(
    layout?.posterHeightCm,
    unit === "cm" ? height : fallbackLayout.heightCm,
  );

  const rawSymbol = String(layout?.symbol ?? "").trim();

  return {
    id: String(layout?.id ?? `${category.id}_${fallbackIdSuffix}`),
    name: String(layout?.name ?? "Unnamed Layout"),
    description: String(layout?.description ?? "").trim(),
    width,
    height,
    unit,
    widthCm,
    heightCm,
    symbol: rawSymbol || createSymbolFromRatio(width, height),
    categoryId: category.id,
    categoryName: category.name,
  };
}

const rawCategories = Array.isArray(layoutsManifest?.categories)
  ? layoutsManifest.categories
  : [];

export const layoutGroups = rawCategories
  .map((category, categoryIndex) => {
    const categoryId = String(category?.id ?? `category_${categoryIndex}`);
    const categoryName = String(category?.name ?? categoryId);
    const rawLayouts = Array.isArray(category?.layouts) ? category.layouts : [];
    const options = rawLayouts.map((layout, layoutIndex) =>
      normalizeLayout({ id: categoryId, name: categoryName }, layout, layoutIndex),
    );

    return {
      id: categoryId,
      name: categoryName,
      options,
    };
  })
  .filter((group) => group.options.length > 0);

export const layoutOptions = layoutGroups.flatMap((group) => group.options);

const layoutOptionsById = layoutOptions.reduce((acc, option) => {
  if (!acc[option.id]) {
    acc[option.id] = option;
  }
  return acc;
}, {});

const manifestDefaultId = String(layoutsManifest?.defaultLayoutId ?? "").trim();

export const defaultLayoutId = layoutOptionsById[manifestDefaultId]
  ? manifestDefaultId
  : (layoutOptions[0]?.id ?? fallbackLayout.id);

export function formatLayoutDimensions(layoutOption) {
  if (!layoutOption) {
    return "";
  }

  return `${formatDecimal(layoutOption.width)} x ${formatDecimal(layoutOption.height)} ${layoutOption.unit}`;
}

export function formatLayoutCm(value) {
  return formatDecimal(value);
}

export function getLayoutOption(layoutId) {
  const normalizedId = String(layoutId ?? "").trim();
  if (normalizedId === CUSTOM_LAYOUT_ID) {
    return null;
  }

  if (layoutOptionsById[normalizedId]) {
    return layoutOptionsById[normalizedId];
  }

  if (layoutOptionsById[defaultLayoutId]) {
    return layoutOptionsById[defaultLayoutId];
  }

  return fallbackLayout;
}

export function createCustomLayoutOption(widthCm, heightCm) {
  const normalizedWidthCm = toPositiveNumber(widthCm, fallbackLayout.widthCm);
  const normalizedHeightCm = toPositiveNumber(heightCm, fallbackLayout.heightCm);
  const symbol = createSymbolFromRatio(normalizedWidthCm, normalizedHeightCm);

  return {
    id: CUSTOM_LAYOUT_ID,
    name: "Custom Layout",
    description: "Manual width and height values.",
    width: normalizedWidthCm,
    height: normalizedHeightCm,
    unit: "cm",
    widthCm: normalizedWidthCm,
    heightCm: normalizedHeightCm,
    symbol,
    categoryId: CUSTOM_LAYOUT_ID,
    categoryName: "Custom",
  };
}
