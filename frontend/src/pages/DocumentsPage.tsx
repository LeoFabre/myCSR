import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Document, DocumentVersion, Status } from '../types';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newVersion, setNewVersion] = useState<Partial<DocumentVersion>>({
    status: Status.Draft,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get<Document[]>('/documents');
      setDocuments(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des documents:', err);
      setError('Impossible de récupérer les documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVersion = async (documentId: string) => {
    if (
      !newVersion.filePath ||
      !newVersion.expirationDate ||
      !newVersion.status
    ) {
      alert('Please fill in all fields to create a new version.');
      return;
    }

    try {
      await api.post(`/documents/${documentId}/versions`, {
        ...newVersion,
        expirationDate: new Date(newVersion.expirationDate).toISOString(),
      });
      setNewVersion({
        status: Status.Draft,
      });
      fetchDocuments();
    } catch (err) {
      console.error('Error creating document version:', err);
      alert('Error creating document version. Please try again later.');
    }
  };

  const handleDeleteVersion = async (documentId: string, versionId: string) => {
    try {
      await api.delete(`/documents/${documentId}/versions/${versionId}`);
      fetchDocuments();
    } catch (err) {
      console.error('Error deleting document version:', err);
      alert('Error creating deleting version. Please try again later.');
    }
  };

  const handleUpdateStatus = async (
    documentId: string,
    versionId: string,
    status: Status
  ) => {
    try {
      await api.put(`/documents/${documentId}/versions/${versionId}`, { status });
      fetchDocuments();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status. Please try again later.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>CSR Documents</h1>
      <table>
        <thead>
        <tr>
          <th>Document name</th>
          <th>Current version</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {documents.map((doc) => (
          <tr key={doc.id}>
            <td>{doc.name}</td>
            <td>
              {doc.currentVersion
                ? `v${doc.currentVersion.versionNumber}`
                : 'N/A'}
            </td>
            <td>{doc.currentVersion ? doc.currentVersion.status : 'N/A'}</td>
            <td>
              {/* add new version form */}
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
                <button onClick={() => handleCreateVersion(doc.id)}>
                  Add version
                </button>
              </div>
              {/* Versions list */}
              <div>
                <h4>Versions:</h4>
                <ul>
                  {doc.documentVersions.map((version) => (
                    <li key={version.id}>
                      v{version.versionNumber} - {version.status}
                      <button
                        onClick={() =>
                          handleDeleteVersion(doc.id, version.id)
                        }
                      >
                        Delete
                      </button>
                      <select
                        value={version.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            doc.id,
                            version.id,
                            e.target.value as Status
                          )
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
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsPage;
