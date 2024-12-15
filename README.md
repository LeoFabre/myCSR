# myCSR
_Backend Recruitment take-home assignment for BeavR, fullstack software engineer position._

## Problem statement

> Create an application to help users manage their policy documents and follow their CSR requirements completion advancement.
>

## Context

One of the goals of a CSR data management system is to help companies become and stay compliant with official CSR requirements. An example requirement is `Formalized GHG emissions reduction targets and trajectory : The organization has established goals and planned a pathway for reducing GHG emissions over time`.

A company can be considered compliant with a requirement if it has produced the corresponding documents proving the compliance. These documents can be company policies, certificates, company records, etc. For example, in order to be compliant with the previous requirement, a company must have built a GHG policy that formalizes its commitments and targets relating to the management of GHG emissions.

Finally, each document can have several versions (typically one per year), as a document always has an expiration date.

Documents must be validated (typically by the CSR manager of the company) before they are sent to regulatory authorities to be examined.

# Deliverables

## User Stories

--------------------------------------------

#### 1. **View CSR Requirements and Status**

**As a** CSR Manager,

**I want to** view a list of all CSR requirements along with their compliance status,

**so that** I can easily monitor which requirements are met and which need attention.

--------------------------------------------

#### 2. **Manage Documents Related to CSR Requirements**

**As a** CSR Manager,

**I want to** view, add, update, and delete document versions associated with each CSR requirement,

**so that** I can ensure that all necessary documentation is up-to-date and properly maintained for compliance.

--------------------------------------------

#### 3. **Validate Documents for Compliance**

**As a** CSR Manager,

**I want to** validate documents before they are submitted to regulatory authorities,

**so that** I can ensure that only approved and accurate documents are used for compliance reporting.

--------------------------------------------

## Database Structure

### Relationships

- A `requirement` can have multiple `documents` (Many-to-Many).
- A `document` can belong to multiple `requirements` (Many-to-Many).
- A `document` can have multiple `document_versions` (One-to-Many).
- Each `document` references its current active `document_version` (One-to-One).

### Tables

--------------------------------------------

1. **Requirements**
  - `id` (Primary Key, UUID as TEXT)
  - `name` (TEXT, Unique)
  - `description` (TEXT)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

--------------------------------------------

2. **Documents**
  - `id` (Primary Key, UUID as TEXT)
  - `handle` (TEXT, Unique)
  - `name` (TEXT, Unique)
  - `description` (TEXT)
  - `current_version_id` (Foreign Key referencing `document_versions.id`, nullable, Unique)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

--------------------------------------------

3. **Requirement_Document** (Junction table between `requirements` and `documents`)
  - `requirement_id` (Foreign Key referencing `requirements.id`)
  - `document_id` (Foreign Key referencing `documents.id`)
  - **Primary Key**: (`requirement_id`, `document_id`)

--------------------------------------------

4. **Document Versions**
  - `id` (Primary Key, UUID as TEXT)
  - `document_id` (Foreign Key referencing `documents.id`)
  - `version_number` (INTEGER)
  - `file_path` (TEXT) – Path to the stored document file
  - `expiration_date` (DATE)
  - `status` (ENUM: 'Draft', 'Validated', 'Submitted')
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

--------------------------------------------

## Tech Stack
- **Backend:** NodeJS, ExpressJS, PostgreSQL, Prisma ORM
- **Frontend:** ReactJS, TypeScript, Vite, Axios
- **DevOps:** Docker, Docker Compose, Vercel, fly.io, Supabase

> _**About the tech stack choice:**  
I could have used a smaller stack for this project, 
but I wanted to showcase my skills with some of the technologies that
are already being used at BeavR and also use technologies I'm already proficient with (React, NodeJS, Docker).  
For example, I could have used Python with Flask for the backend, serving the frontend 
as static files to be quicker.  
To be fully honest, the assignment was made in several short dev sessions over three days (1-2 hours each day),
so a tiny bit more than 3 hours, but not that much !  
That said, I had a lot of fun working on this project, and I hope you enjoy reviewing it!  
I also learned how to use Prisma ORM, and I'm definitely going to use it in my future projects!  
>_

## Features
### - **Backend:**
  - RESTful API for CRUD operations on document versions, and document/requirements data retrieval
  - Prisma ORM for database operations
  - PostgreSQL database
  - Database seeding from CSV files

### - **Frontend:**
  - Document version CRUD operations
  - Document/requirements data retrieval
  - Responsive design (kinda, not perfect - prototype focused on backend and functionality)
  - Loading states
  - Form validation

### - **DevOps:**
  - Dockerized backend and frontend
  - Docker Compose for easy local deployment
  - Frontend deployed on Vercel (https://my-csr.vercel.app/)
  - Backend deployed on fly.io (https://mycsr-backend.fly.dev/api)
  - DB hosted on Supabase

## Project setup
_Assuming you have already cloned the repo:_  
### - **Using docker-compose (linux, or windows using docker WSL):**
```bash
cd /path/to/this/repo
```
```bash
docker-compose up
```
If everything goes well, you should be able to access the frontend at `http://localhost:3000` !
### - **Without docker-compose:**  
instructions are provided in the respective README.md files in the frontend and backend directories.