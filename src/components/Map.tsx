import mapboxgl from "mapbox-gl";
import { FC, PropsWithChildren } from "react";
import useMap from "../hooks/useMap";

const Mapbox: FC<PropsWithChildren> = ({ children }) => {
  const handleMapClick = (ev: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    // handle click e.g. :
    // const newLngLat: LngLat = [ev.lngLat.lng, ev.lngLat.lat];
  };

  const handleMapLoad = (
    ev: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData
  ) => {
    // what to do on load
    // like adding sources etc
  };

  const { mapContainerRef } = useMap({
    onMapClick: handleMapClick,
    onMapLoad: handleMapLoad,
  });

  return (
    <div className="relative h-[400px]" ref={mapContainerRef}>
      <div className="absolute z-10 h-full w-full font-sans text-base pointer-events-none">
        <div className="h-full w-full relative pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Mapbox;
