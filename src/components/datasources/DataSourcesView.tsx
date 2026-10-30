import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  Search,
  Download,
  Trash2,
  RefreshCw,
  Table as TableIcon,
  Layers,
} from 'lucide-react';
import { useBI } from '../../context/BIContext';
import { parseCSVData } from '../../utils/csvParser';
import { Dataset } from '../../types/bi';

export const DataSourcesView: React.FC = () => {
  const {
    allDatasets,
    activeDataset,
    setActiveDataset,
    addCustomDataset,
    deleteDataset,
    formatCurrency,
  } = useBI();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const text = await file.text();
      const result = await parseCSVData(text, file.name);

      if (result.error || !result.dataset) {
        setErrorMessage(result.error || 'Failed to parse file format.');
      } else {
        addCustomDataset(result.dataset);
        setSuccessMessage(
          `Successfully ingested "${file.name}" with ${result.dataset.rowCount.toLocaleString()} records!`
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Filter records
  const records = activeDataset.records || [];
  const filteredRecords = records.filter((r) =>
    Object.values(r).some((val) =>
      String(val).toLowerCase().includes(searchFilter.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Upload Banner / Drag-and-drop */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`p-8 rounded-xl border-2 border-dashed transition-all text-center relative ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/20'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.tsv"
          onChange={onFileInputChange}
          className="hidden"
          id="dataset-upload-input"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Drop CSV or spreadsheet here to ingest
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports CSV, TSV with automatic schema detection for revenue, costs, orders, and regions.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing Dataset...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Select CSV File</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-lg flex items-center justify-center gap-2 max-w-lg mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg flex items-center justify-center gap-2 max-w-lg mx-auto">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Available Datasets Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Ingested Business Datasets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any benchmark or uploaded dataset to power all analytics and AI models
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allDatasets.map((ds) => {
            const isCurrent = ds.id === activeDataset.id;
            return (
              <div
                key={ds.id}
                onClick={() => setActiveDataset(ds)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className={`w-4 h-4 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                      {ds.name}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {ds.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="font-mono">{ds.rowCount.toLocaleString()} rows</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {formatCurrency(ds.summary.totalRevenue)}
                  </span>
                  {ds.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDataset(ds.id);
                      }}
                      className="p-1 hover:text-rose-500 transition-colors"
                      title="Delete custom dataset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Schema Inspector & Live Table Preview */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-indigo-500" />
              Raw Records & Schema Inspection: {activeDataset.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredRecords.length.toLocaleString()} matching records across {activeDataset.columns.length} columns
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rows..."
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
              />
            </div>
          </div>
        </div>

        {/* Schema Columns Badges */}
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-100 dark:border-slate-850 text-xs">
          <span className="text-[11px] font-medium text-slate-400 mr-1 self-center">
            Detected Fields:
          </span>
          {activeDataset.columns.map((col) => (
            <span
              key={col}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
              <tr>
                {activeDataset.columns.map((col) => (
                  <th key={col} className="px-4 py-2.5 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentRecords.length > 0 ? (
                currentRecords.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    {activeDataset.columns.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-2.5 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300"
                      >
                        {typeof row[col] === 'number'
                          ? row[col].toLocaleString()
                          : String(row[col] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={activeDataset.columns.length}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
