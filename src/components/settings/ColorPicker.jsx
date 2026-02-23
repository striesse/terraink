import { useEffect, useRef, useState } from "react";

const PRESET_COLORS = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", 
  "#ffff00", "#00ffff", "#ff00ff", "#ff8000", "#8000ff",
  "#808080", "#c0c0c0", "#404040", "#800000", "#008000",
  "#000080", "#808000", "#008080", "#800080", "#ff6666",
  "#66ff66", "#6666ff", "#ffcc00", "#00ccff",
];

function hexToRgb(hex) {
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(Number(v) || 0)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

export default function ColorPicker({ currentColor, onChange, onClose }) {
  const [hexInput, setHexInput] = useState(currentColor);
  const [rgb, setRgb] = useState(() => hexToRgb(currentColor));
  const nativePickerRef = useRef(null);

  useEffect(() => {
    setHexInput(currentColor);
    setRgb(hexToRgb(currentColor));
  }, [currentColor]);

  function handlePresetClick(color) {
    onChange(color);
    onClose?.();
  }

  function handleHexInput(e) {
    const val = e.target.value;
    setHexInput(val);
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
      const normalized = clean.toLowerCase();
      onChange(normalized);
      setRgb(hexToRgb(normalized));
    }
  }

  function handleHexBlur() {
    setHexInput(currentColor);
  }

  function handleRgbChange(channel, rawVal) {
    const next = { ...rgb, [channel]: rawVal };
    setRgb(next);
    const nums = [Number(next.r), Number(next.g), Number(next.b)];
    if (nums.every((v) => Number.isFinite(v) && v >= 0 && v <= 255)) {
      const hex = rgbToHex(...nums);
      onChange(hex);
      setHexInput(hex);
    }
  }

  return (
    <div className="color-picker-popup">
      <div className="color-preset-grid">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-preset-cell${currentColor.toLowerCase() === color ? " is-active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handlePresetClick(color)}
            aria-label={color}
            title={color}
          />
        ))}
        <button
          type="button"
          className="color-preset-cell color-preset-custom"
          title="Custom color"
          aria-label="Open custom color picker"
          onClick={() => nativePickerRef.current?.click()}
        >
          ⊕
        </button>
      </div>
      <input
        ref={nativePickerRef}
        type="color"
        value={currentColor}
        onChange={(e) => onChange(e.target.value)}
        className="color-native-input"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="color-manual-row">
        <label className="color-field-label">
          Hex
          <input
            type="text"
            className="color-hex-input"
            value={hexInput}
            onChange={handleHexInput}
            onBlur={handleHexBlur}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
          />
        </label>
        <label className="color-field-label">
          R
          <input
            type="number"
            className="color-rgb-input"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => handleRgbChange("r", e.target.value)}
          />
        </label>
        <label className="color-field-label">
          G
          <input
            type="number"
            className="color-rgb-input"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => handleRgbChange("g", e.target.value)}
          />
        </label>
        <label className="color-field-label">
          B
          <input
            type="number"
            className="color-rgb-input"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => handleRgbChange("b", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
