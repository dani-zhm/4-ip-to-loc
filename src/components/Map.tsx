import mapboxgl from "mapbox-gl";
import { FC, PropsWithChildren } from "react";
import useMap from "../hooks/useMap";
import lac from "../assets/lac.json";

// province
// ev.target.addSource("province", {
//   type: "geojson",
//   data: {
//     type: "Feature",
//     properties: {},
//     geometry: {
//       type: "Polygon",
//       coordinates: [],
//     },
//   },
// });

const Mapbox: FC<PropsWithChildren> = ({ children }) => {
  const handleMapLoad = (
    ev: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData
  ) => {
    ev.target.addSource("province", {
      type: "geojson",
      data: lac,
    });

    ev.target.addLayer({
      id: "province-layer",
      source: "province",
      type: "line",
      paint: { "line-width": 3, "line-color": "black" },
    });
  };

  const { mapContainerRef } = useMap({
    onMapLoad: handleMapLoad,
  });

  return (
    <div className="relative h-screen w-screen shrink-0" ref={mapContainerRef}>
      <div className="absolute z-10 h-full w-full font-sans text-base pointer-events-none">
        <div className="h-full w-full relative">{children}</div>
      </div>
    </div>
  );
};

export default Mapbox;
