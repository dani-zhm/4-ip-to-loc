import mapboxgl from "mapbox-gl";
import Mapbox from "./components/Map";
import config from "./config";
import { center, points, bbox, polygon } from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button, Pane, Text } from "evergreen-ui";
import randomInt from "./utils/randomInt";
import { features } from "./assets/lac.json";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { addLogMsgAtom, mapAtom, mapLoadedAtom } from "./atoms";
import axios, { AxiosError } from "axios";
import Logger from "./utils/Logger";

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

const apiUrl = "http://uloc.ir/api";

function App() {
  // const [id, setid] = useState("");
  const map = useAtomValue(mapAtom);
  const mapLoaded = useAtomValue(mapLoadedAtom);
  const addLogMsg = useSetAtom(addLogMsgAtom);

  const displayLocation = async () => {
    const feature = await getUserLocationGeojson();
    if (!feature) return console.log(`problem connecting to api`);

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

  const getUserLocationGeojson = async () => {
    addLogMsg(`GET: ${apiUrl}`);
    try {
      const res = await axios.get(apiUrl);
      addLogMsg(`success -> res.data -> ${JSON.stringify(res.data)}`);
      // const id = randomID();
      const id = res.data.location;
      addLogMsg(`location id: ${id}`);
      const feature = findFeatureFromId(id);
      if (!feature) {
        addLogMsg(`couldn't find polygon`);
      } else {
        addLogMsg(`found polygon with id: ${feature.properties.id}`);
      }
      return feature;
    } catch (error) {
      let err = error as AxiosError;
      addLogMsg(`fail -> res.data -> ${JSON.stringify(err.response?.data)}`);
    }
  };

  useEffect(() => {
    displayLocation();
  }, [mapLoaded]);

  return (
    <div>
      <Mapbox>
        <Logger />
      </Mapbox>
    </div>
  );
}

export default App;
