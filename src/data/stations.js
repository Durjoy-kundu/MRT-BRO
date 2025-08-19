// Ordered line for simple "stop distance" fare calc
export const STATIONS = [
  "Airport",
  "Uttara North",
  "Uttara Center",
  "Uttara South",
  "Pallabi",
  "Mirpur 11",
  "Mirpur 10",
  "Kazipara",
  "Shewrapara",
  "Agargaon",
  "Bijoy Sarani",
  "Farmgate",
  "Karwan Bazar",
  "Shahbag",
  "Dhaka University",
  "Bangladesh Secretariat",
  "Motijheel"
];

// Fare parameters (tweak easily)
export const BASE_FARE = 10;      // base currency units
export const PER_STOP = 5;        // per-station step fare

export function computeFare(from, to) {
  if (!from || !to || from === to) return 0;
  const i = STATIONS.indexOf(from);
  const j = STATIONS.indexOf(to);
  if (i === -1 || j === -1) return 0;
  const stops = Math.abs(i - j);
  return BASE_FARE + Math.max(0, stops) * PER_STOP;
}
