import { CUSTOM_LAYOUT_ID, getLayoutOption, layoutGroups } from "../lib/layouts";
import { clamp } from "./number";

const availableLayoutOptions = layoutGroups.flatMap((group) => group.options);

function matchesLayoutSize(layoutOption, widthCm, heightCm, toleranceCm) {
  if (!layoutOption) {
    return false;
  }

  return (
    Math.abs(layoutOption.widthCm - widthCm) <= toleranceCm &&
    Math.abs(layoutOption.heightCm - heightCm) <= toleranceCm
  );
}

export function resolveLayoutIdForSize(widthCm, heightCm, currentLayoutId, toleranceCm) {
  const currentLayout = getLayoutOption(currentLayoutId);
  if (matchesLayoutSize(currentLayout, widthCm, heightCm, toleranceCm)) {
    return currentLayout.id;
  }

  const matchingLayout = availableLayoutOptions.find((layoutOption) =>
    matchesLayoutSize(layoutOption, widthCm, heightCm, toleranceCm),
  );

  return matchingLayout?.id ?? CUSTOM_LAYOUT_ID;
}

export function normalizePosterSizeValue(value, fallbackValue, minCm, maxCm) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return clamp(fallbackValue, minCm, maxCm);
  }
  return clamp(parsed, minCm, maxCm);
}
