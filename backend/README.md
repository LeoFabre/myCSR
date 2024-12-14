# Requirements 
- postgresql is expected to be running on localhost:5432
- '**csr_user**' user is expected to exist and have their password set to '**csr_password**'
- if required to create a db before seeding, name it '**csr_db**' (prisma will create the database anyway if it doesn't exist)
- **nodejs** is expected to be installed, **_I used v21.2.0 while developing this_**

# Setup
To create the database schema :  
```cd /path/to/this/repo/backend```  
```npx prisma generate```  
```npx prisma migrate dev --name init```  

To seed the database with the data from the csv files :
``cd /path/to/this/repo/backend``  
``node ./prisma/seed.js``  

# Running outside of docker
To start the backend server :
``cd /path/to/this/repo/backend``  
``npm run dev``  

# Running inside of docker
You can start the whole stack using docker-compose on the main repo directory :
```cd /path/to/this/repo```  
```docker-compose up```