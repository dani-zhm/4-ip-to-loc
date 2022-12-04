import { useAtomValue } from "jotai";
import { logsAtom } from "../atoms";
import type { Log as ILog } from "../atoms";
import { useState } from "react";

const Log = ({ log }: { log: ILog }) => {
  return (
    <div className="p-2">
      <p key={log.message}>
        <span className="font-bold">{log.time}:</span> {log.message}
      </p>
    </div>
  );
};

const Logger = () => {
  const logs = useAtomValue(logsAtom);
  const [show, setshow] = useState(true);
  return (
    <div className=" w-9/12 max-w-lg p-6 mx-auto pointer-events-auto">
      <button
        className="block mx-auto bg-slate-900 text-white p-2 rounded-lg"
        onClick={() => setshow((s) => !s)}
      >
        {show ? "Hide logs" : "View logs"}
      </button>
      {show && (
        <div className="bg-slate-300 border border-gray-900/40 p-6 rounded-lg">
          {logs.map((l) => (
            <Log log={l} />
          ))}
        </div>
      )}
    </div>
  );
};
export default Logger;
