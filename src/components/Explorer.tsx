import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Legend from "./Legend";

// react-leaflet imports
import {
  MapContainer,
  TileLayer,
  LayersControl,
  GeoJSON,
  Marker,
  FeatureGroup,
  Popup,
  useMap,
} from "react-leaflet";
import L, { Map } from "leaflet";

// MUI imports
import {
  AppBar,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

// icons-png
import customerPng from "../assets/map-icons/bighouse.png";
import HTPolesPng from "../assets/map-icons/electric_pole_red.png";
import LVPolesPng from "../assets/map-icons/electric_pole_black.png";

// types
import type { BaseMaps } from "../types";
interface Customers {
  fid: number;
  geom: {
    type: "MultiPoint";
    coordinates: [number, number][];
  };
  no: number;
  eastings: number;
  northings: number;
  latitude: number;
  longitude: number;
  customer_s_name: string;
  id: number;
  phone_number: number;
  parcel_number: number;
  power_rate_supply: string;
}
interface HTPoles {
  fid: number;
  geom: {
    type: "MultiPoint";
    coordinates: [number, number][];
  };
  no: number;
  latitude: number;
  latitude_1: number;
  eastings: number;
  northings: number;
  name: string;
  type: string;
  height: number;
  fitting: string;
}
interface LVPoles {
  fid: number;
  geom: {
    type: "MultiPoint";
    coordinates: [number, number][];
  };
  no: number;
  latitudes: number;
  longitudes: number;
  eastings: number;
  northings: number;
  name_string_field: string;
  type_string_field: string;
  height_m_field: number;
}

// URL for API endpoints
const API_URL = import.meta.env.API_URL
// Fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Explorer = () => {
  const [mapInstance, setMapInstance] = useState<Map | null>(null);

  // fetching data
  const {
    data: customers,
    error: customersError,
    isLoading: customersLoading,
  } = useSWR<Customers[]>(`${API_URL}/api/v1/customers/`, fetcher);

  const {
    data: HTPoles,
    error: HTPolesError,
    isLoading: HTPolesLoading,
  } = useSWR<HTPoles[]>(`${API_URL}/api/v1/ht_poles/`, fetcher);
  const {
    data: LVPoles,
    error: LVPolesError,
    isLoading: LVPolesLoading,
  } = useSWR<LVPoles[]>(`${API_URL}/api/v1/lv_poles/`, fetcher);
  
  const {
    data: existingHTLine,
    error: existingHTLineError,
    isLoading: existingHTLineLoading,
  } = useSWR<any>(`${API_URL}/api/v1/existing_ht_line/`, fetcher);
  const {
    data: HTLineConstructed,
    error: HTLineConstructedError,
    isLoading: HTLineConstructedLoading,
  } = useSWR<any>(`${API_URL}/api/v1/ht_line_constructed/`, fetcher);
  const { data: parcels, error: parcelsError } = useSWR<any>(
    `${API_URL}/api/v1/parcels/`,
    fetcher
  );
  const {
    data: singlePhaseLines,
    error: singlePhaseLinesError,
    isLoading: singlePhaseLinesLoading,
  } = useSWR<any>(`${API_URL}/api/v1/single_phase/`, fetcher);

  // loading state
  if (
    customersLoading ||
    existingHTLineLoading ||
    HTLineConstructedLoading ||
    HTPolesLoading ||
    LVPolesLoading ||
    singlePhaseLinesLoading
  ) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  // check if there any errors when fetching
  if (
    customersError ||
    existingHTLineError ||
    HTLineConstructedError ||
    HTPolesError ||
    LVPolesError ||
    parcelsError ||
    singlePhaseLinesError
  ) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography variant="h6" color="error">
          Error loading data
        </Typography>
      </Grid>
    );
  }

  //Convert parcels array → FeatureCollection
  const parcelFeatureCollection: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: parcels.map((parcel: any) => ({
      type: "Feature",
      geometry: parcel.geom,
      properties: {
        fid: parcel.fid,
        id: parcel.id,
      },
    })),
  };

  // basemaps
  const baseMaps: BaseMaps[] = [
    {
      name: "OSM",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      checked: false,
    },
    {
      name: "ESRI World Imagery",
      url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      checked: true,
    },
  ];

  // fit initial map load to the subcounty
  const FitBoundsToGeoJSON = ({
    data,
  }: {
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  }) => {
    const map = useMap();

    useEffect(() => {
      if (data) {
        const geoJsonLayer = new L.GeoJSON(data);
        const bounds = geoJsonLayer.getBounds();
        map.fitBounds(bounds);
      }
    }, [data, map]);

    return null;
  };

  // a map component for user interaction with the map
  const MapComponent = () => {
    const map = useMap();
    useEffect(() => {
      setMapInstance(map);
    }, [map]);
    return null;
  };

  // Custom icons
  const customerIcon = new L.Icon({
    iconUrl: customerPng,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  const lvPoleIcon = new L.Icon({
    iconUrl: LVPolesPng,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });
  const htPoleIcon = new L.Icon({
    iconUrl: HTPolesPng,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });

  return (
    <AppBar position="sticky">
      <div style={{ height: "100vh" }}>
        <MapContainer center={[-0.718, 37.149]} zoom={6}>
          <LayersControl position="topright">
            {baseMaps.map((baseMap) => (
              <LayersControl.BaseLayer
                key={baseMap.name}
                name={baseMap.name}
                checked={baseMap.checked}
              >
                <TileLayer
                  url={baseMap.url}
                  attribution={baseMap.attribution}
                />
              </LayersControl.BaseLayer>
            ))}
            <LayersControl.Overlay checked name="Parcels">
              <FeatureGroup>
                {parcels.map((parcel:any) => (
                  <GeoJSON
                    key={parcel.fid}
                    data={parcel.geom}
                    style={() => ({
                      color: "rgba(206, 107, 206, 1)",
                      weight: 2,
                      fillColor: "#5c5757ff",
                      fillOpacity: 0.4,
                    })}
                    onEachFeature={(feature, layer) => {
                      layer.bindPopup(`<b>Parcel No:</b> ${parcel.id}`);
                    }}
                  />
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Single Phase">
              <FeatureGroup>
                {singlePhaseLines.map((singlePhaseLine:any) => (
                  <GeoJSON
                    key={singlePhaseLine.fid}
                    data={singlePhaseLine.geom}
                    style={() => ({
                      color: "rgba(8, 8, 8, 1)",
                      weight: 2.5,
                    })}
                  />
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Existing HT Line">
              <GeoJSON data={existingHTLine[0].geom} />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="HT Line Constructed">
              <GeoJSON
                data={HTLineConstructed[0].geom}
                style={() => ({
                  color: "rgba(235, 11, 11, 1)",
                  weight: 2.5,
                })}
              />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Customers">
              <FeatureGroup>
                {customers.map((customer) => {
                  return (
                    <Marker
                      key={customer.fid}
                      position={[customer.latitude, customer.longitude]}
                      icon={customerIcon}
                    >
                      <Popup>
                        <Typography variant="caption">
                          Name: {customer.customer_s_name}
                          <br />
                          Phone No: {`0${customer.phone_number}`}
                        </Typography>
                      </Popup>
                    </Marker>
                  );
                })}
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="HT Poles">
              <FeatureGroup>
                {HTPoles.map((HTPole) => {
                  return (
                    <Marker
                      key={HTPole.fid}
                      position={[HTPole.latitude, HTPole.latitude_1]}
                      icon={htPoleIcon}
                    >
                      <Popup>
                        <Typography variant="caption">
                          Fitting: {HTPole.fitting}
                        </Typography>
                      </Popup>
                    </Marker>
                  );
                })}
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="LV Poles">
              <FeatureGroup>
                {LVPoles.map((LVPole) => {
                  return (
                    <Marker
                      key={LVPole.fid}
                      position={[LVPole.latitudes, LVPole.longitudes]}
                      icon={lvPoleIcon}
                    />
                  );
                })}
              </FeatureGroup>
            </LayersControl.Overlay>
          </LayersControl>
          <MapComponent />
          {/* <BufferTool /> */}
          <FitBoundsToGeoJSON data={parcelFeatureCollection} />
          <Legend map={mapInstance} />
        </MapContainer>
      </div>
    </AppBar>
  );
};

export default Explorer;
