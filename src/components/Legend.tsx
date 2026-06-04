import { useEffect } from "react";
import L, { Map, Control } from "leaflet";

// icons-png
import customerPng from "../assets/map-icons/bighouse.png";
import HTPolesPng from "../assets/map-icons/electric_pole_red.png";
import LVPolesPng from "../assets/map-icons/electric_pole_black.png";

interface LegendProps {
  map: Map | null;
}

const Legend = ({ map }: LegendProps) => {
  useEffect(() => {
    if (map) {
      const legend = new Control({ position: "topleft" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = `
          <h4>Legend</h4>

          <!-- Customers -->
          <div class="legend-item">
            <img src="${customerPng}" alt="Customer" />
            <span>Customers</span>
          </div>

          <!-- LV Poles -->
          <div class="legend-item">
            <img src="${LVPolesPng}" alt="LV Pole" />
            <span>LV Poles</span>
          </div>

          <!-- HT Poles -->
          <div class="legend-item">
            <img src="${HTPolesPng}" alt="HT Pole" />
            <span>HT Poles</span>
          </div>

          <!-- Parcels -->
          <div class="legend-item">
            <i style="background: #5c5757ff; border: 2px solid rgba(206, 107, 206, 1);"></i>
            <span>Parcels</span>
          </div>

          <!-- Single Phase Line -->
          <div class="legend-item">
           <i class="line" style="border-top: 3px solid #080808;"></i>
           <span>Single Phase Line</span>
          </div>


          <!-- HT Line Constructed -->
          <div class="legend-item">
           <i class="line" style="border-top: 3px solid rgba(235, 11, 11, 1);"></i>
           <span>HT Line Constructed</span>
          </div>

          <!-- Existing HT Line -->
          <div class="legend-item">
            <i class="line" style="border-top: 3px solid #3388ff;"></i>
            <span>Existing HT Line</span>
          </div>
        `;
        return div;
      };
      legend.addTo(map);
    }
  }, [map]);

  return null;
};

export default Legend;
