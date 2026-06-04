import { useState } from "react";
import { useMapEvents, GeoJSON, Popup } from "react-leaflet";
import * as turf from "@turf/turf";
import { TextField } from "@mui/material";

const BufferTool = () => {
  const [distance, setDistance] = useState<number>(500); // default 500m
  const [buffer, setBuffer] = useState<any | null>(null);

  useMapEvents({
    click(e) {
      if (!distance || distance <= 0) return;

      const point = turf.point([e.latlng.lng, e.latlng.lat]);
      const buffered = turf.buffer(point, distance, { units: "meters" });
      setBuffer(buffered);
    },
  });

  return (
    <>
      {/* Distance Input (MUI) */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          background: "white",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <TextField
          label="Buffer distance (m)"
          type="number"
          size="small"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
        />
      </div>

      {/* Buffer Layer */}
      {buffer && (
        <GeoJSON
          data={buffer as any}
          style={{
            color: "rgba(0, 123, 255, 1)",
            weight: 2,
            fillColor: "rgba(0, 123, 255, 0.3)",
          }}
        >
          <Popup>
            <strong>Buffer</strong> <br />
            Distance: {distance} m
          </Popup>
        </GeoJSON>
      )}
    </>
  );
};

export default BufferTool;
