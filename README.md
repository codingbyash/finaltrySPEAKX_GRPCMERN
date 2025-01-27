##QuestSearch : MERN APP WITH GRPC

```markdown
# root_folder - Question Search gRPC Service

A full-stack project that provides a question search service using gRPC and MongoDB. This project allows users to search for technical questions, retrieve paginated results, and explore questions from different domains like Frontend, Backend, and Database.

## Features

- **gRPC API**: A gRPC server running on Node.js, which exposes a search endpoint for querying questions.
- **MongoDB**: Stores questions with their title and type in a MongoDB database.
- **Hardcoded Data**: Initially loads hardcoded questions into the database for testing.
- **Reflection API**: Exposes gRPC reflection for dynamic discovery of service definitions.
- **Envoy Proxy**: A proxy that forwards requests between the frontend and backend services, enabling communication in a microservices environment.

## Technologies Used

- **gRPC**: A high-performance RPC framework for connecting services.
- **MongoDB**: A NoSQL database to store the questions.
- **Node.js**: The runtime environment for running the server.
- **Express**: Used for any additional web server needs.
- **grpc-reflection-js**: A package for enabling reflection on the gRPC server.
- **Envoy Proxy**: An open-source edge and service proxy for managing and securing service-to-service communication.

## Setup Instructions

### Prerequisites

1. **Node.js**: Ensure Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
2. **MongoDB**: Ensure MongoDB is installed and running on your system, or you can use a MongoDB cloud service.
3. **Envoy Proxy**: You will need Envoy Proxy running to forward requests from the frontend to the backend services.

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/codingbyash/finaltrySPEAKX_GRPCMERN
   ```

2. Navigate to the backend directory:

   ```bash
   cd root_folder/backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start MongoDB server (if not running):

   ```bash
   mongod --dbpath=/path/to/your/data/directory
   ```

5. Run the gRPC server:

   ```bash
   node server.js
   ```

   The gRPC server will run on port `50051` by default. The server will load hardcoded questions into the MongoDB database if the database is empty.

### Running Frontend (optional)

1. Navigate to the frontend directory:

   ```bash
   cd root_folder/client
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Run the React development server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

### Running Envoy Proxy

1. **Download Envoy**:
   - Follow the official [Envoy installation guide](https://www.envoyproxy.io/docs/envoy/latest/start) to download Envoy for your platform. or you can use it with docker 

2. **Create an Envoy configuration file**:
   Create an `envoy.yaml` file in the root of your project with the following content:

   ```yaml
   static_resources:
     listeners:
       - name: http_listener
         address: 0.0.0.0:8080
         filter_chains:
           - filters:
               - name: envoy.filters.network.http_connection_manager
                 config:
                   codec_type: AUTO
                   stat_prefix: ingress_http
                   route_config:
                     name: local_route
                     virtual_hosts:
                       - name: local_service
                         domains: ["*"]
                         routes:
                           - match: { prefix: "/" }
                             route: { cluster: grpc_service }
                   http_filters:
                     - name: envoy.filters.http.router
     clusters:
       - name: grpc_service
         connect_timeout: 0.25s
         type: STRICT_DNS
         lb_policy: ROUND_ROBIN
         hosts:
           - socket_address: { address: localhost, port_value: 50051 }
   ```

   This configuration sets Envoy to listen on `http://localhost:8080` and forward requests to the gRPC server running on `localhost:50051`.

3. **Run Envoy**:
   - After downloading and configuring Envoy, start it with the following command:

   ```bash
   envoy -c envoy.yaml
   ```

   Envoy will now act as a reverse proxy between your frontend and gRPC server. It listens on port `8080` and forwards requests to the backend on port `50051`.

## API Endpoints

### Search Questions

- **Method**: `POST`
- **URL**: `http://localhost:8080/question.QuestionService/SearchQuestions`
- **Request Body**:

   ```json
   {
     "query": "React",
     "page": 1,
     "page_size": 10
   }
   ```

- **Response**:

   ```json
   {
     "results": [
       {
         "id": "1",
         "title": "What is gRPC?",
         "type": "Technical"
       },
       {
         "id": "2",
         "title": "How to use MongoDB?",
         "type": "Database"
       }
     ],
     "total_results": 5,
     "current_page": 1,
     "total_pages": 1
   }
   ```

### Reflection API

- **Method**: `GET`
- **URL**: `http://localhost:50051/reflection`
- **Description**: Use this endpoint to dynamically discover available services and methods.

## Troubleshooting

1. **Error: `Failed to list services: server does not support the reflection API`**
   - This error indicates that reflection is not enabled on the server. Make sure you're using the correct `grpc-reflection-js` library and that it's properly configured.

2. **Error: `Failed to dial target host`**
   - Ensure that the gRPC server is running and accessible at `localhost:50051`. Check firewall settings or other network configurations if necessary.

3. **Error: `Failed to connect to Envoy Proxy`**
   - Ensure that Envoy is running correctly and that the `envoy.yaml` configuration points to the correct gRPC backend (`localhost:50051`).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork the repository, open issues, and submit pull requests. All contributions are welcome!
```

### Key Additions:
- **Envoy Proxy Setup**: Detailed instructions on downloading and running Envoy Proxy.
- **Envoy Configuration**: Example configuration for forwarding requests from `localhost:8080` to the backend running on `localhost:50051`.

Make sure to adjust the paths and details according to your system and project structure.
