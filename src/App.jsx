import React, { useState } from "react";
import NFCReader from "./components/NFCReader";
import FareCalculator from "./components/FareCalculator";

export default function App() {
  const [balance, setBalance] = useState(null);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-600">MRT BRO</h1>
          <div className="text-sm text-slate-600">
            {balance != null ? (
              <>Balance: <span className="font-semibold ">৳ {balance.toFixed(2)}</span></>
            ) : "Scan a card to see balance"}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NFCReader onBalance={setBalance} />
          <FareCalculator balance={balance} />
        </div>

        {/* <section className="mt-8 p-4 rounded-xl bg-white shadow border border-slate-200">
          <h3 className="text-base font-semibold mb-2">How it works</h3>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li><b>Scan:</b> Tap “Start Scan” and hold your metro card near the phone’s NFC area.</li>
            <li><b>Balance:</b> The app parses a text NDEF record like <code>BAL:250.50</code>. You can change this logic.</li>
            <li><b>Fare:</b> Pick From/To stations and we compute fare by stops (editable in code).</li>
            <li><b>Mock Mode:</b> For desktop/dev testing without NFC hardware.</li>
          </ul>
        
        </section> */}
      </main>

      <footer className="py-5 text-center text-xs text-slate-500">
        Developed by <a href="https://durjoy-kundu.github.io/Portfolio/" className="font-semibold hover:text-green-600" target="_blank" rel="noopener noreferrer">Durjoy</a>
      </footer>
    </div>
  );
}
