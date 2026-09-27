import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Calendar, Check, Eye, X, HardDrive } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoogleDriveDocViewer } from '../../components/GoogleDriveDocViewer';

export const PatientDocuments = () => {
  const { currentUser, currentPatient, documents, uploadDocument } = useApp();
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);

  const activePatientId = currentUser?.patientId || currentPatient.id;

  // Filter documents for active patient (or default documents)
  const patientDocs = documents.filter(doc => {
    if (!doc.patientId) return true; // Initial seed records
    return doc.patientId === activePatientId || doc.patientName === currentUser?.name;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target.result;
      uploadDocument({
        name: file.name,
        size: file.size,
        type: file.type || 'Clinical Document',
        previewUrl,
        patientId: activePatientId,
        patientName: currentUser?.name || currentPatient.name
      });
      setUploadSuccessMsg(`Document "${file.name}" uploaded and encrypted in medical database.`);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Uploaded Documents &amp; Diagnostic Records
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Secure persistent repository for clinical scans, lab panels, and physician prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-[#E6F4EC] text-[#0F7A4C] rounded-lg border border-[#C8E6D5]">
          <HardDrive className="w-3.5 h-3.5" />
          <span>Persistent Storage Active</span>
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="bg-[#E6F4EC] border border-[#C8E6D5] text-[#0F7A4C] p-3.5 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span className="font-semibold">{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg(null)} className="text-[#0F7A4C]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Simplified File Upload Input Box */}
      <div className="health-card p-6 bg-white border border-[#E5E5E5]">
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-1">
          Upload New Clinical Record
        </h2>
        <p className="text-xs text-[#5C5C5C] mb-4">
          Select clinical imaging files or electronic documents (JPEG, PNG, PDF) from your device. Documents persist across page reloads.
        </p>

        <label className="border-2 border-dashed border-[#E5E5E5] hover:border-[#0F7A4C] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FAFAFA] hover:bg-[#E6F4EC]/20 group">
          <div className="w-12 h-12 rounded-full bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#0F7A4C]">
            Click to upload document or image
          </span>
          <span className="text-[11px] text-[#5C5C5C] mt-1">
            Supports PNG, JPG, JPEG, PDF up to 15MB • Persistent Storage
          </span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1A1A1A]">
            Uploaded Documents ({patientDocs.length})
          </h2>
          <span className="text-xs text-[#5C5C5C]">
            Click any document to view in Google Drive style previewer
          </span>
        </div>

        <div className="health-card divide-y divide-[#E5E5E5] bg-white border border-[#E5E5E5]">
          {patientDocs.length > 0 ? (
            patientDocs.map(doc => {
              const isPdf = doc.fileName?.toLowerCase().endsWith('.pdf') || doc.fileType?.includes('pdf');

              return (
                <div
                  key={doc.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Thumbnail / Icon */}
                    <div
                      onClick={() => setSelectedFilePreview(doc)}
                      className={`w-12 h-12 rounded-lg border border-[#E5E5E5] flex items-center justify-center overflow-hidden shrink-0 cursor-pointer ${
                        isPdf ? 'bg-[#FDE8E8] text-[#C4302B]' : 'bg-[#E6F4EC] text-[#0F7A4C]'
                      }`}
                    >
                      {doc.previewUrl && !isPdf ? (
                        <img
                          src={doc.previewUrl}
                          alt={doc.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : isPdf ? (
                        <FileText className="w-6 h-6 stroke-[2]" />
                      ) : (
                        <ImageIcon className="w-6 h-6 stroke-[2]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className="text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#0F7A4C] cursor-pointer"
                          onClick={() => setSelectedFilePreview(doc)}
                        >
                          {doc.fileName}
                        </h3>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F7F7F7] text-[#5C5C5C] border border-[#E5E5E5]">
                          {doc.category || 'Clinical Document'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5C5C5C] mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#5C5C5C]" />
                          <span>Uploaded: {doc.uploadedAt}</span>
                        </span>
                        <span>•</span>
                        <span>Size: {doc.fileSize}</span>
                        <span>•</span>
                        <span className="text-[#0F7A4C] font-medium">{doc.fileType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setSelectedFilePreview(doc)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0F7A4C] hover:bg-[#0F7A4C] hover:text-white border border-[#C8E6D5] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Document</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#5C5C5C]">
              No documents uploaded yet. Upload a diagnostic scan or PDF prescription above.
            </div>
          )}
        </div>
      </div>

      {/* Google Drive Style Document Viewer */}
      <GoogleDriveDocViewer
        document={selectedFilePreview}
        isOpen={!!selectedFilePreview}
        onClose={() => setSelectedFilePreview(null)}
      />
    </div>
  );
};
