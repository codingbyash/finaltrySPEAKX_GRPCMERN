// Import required modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');

// Load the protobuf file
const PROTO_PATH = './question.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const questionProto = grpc.loadPackageDefinition(packageDefinition).question;

// MongoDB connection setup
// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/questionsDBase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const questionSchema = new mongoose.Schema({
  id: String,
  title: String,
  type: String,
});
const Question = mongoose.model('Question', questionSchema);

// Function to load hardcoded data
const loadHardcodedData = async () => {
  const hardcodedData = [
    { id: '1', title: 'What is gRPC?', type: 'Technical' },
    { id: '2', title: 'How to use MongoDB?', type: 'Database' },
    { id: '3', title: 'Explain React useState hook.', type: 'Frontend' },
    { id: '4', title: 'What is Envoy Proxy?', type: 'Networking' },
    { id: '5', title: 'Difference between REST and gRPC?', type: 'Technical' },
  ];

  try {
    // Check if the collection already has data
    const count = await Question.countDocuments();
    if (count === 0) {
      await Question.insertMany(hardcodedData);
      console.log('Hardcoded data inserted into the database.');
    } else {
      console.log('Database already contains data.');
    }
  } catch (error) {
    console.error('Error loading hardcoded data:', error);
  }
};

// Call the function to load hardcoded data
loadHardcodedData();



// Define the gRPC server methods
const searchQuestions = async (call, callback) => {
  try {
    const { query, page, page_size } = call.request;
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    const skip = (page - 1) * page_size;

    const [results, totalResults] = await Promise.all([
      Question.find({ title: regex }).skip(skip).limit(page_size),
      Question.countDocuments({ title: regex }),
    ]);

    const totalPages = Math.ceil(totalResults / page_size);

    callback(null, {
      results: results.map((q) => ({ id: q.id, title: q.title, type: q.type })),
      total_results: totalResults,
      current_page: page,
      total_pages: totalPages,
    });
  } catch (error) {
    console.error('Error searching questions:', error);
    callback({ code: grpc.status.INTERNAL, message: 'Internal server error' });
  }
};

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(questionProto.QuestionService.service, {
  SearchQuestions: searchQuestions,
});

const PORT = 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, bindPort) => {
    if (err) {
      console.error('Error starting server:', err);
      return;
    }
    console.log(`Server running at http://localhost:${PORT}`);
    server.start();
  }
);
