[⬅️ Go back to README.md](../README.md)

1. Run the environment setup script:

   ```bash
   npm run setup
   ```

   This will generate the required environment variables (`.env` file).

2. (Optional) For testing purposes, disable rate limiting in your configuration. Note: Always enable rate limiting in production for security.

3. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

4. Access the application at http://localhost:3000

**Note:** Ensure Docker and Docker Compose are installed on your system before proceeding.