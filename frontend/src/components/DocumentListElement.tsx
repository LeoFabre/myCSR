import React, { useState } from 'react';
import api from '../services/api';
import { Document, DocumentVersion, Status } from '../types';
import getValidationStatusTextColor from '../getValidationStatusTextColor';

type Props = {
  doc: Document;
  onDocumentUpdate: () => void;
};

const DocumentListElement: React.FC<Props> = ({ doc, onDocumentUpdate }) => {
  const [newVersion, setNewVersion] = useState<Partial<DocumentVersion>>({
    status: Status.Draft,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleCreateVersion = async () => {
    if (!file || !newVersion.expirationDate || !newVersion.status) {
      alert('Please fill in all fields and select a file to create a new version.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('expirationDate', new Date(newVersion.expirationDate).toISOString());
    formData.append('status', newVersion.status);

    try {
      await api.post(`/documents/${doc.id}/upload`, formData);
      setNewVersion({ status: Status.Draft });
      setFile(null);
      onDocumentUpdate();
    } catch (err) {
      console.error('Error creating document version:', err);
      alert('Error creating document version. Please try again later.');
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    try {
      await api.delete(`/documents/${doc.id}/versions/${versionId}`);
      onDocumentUpdate();
    } catch (err) {
      console.error('Error deleting document version:', err);
      alert('Error deleting version. Please try again later.');
    }
  };

  const handleUpdateStatus = async (versionId: string, status: Status) => {
    try {
      await api.put(`/documents/${doc.id}/versions/${versionId}`, { status });
      onDocumentUpdate();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status. Please try again later.');
    }
  };

  const handleDownloadFile = async (versionId: string) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download/${versionId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${versionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Error downloading file. Please try again later.');
    }
  };

  return (
    <tr>
      <td>{doc.name}</td>
      <td>{doc.currentVersion ? `v${doc.currentVersion.versionNumber}` : 'N/A'}</td>
      <td>
        {doc.currentVersion ? (
          <span
            style={{
              fontWeight: 'bold',
              color: getValidationStatusTextColor(doc.currentVersion?.status as Status),
            }}
          >
            {doc.currentVersion &&
            doc.currentVersion.expirationDate < new Date().toISOString()
              ? ' - Expired'
              : doc.currentVersion
                ? doc.currentVersion.status
                : 'N/A'}
          </span>
        ) : (
          'N/A'
        )}
      </td>

      <td>
        {/* Add new version form */}
        <div style={{ marginBottom: '1rem' }}>
          <h4>Add new version</h4>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <input
            type="date"
            placeholder="Expiration date"
            value={
              newVersion.expirationDate
                ? newVersion.expirationDate.substring(0, 10)
                : ''
            }
            onChange={(e) =>
              setNewVersion({
                ...newVersion,
                expirationDate: e.target.value,
              })
            }
          />
          <select
            value={newVersion.status || Status.Draft}
            onChange={(e) =>
              setNewVersion({
                ...newVersion,
                status: e.target.value as Status,
              })
            }
          >
            <option value={Status.Draft}>Draft</option>
            <option value={Status.Validated}>Validated</option>
            <option value={Status.Submitted}>Submitted</option>
          </select>
          <button onClick={handleCreateVersion}>Add version</button>
        </div>

        {/* Versions list */}
        {doc.documentVersions.length > 0 && (
          <div>
            <h4>Versions:</h4>
            <ul>
              {doc.documentVersions.map((version) => (
                <li key={version.id}>
                  v{version.versionNumber} - {version.status} <br />
                  Expiration date: {version.expirationDate} <br />
                  File path: {version.filePath} <br />
                  <button onClick={() => handleDeleteVersion(version.id)}>
                    Delete
                  </button>
                  <button onClick={() => handleDownloadFile(version.id)}>
                    Download File
                  </button>
                  <select
                    value={version.status}
                    onChange={(e) =>
                      handleUpdateStatus(version.id, e.target.value as Status)
                    }
                  >
                    <option value={Status.Draft}>Draft</option>
                    <option value={Status.Validated}>Validated</option>
                    <option value={Status.Submitted}>Submitted</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        )}
      </td>
    </tr>
  );
};

export default DocumentListElement;
