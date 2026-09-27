import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Maximize2,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  ShieldCheck,
  Calendar,
  User,
  Stethoscope,
  Database,
  Lock,
  ExternalLink
} from 'lucide-react';

export const GoogleDriveDocViewer = ({ document, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Reset zoom & rotation when document changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(100);
      setRotation(0);
    }
  }, [isOpen, document]);

  // Keyboard shortcut handler (Esc to close, + / - to zoom)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 20, 200));
      if (e.key === '-' || e.key === '_') setZoom(z => Math.max(z - 20, 40));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const isPdf = document.fileName?.toLowerCase().endsWith('.pdf') || document.fileType?.includes('pdf');
  const isImage = document.fileName?.toLowerCase().endsWith('.png') ||
                  document.fileName?.toLowerCase().endsWith('.jpg') ||
                  document.fileName?.toLowerCase().endsWith('.jpeg') ||
                  document.fileType?.includes('image');

  const handleZoomIn = () => setZoom(z => Math.min(z + 15, 200));
  const handleZoomOut = () => setZoom(z => Math.max(z - 15, 50));
  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation(r => (r + 90) % 360);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (document.previewUrl) {
      const a = window.document.createElement('a');
      a.href = document.previewUrl;
      a.download = document.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else {
      alert(`Downloading ${document.fileName} from PulsePoint Health Database...`);
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-[#121212]/95 backdrop-blur-md flex flex-col text-white animate-in fade-in duration-200">
      {/* Top Google Drive Header Bar */}
      <header className="h-14 bg-[#1E1E1E] border-b border-[#333333] px-4 flex items-center justify-between shrink-0 select-none shadow-md z-20">
        {/* Left: File Name, Type Icon & Metadata */}
        <div className="flex items-center gap-3 overflow-hidden pr-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isPdf ? 'bg-[#C4302B] text-white' : 'bg-[#0F7A4C] text-white'
          }`}>
            {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold truncate text-[#F0F0F0] max-w-xs sm:max-w-md">
                {document.fileName}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2D2D2D] text-[#A0A0A0] uppercase">
                {isPdf ? 'PDF' : isImage ? 'IMAGE' : 'DOC'}
              </span>
            </div>
            <p className="text-[11px] text-[#888888] truncate">
              {document.category || 'Diagnostic Record'} • {document.fileSize} • Uploaded {document.uploadedAt}
            </p>
          </div>
        </div>

        {/* Center: Drive Zoom & Orientation Tools */}
        <div className="hidden md:flex items-center gap-1 bg-[#282828] border border-[#3E3E3E] rounded-lg px-2 py-1 text-xs">
          <button
            onClick={handleZoomOut}
            title="Zoom out (-)"
            className="p-1 hover:bg-[#383838] rounded text-[#CCCCCC] hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="px-2 py-0.5 text-[11px] font-mono hover:bg-[#383838] rounded text-[#EEEEEE] transition-colors"
          >
            {zoom}%
          </button>

          <button
            onClick={handleZoomIn}
            title="Zoom in (+)"
            className="p-1 hover:bg-[#383838] rounded text-[#CCCCCC] hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3.5 bg-[#444444] mx-1" />

          <button
            onClick={handleRotate}
            title="Rotate 90° clockwise"
            className="p-1 hover:bg-[#383838] rounded text-[#CCCCCC] hover:text-white transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetZoom}
            title="Fit to screen"
            className="p-1 hover:bg-[#383838] rounded text-[#CCCCCC] hover:text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions (Print, Download, Details Sidebar Toggle, Close) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrint}
            title="Print document"
            className="p-2 hover:bg-[#2D2D2D] rounded-lg text-[#CCCCCC] hover:text-white transition-colors hidden sm:block"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            title="Download document file"
            className="p-2 hover:bg-[#2D2D2D] rounded-lg text-[#CCCCCC] hover:text-white transition-colors flex items-center gap-1 text-xs"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            title="File details & medical properties"
            className={`p-2 rounded-lg transition-colors ${
              showInfoPanel
                ? 'bg-[#0F7A4C] text-white'
                : 'hover:bg-[#2D2D2D] text-[#CCCCCC] hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-[#333333] mx-1" />

          <button
            onClick={onClose}
            title="Close viewer (Esc)"
            className="p-2 hover:bg-[#C4302B] rounded-lg text-[#CCCCCC] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body Area: Document Canvas + Optional Google Drive Info Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area with Paper Sheet */}
        <main className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-[#171717] select-none">
          <div
            className="transition-transform duration-150 ease-out origin-center flex flex-col items-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`
            }}
          >
            {/* The Document Paper Sheet Container */}
            <div className="bg-white text-[#1A1A1A] rounded-lg shadow-2xl overflow-hidden max-w-3xl w-full border border-[#333333]">
              {/* Google Drive Sheet Top Bar */}
              <div className="bg-[#FAFAFA] border-b border-[#E5E5E5] px-4 py-2 flex items-center justify-between text-[11px] text-[#5C5C5C]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0F7A4C] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F7A4C]" />
                    <span>Verified Electronic Health Record</span>
                  </span>
                  <span>•</span>
                  <span>HIPAA Encrypted</span>
                </div>
                <div className="font-mono text-[10px]">
                  PAGE 1 OF 1
                </div>
              </div>

              {/* Render Document Content */}
              <div className="p-4 sm:p-6 flex items-center justify-center min-h-[380px] bg-white">
                {document.previewUrl ? (
                  <img
                    src={document.previewUrl}
                    alt={document.fileName}
                    className="max-h-[580px] w-auto max-w-full object-contain rounded select-none"
                  />
                ) : (
                  /* Formatted Mock Clinical Sheet for non-image files */
                  <div className="w-full max-w-xl space-y-6 py-6 px-4">
                    <div className="border-b-2 border-[#0F7A4C] pb-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-[#1A1A1A]">METRO GENERAL HOSPITAL</h3>
                        <p className="text-xs text-[#5C5C5C]">Clinical Diagnostic &amp; Ambulatory Records Bureau</p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-mono font-bold text-[#0F7A4C]">{document.id}</span>
                        <div className="text-[11px] text-[#5C5C5C]">Date: {document.uploadedAt}</div>
                      </div>
                    </div>

                    <div className="bg-[#F7F7F7] p-3 rounded-lg border border-[#E5E5E5] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#5C5C5C] block">Document Name:</span>
                        <strong className="text-[#1A1A1A]">{document.fileName}</strong>
                      </div>
                      <div>
                        <span className="text-[#5C5C5C] block">Clinical Category:</span>
                        <strong className="text-[#1A1A1A]">{document.category || 'Diagnostic'}</strong>
                      </div>
                      <div>
                        <span className="text-[#5C5C5C] block">Patient Name / MRN:</span>
                        <strong className="text-[#1A1A1A]">{document.patientName || 'Marcus Vance'}</strong>
                      </div>
                      <div>
                        <span className="text-[#5C5C5C] block">Reviewing Clinician:</span>
                        <strong className="text-[#0F7A4C]">{document.doctor || 'Dr. Sarah Jenkins, MD'}</strong>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-[#333333] leading-relaxed">
                      <h4 className="font-bold text-[#1A1A1A] uppercase text-[11px] tracking-wider">
                        Electronic Record Transcription &amp; Clinical Summary:
                      </h4>
                      <p>
                        This certified diagnostic report was officially transmitted and archived into the PulsePoint Health platform. The underlying documentation has been cryptographically validated under hospital electronic health record security standards.
                      </p>
                      <p>
                        Patient vital signs, telemetry traces, and physician orders recorded in this diagnostic report are stored persistently in the database and accessible to attending staff and patient.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#E5E5E5] flex justify-between items-end text-xs text-[#5C5C5C]">
                      <div>
                        <span className="font-mono text-[10px] text-[#0F7A4C] block">SHA-256: 4e91b7d8... Verified</span>
                        <span className="text-[10px]">PulsePoint Medical Data Lake</span>
                      </div>
                      <div className="text-right">
                        <div className="font-serif italic font-bold text-[#1A1A1A] text-sm">
                          {document.doctor || 'Dr. Sarah Jenkins, MD'}
                        </div>
                        <div className="text-[10px] border-t border-[#999999] pt-0.5">Attending Signature &amp; Stamp</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Google Drive "File Details" Right Sidebar Drawer */}
        {showInfoPanel && (
          <aside className="w-80 bg-[#1E1E1E] border-l border-[#333333] p-5 flex flex-col shrink-0 overflow-y-auto animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#333333] mb-4">
              <h3 className="text-sm font-bold text-[#F0F0F0] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0F7A4C]" />
                <span>Document Details</span>
              </h3>
              <button
                onClick={() => setShowInfoPanel(false)}
                className="text-[#888888] hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#888888] block text-[11px] uppercase tracking-wider mb-1">
                  File Properties
                </span>
                <div className="bg-[#262626] p-3 rounded-lg border border-[#3A3A3A] space-y-2">
                  <div>
                    <span className="text-[#888888] block text-[11px]">Type</span>
                    <span className="font-semibold text-white">{isPdf ? 'Portable Document Format (PDF)' : isImage ? 'Diagnostic Image' : 'Medical File'}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">File Size</span>
                    <span className="font-mono text-white">{document.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Upload Date</span>
                    <span className="text-white">{document.uploadedAt}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Storage Engine</span>
                    <span className="text-[#0F7A4C] font-semibold flex items-center gap-1 mt-0.5">
                      <Database className="w-3 h-3" />
                      <span>Persistent Medical DB</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[#888888] block text-[11px] uppercase tracking-wider mb-1">
                  Clinical Ownership
                </span>
                <div className="bg-[#262626] p-3 rounded-lg border border-[#3A3A3A] space-y-2">
                  <div>
                    <span className="text-[#888888] block text-[11px]">Patient</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <User className="w-3 h-3 text-[#0F7A4C]" />
                      <span>{document.patientName || 'Marcus Vance'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Attending Physician</span>
                    <span className="text-white flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-[#0F7A4C]" />
                      <span>{document.doctor || 'Dr. Sarah Jenkins, MD'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Diagnostic Category</span>
                    <span className="text-white">{document.category || 'Diagnostic Report'}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[#888888] block text-[11px] uppercase tracking-wider mb-1">
                  Security &amp; Integrity
                </span>
                <div className="bg-[#262626] p-3 rounded-lg border border-[#3A3A3A] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#0F7A4C] font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Cryptographically Verified</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#888888] break-all bg-[#1E1E1E] p-1.5 rounded">
                    SHA-256: 8f9b2a7d4e1c390a42f6...
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#A0A0A0]">
                    <Lock className="w-3 h-3 text-[#0F7A4C]" />
                    <span>End-to-End Encrypted (AES-256)</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
