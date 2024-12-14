import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Requirement, Status } from '../types';
import getValidationStatusTextColor from '../getValidationStatusTextColor';


const RequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await api.get<Requirement[]>('/requirements');
      setRequirements(response.data);
    } catch (err) {
      console.error('Error fetching requirements:', err);
      setError('Error fetching requirements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const isCompliant = (requirement: Requirement): boolean => {
    return requirement.documents.every(
      (doc) => doc.currentVersion && doc.currentVersion.status === Status.Validated && doc.currentVersion.expirationDate > new Date().toISOString(),
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>CSR Requirements</h1>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Required Documents</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {requirements.map((req) => (
          <tr key={req.id}>
            <td>{req.name}</td>
            <td>{req.description}</td>
            <td>
              <ul>
                {req.documents.map((doc) => (
                  <li key={doc.id}>
                    {doc.name}{' - '}
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: getValidationStatusTextColor(doc.currentVersion?.status as Status),
                      }}>
                      {doc.currentVersion && doc.currentVersion.expirationDate < new Date().toISOString() ? ' - Expired' : doc.currentVersion ? doc.currentVersion.status : 'N/A'}
                    </span>
                  </li>

                ))}
              </ul>
            </td>
            <td style={{ fontWeight: 'bold', color: isCompliant(req) ? 'green' : 'orange' }}>
              {isCompliant(req) ? 'Compliant' : 'Non-compliant'}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequirementsPage;
