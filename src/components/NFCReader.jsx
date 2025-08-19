import React, { useEffect, useMemo, useState } from "react";
import { parseBalanceFromNDEFMessage } from "../utils/ndef";

/**
 * NFC Reader with:
 * - Feature detection for Web NFC (NDEFReader)
 * - Start/Stop scanning
 * - On read: extract balance and show UI
 * - Mock mode toggle for desktop testing
 */
export default function NFCReader({ onBalance }) {
  const [supported, setSupported] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [mockMode, setMockMode] = useState(false);
  const [lastBalance, setLastBalance] = useState(null);
  const [cardId, setCardId] = useState(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "NDEFReader" in window);
  }, []);

  const status = useMemo(() => {
    if (mockMode) return "Mock Mode";
    if (!supported) return "Web NFC not supported";
    return scanning ? "Scanning..." : "Idle";
  }, [supported, scanning, mockMode]);

  async function startScan() {
    setError("");
    if (mockMode) {
      // Simulate a card scan
      const fake = Math.round((Math.random() * 400 + 50) * 100) / 100;
      setTimeout(() => {
        setLastBalance(fake);
        setCardId(`MOCK-${Math.random().toString(36).slice(2, 8)}`);
        onBalance?.(fake);
      }, 600);
      return;
    }

    if (!supported) {
      setError("This device/browser doesn't support Web NFC (try Android Chrome over HTTPS).");
      return;
    }

    try {
      const reader = new NDEFReader();
      await reader.scan();
      setScanning(true);

      reader.onreadingerror = () => setError("NFC reading error. Try again or reposition the card.");
      reader.onreading = (event) => {
        try {
          const { message, serialNumber } = event;
          const bal = parseBalanceFromNDEFMessage(message);
          setCardId(serialNumber || "(unknown)");
          setLastBalance(bal);
          onBalance?.(bal);
        } catch (e) {
          console.error(e);
          setError("Failed to parse NFC data.");
        }
      };
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to start NFC scan.");
      setScanning(false);
    }
  }

  function stopScan() {
    // Web NFC doesn't expose an explicit stop() yet; scanning stops when page leaves focus.
    // We just reflect UI state.
    setScanning(false);
  }

  return (
    <div className="p-4 rounded-xl bg-white shadow border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Metro Card – NFC Scanner</h2>
        <span className="text-xs px-2 py-1 rounded bg-slate-100">{status}</span>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={mockMode}
            onChange={(e) => setMockMode(e.target.checked)}
          />
          Enable Mock Mode (desktop testing)
        </label>

        <div className="flex gap-2">
          <button
            onClick={startScan}
            className="px-4 py-2 rounded-md border bg-emerald-600 text-white hover:bg-emerald-700 transition"
            disabled={scanning}
          >
            {mockMode ? "Simulate Scan" : "Start Scan"}
          </button>
          <button
            onClick={stopScan}
            className="px-4 py-2 rounded-md border bg-slate-100 hover:bg-slate-200 transition"
          >
            Stop
          </button>
        </div>

        {lastBalance != null && (
          <div className="mt-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-sm text-slate-600">Card ID</div>
            <div className="font-mono text-slate-800">{cardId || "N/A"}</div>
            <div className="mt-2 text-sm text-slate-600">Current Balance</div>
            <div className="text-2xl font-bold">৳ {lastBalance.toFixed(2)}</div>
          </div>
        )}

        {error && (
          <div className="mt-2 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!supported && !mockMode && (
          <div className="text-xs text-slate-500">
            Tip: Web NFC currently works on **Android Chrome** over **HTTPS**. If you’re testing on desktop,
            toggle <b>Mock Mode</b>.
          </div>
        )}
      </div>
    </div>
  );
}
