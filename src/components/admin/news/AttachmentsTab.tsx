'use client';

import { useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import type { AttachmentData } from '@/hooks/useNewsEditor';

interface AttachmentsTabProps {
  attachments: AttachmentData[];
  onAttachmentsChange: (attachments: AttachmentData[]) => void;
}

export default function AttachmentsTab({
  attachments,
  onAttachmentsChange,
}: AttachmentsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachmentData[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newAttachments.push({
        id: `temp-${Date.now()}-${i}`,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        fileBlob: file,
      } as AttachmentData & { fileBlob: File });
    }
    onAttachmentsChange([...attachments, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [attachments, onAttachmentsChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    const files = e.dataTransfer.files;
    if (!files) return;

    const newAttachments: AttachmentData[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newAttachments.push({
        id: `temp-${Date.now()}-${i}`,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        fileBlob: file,
      } as AttachmentData & { fileBlob: File });
    }
    onAttachmentsChange([...attachments, ...newAttachments]);
  }, [attachments, onAttachmentsChange]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveAttachment = useCallback((id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  }, [attachments, onAttachmentsChange]);

  return (
    <div className="space-y-5 max-w-3xl p-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
      />

      {/* File Upload Section */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Drag files here or click to upload
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP
          </p>
        </div>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            {attachments.length} file{attachments.length !== 1 ? 's' : ''}
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.filename}
                  </p>
                  {attachment.size && attachment.uploadedAt && (
                    <p className="text-xs text-gray-500">
                      {(attachment.size / 1024).toFixed(1)} KB • {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No attachments yet. Upload files above.
          </p>
        </div>
      )}
    </div>
  );
}
