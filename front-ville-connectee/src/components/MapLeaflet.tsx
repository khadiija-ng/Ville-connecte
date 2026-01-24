import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// Fix default marker icons in Vite
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export function MapLeaflet({
  center,
  marker,
  onPick,
  height = 260,
  hint = "Cliquez sur la carte pour choisir la position",
}: {
  center: [number, number];
  marker?: [number, number] | null;
  onPick?: (lat: number, lng: number) => void;
  height?: number;
  hint?: string;
}) {
  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
        <MapContainer center={center} zoom={13} style={{ height }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {onPick && <ClickHandler onPick={onPick} />}
          {marker && <Marker position={marker} />}
        </MapContainer>
      </div>
      {hint && <div className="mt-2 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
