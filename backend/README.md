postgresql is expected to be running on localhost:5432
'postgres' user is expected to have a password of 'admin'
a 'csr_db' database is expected to exist

to create the database schema :
cd /path/to/this/repo
npx prisma generate
npx prisma migrate dev --name init

to populate the database with the data from the csv file :
cd /path/to/this/repo
node ./prisma/seed.js

