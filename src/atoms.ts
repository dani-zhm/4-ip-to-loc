import { atom } from "jotai";
import { Map } from "mapbox-gl";

export const mapAtom = atom<Map | null>(null);

export const mapLoadedAtom = atom(false);

const format = new Intl.DateTimeFormat("en-US", {
  minute: "2-digit",
  hour: "2-digit",
}).format;

export type Log = { time: string; message: string };

const _logsAtom = atom<Log[]>([]);

export const logsAtom = atom((get) => get(_logsAtom)); // read only

export const addLogMsgAtom = atom(null, (_get, set, message: string) => {
  const timestamp = new Date();
  const newLog = { time: format(timestamp), message };

  set(_logsAtom, (prev) => [...prev, newLog]);
});
