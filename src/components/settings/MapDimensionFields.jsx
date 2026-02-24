import { MAX_DISTANCE_METERS, MIN_DISTANCE_METERS } from "../../constants/appConfig";

export default function MapDimensionFields({
  form,
  minPosterCm,
  maxPosterCm,
  onChange,
  onNumericFieldBlur,
}) {
  return (
    <div className="map-dimension-fields">
      <div className="map-size-fields-row">
        <label>
          Width (cm)
          <input
            className="map-dimension-input"
            name="width"
            type="number"
            min={minPosterCm}
            max={maxPosterCm}
            step="any"
            value={form.width}
            onChange={onChange}
            onBlur={onNumericFieldBlur}
          />
        </label>
        <label>
          Height (cm)
          <input
            className="map-dimension-input"
            name="height"
            type="number"
            min={minPosterCm}
            max={maxPosterCm}
            step="any"
            value={form.height}
            onChange={onChange}
            onBlur={onNumericFieldBlur}
          />
        </label>
      </div>
      <label>
        Distance (m)
        <input
          className="map-dimension-input"
          name="distance"
          type="number"
          min={MIN_DISTANCE_METERS}
          max={MAX_DISTANCE_METERS}
          value={form.distance}
          onChange={onChange}
          onBlur={onNumericFieldBlur}
        />
      </label>
    </div>
  );
}
