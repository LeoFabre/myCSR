import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Document } from '../types';
import DocumentListElement from '../components/DocumentListElement';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get<Document[]>('/documents');
      const sortedDocuments = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setDocuments(sortedDocuments);
    } catch (err) {
      console.error('Error while retrieving documents.', err);
      setError('Error while retrieving documents.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
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
          <DocumentListElement
            key={doc.id}
            doc={doc}
            onDocumentUpdate={fetchDocuments}
          />
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsPage;
