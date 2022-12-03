import { atom } from "jotai";
import { Map } from "mapbox-gl";

export const mapAtom = atom<Map | null>(null);

export const mapLoadedAtom = atom(false);

