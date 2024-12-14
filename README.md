# myCSR
_Backend Recruitment take-home assignment for BeavR, fullstack software engineer position._

## Tech Stack
- Backend: NodeJS, ExpressJS, PostgreSQL, Prisma ORM
- Frontend: ReactJS, TypeScript, Vite, Axios
- DevOps: Docker, Docker Compose

_**Note:** I could have used a smaller stack for this project, 
but I wanted to showcase my skills with some of the technologies that
are already being used at BeavR.
I could have used Python with Flask for the backend, serving the frontend 
as static files to be quicker._

## Features
- **Backend:**
  - RESTful API for CRUD operations on document versions, and document/requirements data retrieval
  - Prisma ORM for database operations
  - PostgreSQL database
  - Database seeding from CSV files

- **Frontend:**
  - Document version CRUD operations
  - Document/requirements data retrieval
  - Responsive design (kinda, not perfect - prototype focused on backend and functionality)
  - Loading states
  - Form validation

- **DevOps:**
  - Dockerized backend and frontend
  - Docker Compose for easy local deployment

## Project setup
Assuming you have already cloned the repo:
- **Using docker-compose (linux, or windows using docker WSL):**
```bash
cd /path/to/this/repo
```
```bash
docker-compose up
```
If everything goes well, you should be able to access the frontend at `http://localhost:3000` !
- **Without docker-compose:**  
instructions are provided in the respective README.md files in the frontend and backend directories.