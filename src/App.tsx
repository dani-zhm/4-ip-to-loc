import mapboxgl from "mapbox-gl";
import Mapbox from "./components/Map";
import config from "./config";
import { center, points, bbox, polygon } from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button, Pane, Text } from "evergreen-ui";
import randomInt from "./utils/randomInt";
import { features } from "./assets/lac.json";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { mapAtom, mapLoadedAtom } from "./atoms";
import axios from "axios";

// plugin to fix how rtl languages are display
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  // error handler
  () => {
    return;
  },
  true // Lazy load the plugin
);

mapboxgl.accessToken = config.MAPBOX_KEY;

// get random province id from provinces geojson file
const randomID = () => features[randomInt(0, features.length)].properties.id;

const findFeatureFromId = (id: string) => {
  return features.find((f) => f.properties.id === id);
};

const getUserLocationGeojson = async () => {
  const res = await axios.get("http://uloc.ir");
  const id = res.data.location;

  // const id = randomID();
  const feature = findFeatureFromId(id);
  return feature;
};

function App() {
  // const [id, setid] = useState("");
  const map = useAtomValue(mapAtom);
  const mapLoaded = useAtomValue(mapLoadedAtom);

  const displayLocation = async () => {
    const feature = await getUserLocationGeojson();
    if (!feature) return console.log(`no feature w id = ${id}`);

    const provinceSource = map?.getSource("province") as any;
    provinceSource?.setData(feature);

    const poly = polygon(feature.geometry.coordinates);
    const [minX, minY, maxX, maxY] = bbox(poly);

    map?.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      { padding: 54 }
    );
  };

  useEffect(() => {
    displayLocation();
  }, [mapLoaded]);

  return (
    <div>
      <Mapbox>
        <div className="absolute bottom-0 left-1/2 p-12 -translate-x-1/2">
          <div className="flex justify-center items-center">
            <Button onClick={displayLocation} size="large" className="pointer-events-auto">
              IP to Loc
            </Button>
          </div>
        </div>
      </Mapbox>
    </div>
  );
}

export default App;
