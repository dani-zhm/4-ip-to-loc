import { useAtom } from "jotai";
import mapboxgl, { Map } from "mapbox-gl";
import { useRef, useEffect } from "react";
import { mapAtom, mapLoadedAtom } from "../atoms";
import config from "../config";

type MapClickEvent = mapboxgl.MapMouseEvent & mapboxgl.EventData;
type MapLoadEvent = mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData;

interface UseMap {
  onMapClick?: (ev: MapClickEvent) => void;
  onMapLoad?: (ev: MapLoadEvent) => void;
}

const useMap = ({ onMapClick, onMapLoad }: UseMap) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useAtom(mapLoadedAtom);
  const [, setMap] = useAtom(mapAtom);

  const onLoad = (ev: MapLoadEvent) => {
    onMapLoad?.(ev);
    setMap(ev.target);
    setMapLoaded(true);
  };

  const onClick = (ev: MapClickEvent) => {
    onMapClick?.(ev);
  };

  useEffect(() => {
    // set up event hanlder for ...
    mapRef.current?.on("click", onClick);
    // cleanup
    return () => {
      // remove old callback since it could have stale state in its definition
      mapRef.current?.off("click", onClick);
    };
  }, [mapLoaded]);

  useEffect(() => {
    // if no map and container ref not null then instantiate map
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        // style: "mapbox://styles/mapbox/streets-v12",
        style: `https://map.ir/vector/styles/main/mapir-xyz-style.json?x-api-key=${config.MAPIR_KEY}`,
        transformRequest: (url, resourceType) => {
          return {
            url: url,
            headers: { 'x-api-key': config.MAPIR_KEY }
            // credentials: "include" // Include cookies for cross-origin requests
          };
        },
        // caution: it's [Longitude, Latitude] here!
        // *google maps does [Latitude, Longitude] ?!
        center: [51.366624055720855, 35.7004387316396],
        zoom: 9,
        customAttribution: '©Map ©Openstreetmap'
      });
      // on load event
      mapRef.current.on("load", onLoad);
    }
  });

  return {
    mapContainerRef: mapContainerRef,
  };
};

export default useMap;
