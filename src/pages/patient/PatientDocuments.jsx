import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Calendar, Check, Eye, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PatientDocuments = () => {
  const { documents, uploadDocument } = useApp();
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read image preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl = event.target.result;
        uploadDocument({
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl
        });
        setUploadSuccessMsg(`Document "${file.name}" uploaded successfully.`);
        setTimeout(() => setUploadSuccessMsg(null), 4000);
      };
      reader.readAsDataURL(file);
    } else {
      uploadDocument({
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: null
      });
      setUploadSuccessMsg(`Document "${file.name}" uploaded successfully.`);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Uploaded Documents
          </h1>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Secure repository for clinical diagnostic scans, outpatient lab panels, and physician prescriptions.
          </p>
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
          Select clinical imaging files or electronic documents (JPEG, PNG, PDF) from your device.
        </p>

        <label className="border-2 border-dashed border-[#E5E5E5] hover:border-[#0F7A4C] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FAFAFA] hover:bg-[#E6F4EC]/20 group">
          <div className="w-12 h-12 rounded-full bg-[#E6F4EC] text-[#0F7A4C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#0F7A4C]">
            Click to upload document or image
          </span>
          <span className="text-[11px] text-[#5C5C5C] mt-1">
            Supports PNG, JPG, JPEG, PDF up to 15MB
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
            Uploaded Documents ({documents.length})
          </h2>
          <span className="text-xs text-[#5C5C5C]">
            Shared with clinic clinicians
          </span>
        </div>

        <div className="health-card divide-y divide-[#E5E5E5] bg-white border border-[#E5E5E5]">
          {documents.map(doc => {
            const isImage = doc.fileType.includes('Image') || doc.previewUrl;

            return (
              <div
                key={doc.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  {/* Thumbnail / Icon */}
                  <div className="w-12 h-12 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] flex items-center justify-center overflow-hidden shrink-0">
                    {doc.previewUrl ? (
                      <img
                        src={doc.previewUrl}
                        alt={doc.fileName}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setSelectedFilePreview(doc)}
                      />
                    ) : isImage ? (
                      <ImageIcon className="w-6 h-6 text-[#0F7A4C]" />
                    ) : (
                      <FileText className="w-6 h-6 text-[#5C5C5C]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#0F7A4C] cursor-pointer" onClick={() => setSelectedFilePreview(doc)}>
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
                    className="px-3 py-1.5 text-xs font-medium text-[#0F7A4C] hover:bg-[#E6F4EC] border border-[#C8E6D5] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedFilePreview && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E5E5E5] max-w-lg w-full p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] truncate max-w-xs">
                  {selectedFilePreview.fileName}
                </h3>
                <p className="text-xs text-[#5C5C5C]">
                  {selectedFilePreview.category} • {selectedFilePreview.fileSize}
                </p>
              </div>
              <button
                onClick={() => setSelectedFilePreview(null)}
                className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] flex items-center justify-center min-h-[180px]">
              {selectedFilePreview.previewUrl ? (
                <img
                  src={selectedFilePreview.previewUrl}
                  alt={selectedFilePreview.fileName}
                  className="max-h-[300px] w-auto rounded object-contain"
                />
              ) : (
                <div className="text-center space-y-2">
                  <FileText className="w-12 h-12 text-[#0F7A4C] mx-auto opacity-75" />
                  <p className="text-xs font-semibold text-[#1A1A1A]">
                    {selectedFilePreview.fileName}
                  </p>
                  <p className="text-[11px] text-[#5C5C5C]">
                    Standard Clinical Portable Document Format (PDF)
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-[#5C5C5C] bg-[#FAFAFA] p-3 rounded border border-[#E5E5E5] space-y-1">
              <div><strong>Recorded Upload Date:</strong> {selectedFilePreview.uploadedAt}</div>
              <div><strong>Authorized Clinician Reviewer:</strong> {selectedFilePreview.doctor || 'Dr. Sarah Jenkins'}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFilePreview(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#0F7A4C] text-white rounded-lg hover:bg-[#0c633d]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
