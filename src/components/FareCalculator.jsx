import React, { useMemo, useState } from "react";
import { STATIONS, computeFare } from "../data/stations";

export default function FareCalculator({ balance }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const fare = useMemo(() => computeFare(from, to), [from, to]);
  const canTravel = balance != null ? balance >= fare : null;
  const remaining = balance != null ? balance - fare : null;

  return (
    <div className="p-4 rounded-xl bg-white shadow border border-slate-200">
      <h2 className="text-lg font-semibold mb-4">Fare Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-600 mb-1">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border rounded-md px-3 py-2 bg-white"
          >
            <option value="">Select station</option>
            {STATIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border rounded-md px-3 py-2 bg-white"
          >
            <option value="">Select station</option>
            {STATIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="text-sm text-slate-600">Calculated Fare</div>
        <div className="text-2xl font-bold">৳ {fare.toFixed(2)}</div>
      </div>

      {balance != null && (
        <div className="mt-3">
          {canTravel ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-sm text-slate-600">You can travel.</div>
              <div className="text-sm">Remaining after fare: <b>৳ {remaining.toFixed(2)}</b></div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-sm text-amber-800">
                {fare === 0
                  ? "Select different stations to compute fare."
                  : "Insufficient balance. Please recharge."}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
