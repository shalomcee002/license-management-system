# Fullstack Spring Boot and React Application

This project is a fullstack application built with Spring Boot for the backend and React for the frontend, utilizing MySQL as the database.

## Backend

The backend is developed using Spring Boot and follows a standard structure:

- **Controllers**: Handle incoming requests and return responses.
- **Models**: Represent the data structure of the application.
- **Repositories**: Interfaces for data access, typically extending Spring Data JPA repositories.
- **Services**: Contain business logic and interact with the repositories.

### Running the Backend

1. Ensure you have Java and Maven installed.
2. Navigate to the `backend` directory.
3. Run the application using the command:
   ```
   mvn spring-boot:run
   ```

### Configuration

The backend configuration can be found in `src/main/resources/application.properties`. Update the database connection settings as needed.

## Frontend

The frontend is developed using React and provides a user interface for the application.

### Running the Frontend

1. Ensure you have Node.js and npm installed.
2. Navigate to the `frontend` directory.
3. Install the dependencies using:
   ```
   npm install
   ```
4. Start the application using:
   ```
   npm start
   ```

## Database

This application uses MySQL as the database. Ensure that you have a MySQL server running and the necessary database created.

## License

This project is licensed under the MIT License.