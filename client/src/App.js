import React, { useState } from 'react';
import './App.css';
import { QuestionServiceClient } from './question_grpc_web_pb';
import { SearchRequest } from './question_pb';

const client = new QuestionServiceClient('http://localhost:8080'); // Envoy proxy address

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async () => {
    setLoading(true);

    const request = new SearchRequest();
    request.setQuery(query);
    request.setPage(page);
    request.setPageSize(10); // Set results per page to 10

    client.searchQuestions(request, {}, (err, response) => {
      setLoading(false);
      if (err) {
        console.error('Error searching questions:', err);
        return;
      }

      const { results, totalResults, totalPages } = response.toObject();
      setResults(results);
      setTotalPages(totalPages);
    });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="App">
      <h1>Question Search</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="results">
        {results.length > 0 ? (
          results.map((question) => (
            <div key={question.id} className="result-item">
              <h3>{question.title}</h3>
              <p>Type: {question.type}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
