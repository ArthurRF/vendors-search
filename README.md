# The application

This project is an application to search for vendors related to specific jobs!

## Requirements

- Docker
- Docker Compose

## Getting started

1. Clone the repository:

   ```
   git clone https://github.com/ArthurRF/vendors-search.git
   cd vendors-search
   ```

2. Start the application:

   ```
   docker-compose up -d
   ```

   This command will:

   - Build the application image
   - Start the application server on port 3000

3. Test the application:
   When the containers are up, you can run all the routes with the baseURL:
   ```
   http://localhost:3000/v1/
   ```

4. Collection tests:
	 Import the file that is in the folder `docs/vendor-smart.json` into your HTTP tests application (INSOMNIA / POSTMAN)
	 Use the routes created inside there to test the project functionalities

## Stopping the project

To stop the project and remove the containers, run:
```
docker-compose down
```

To stop the project and remove the containers and volumes, run: 
```
docker-compose down -v
```
