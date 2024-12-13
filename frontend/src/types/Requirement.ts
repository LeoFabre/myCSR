import { Document as myDocument } from './Document';
export interface Requirement {
  id: string;
  name: string;
  description: string;
  documents: myDocument[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
