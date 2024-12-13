export interface Document {
  id: string;
  requirementId: string;
  name: string;
  documentVersions: DocumentVersion[];
  currentVersionId?: string;
  currentVersion?: DocumentVersion;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  filePath: string;
  expirationDate: string;
  status: Status;
  validations: ValidationLog[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationLog {
  id: string;
  documentVersionId: string;
  validatedBy: string;
  validationDate: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Status {
  Draft = "Draft", // not submitted yet
  Submitted = "Submitted", // submitted but not validated yet
  Validated = "Validated",
}
