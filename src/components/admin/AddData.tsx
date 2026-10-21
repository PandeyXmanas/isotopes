import React, { useState } from "react";
import { Upload, PlusCircle, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export interface MandiPriceInput {
  commodity: string;
  state: string;
  district: string;
  market: string;
  arrivalDate: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  unit: "INR/quintal";
  source: string;
}

export interface AddDataProps {
  onAddRecord?: (record: MandiPriceInput) => void;
  onImportCsv?: (records: MandiPriceInput[]) => void;
}

export const AddData: React.FC<AddDataProps> = ({ onAddRecord, onImportCsv }) => {
  const [activeTab, setActiveTab] = useState<"csv" | "manual">("csv");
  const [csvStatus, setCsvStatus] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  // Manual form state
  const [form, setForm] = useState<MandiPriceInput>({
    commodity: "",
    state: "",
    district: "",
    market: "",
    arrivalDate: new Date().toISOString().split("T")[0],
    minPrice: null,
    maxPrice: null,
    modalPrice: null,
    unit: "INR/quintal",
    source: "Agmarknet / e-NAM",
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.commodity || !form.state || !form.district || !form.market) {
      alert("Please fill in Commodity, State, District, and Market name.");
      return;
    }
    onAddRecord?.(form);
    alert("Record added successfully!");
    // reset form
    setForm({
      commodity: "",
      state: "",
      district: "",
      market: "",
      arrivalDate: new Date().toISOString().split("T")[0],
      minPrice: null,
      maxPrice: null,
      modalPrice: null,
      unit: "INR/quintal",
      source: "Agmarknet / e-NAM",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvError(null);
    setCsvStatus("Reading CSV file...");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");

        if (lines.length <= 1) {
          throw new Error("CSV file has no data rows.");
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const records: MandiPriceInput[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim());
          if (cols.length < headers.length) continue;

          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = cols[idx];
          });

          records.push({
            commodity: row["commodity"] || row["crop"] || "Unknown",
            state: row["state"] || "",
            district: row["district"] || "",
            market: row["market"] || row["mandi"] || "",
            arrivalDate: row["arrivaldate"] || row["date"] || new Date().toISOString().split("T")[0],
            minPrice: row["minprice"] ? parseFloat(row["minprice"]) : null,
            maxPrice: row["maxprice"] ? parseFloat(row["maxprice"]) : null,
            modalPrice: row["modalprice"] ? parseFloat(row["modalprice"]) : null,
            unit: "INR/quintal",
            source: row["source"] || "Imported CSV",
          });
        }

        setCsvStatus(`Successfully loaded ${records.length} records from ${file.name}`);
        onImportCsv?.(records);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to parse CSV file.";
        setCsvError(message);
        setCsvStatus(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Add Mandi Price Data</h2>
          <p className="text-xs text-stone-500">Upload bulk CSV or enter a single mandi rate manually</p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-stone-100 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("csv")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "csv"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "manual"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      {activeTab === "csv" ? (
        <div className="space-y-4">
          <label className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-stone-50/50 hover:bg-emerald-50/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <span className="font-semibold text-stone-800 text-sm mb-1">
              Select or Drop Mandi Price CSV
            </span>
            <span className="text-xs text-stone-500 text-center max-w-xs mb-3">
              CSV columns: Commodity, State, District, Market, ArrivalDate, MinPrice, MaxPrice, ModalPrice
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="px-3.5 py-1.5 bg-[#1b4332] text-white rounded-lg text-xs font-semibold shadow-xs">
              Browse CSV File
            </span>
          </label>

          {csvStatus && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{csvStatus}</span>
            </div>
          )}

          {csvError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{csvError}</span>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Commodity / Crop</label>
              <input
                type="text"
                required
                placeholder="e.g. Wheat"
                value={form.commodity}
                onChange={(e) => setForm({ ...form, commodity: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Market / Mandi Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sehore Mandi"
                value={form.market}
                onChange={(e) => setForm({ ...form, market: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
              <input
                type="text"
                required
                placeholder="e.g. Madhya Pradesh"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
              <input
                type="text"
                required
                placeholder="e.g. Sehore"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Arrival Date</label>
              <input
                type="date"
                required
                value={form.arrivalDate}
                onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Modal Price (₹/quintal)</label>
              <input
                type="number"
                placeholder="e.g. 2475"
                value={form.modalPrice ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    modalPrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Min Price (₹/quintal)</label>
              <input
                type="number"
                placeholder="e.g. 2350"
                value={form.minPrice ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minPrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Max Price (₹/quintal)</label>
              <input
                type="number"
                placeholder="e.g. 2580"
                value={form.maxPrice ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxPrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold rounded-xl text-sm transition-all shadow-xs"
          >
            Save Mandi Price Record
          </button>
        </form>
      )}
    </div>
  );
};

export default AddData;
