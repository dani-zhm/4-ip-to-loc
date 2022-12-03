import mapboxgl from "mapbox-gl";
import Mapbox from "./components/Map";
import config from "./config";
import "mapbox-gl/dist/mapbox-gl.css";


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

function App() {
  return <Mapbox></Mapbox>;
}

export default App;
