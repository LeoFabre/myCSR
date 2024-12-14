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

  const handleCreateVersion = async () => {
    if (!newVersion.filePath || !newVersion.expirationDate || !newVersion.status) {
      alert('Please fill in all fields to create a new version.');
      return;
    }

    try {
      await api.post(`/documents/${doc.id}/versions`, {
        ...newVersion,
        expirationDate: new Date(newVersion.expirationDate).toISOString(),
      });
      setNewVersion({ status: Status.Draft });
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

  return (
    <tr>
      <td>{doc.name}</td>
      <td>{doc.currentVersion ? `v${doc.currentVersion.versionNumber}` : 'N/A'}</td>
      <td>{
        doc.currentVersion ?
          <span
            style={{
              fontWeight: 'bold',
              color: getValidationStatusTextColor(doc.currentVersion?.status as Status)
            }}
          >
            {doc.currentVersion ? doc.currentVersion.status : 'N/A'}
          </span>
        :
          'N/A'
      }</td>

      <td>
        {/* Add new version form */}
        <div style={{ marginBottom: '1rem' }}>
          <h4>Add new version</h4>
          <input
            type="text"
            placeholder="File path"
            value={newVersion.filePath || ''}
            onChange={(e) =>
              setNewVersion({
                ...newVersion,
                filePath: e.target.value,
              })
            }
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
        {
          doc.documentVersions.length > 0 &&
            <div>
              <h4>Versions:</h4>
              <ul>
                {doc.documentVersions.map((version) => (
                  <li key={version.id}>
                    v{version.versionNumber} - {version.status}
                    <button onClick={() => handleDeleteVersion(version.id)}>
                      Delete
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
        }
      </td>
    </tr>
  );
};

export default DocumentListElement;
