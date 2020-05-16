## Database schema management app

This application is used to apply/rollback database shema and data changes.

It uses liquibase library and build with the help of maven build tool.

To run database migration you need to set up couple environment variables:

* DB_URL - this is database url in such format jdbc:postgresql://<hostname>:<password>/<database name>?sslmode=require
* DB_USERNAME - name of the user that is used to connect to database
* DB_PASSWORD - password of database user

With the help of maven you can easily appl rollback changes. Here is examples of cli commands you can use:
* mvn clean process-resources -Pdb-update
* mvn clean process-resources -Pdb-rebuild
* mvn clean process-resources -Pdb-rollback