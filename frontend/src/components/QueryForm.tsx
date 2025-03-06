import React, { useState, useEffect } from "react";
import axios from "axios";

interface Query {
  _id: string;
  userQuery: string;
  aiResponse: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  requestPayload?: {
    query: string;
  };
  responsePayload?: {
    error?: string;
    details?: string;
  };
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: Query | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, query }) => {
  if (!isOpen || !query) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Query Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <div className="flex-1 p-4 border-r border-gray-200 text-left">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Request Payload
              </h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-gray-900 whitespace-pre-wrap font-mono text-sm">
                  {JSON.stringify(query.requestPayload, null, 2)}
                </pre>
              </div>
            </div>
            <div className="flex-1 p-4 text-left">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Response Payload
              </h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-gray-900 whitespace-pre-wrap font-mono text-sm">
                  {JSON.stringify(query.responsePayload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex space-x-4">
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const QueryForm: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [queries, setQueries] = useState<Query[]>([]);
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    query: Query | null;
  }>({
    isOpen: false,
    query: null
  });

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get("/api/queries");
      setQueries(res.data.data);
    } catch (err) {
      setError("Failed to fetch queries");
    } finally {
      setTableLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/generate", { query });
      setResponse(res.data.response);
      // Refresh queries after successful submission
      await fetchQueries();
    } catch (err) {
      setError("Failed to generate response");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/queries/${id}`);
      await fetchQueries();
    } catch (err) {
      setError("Failed to delete query");
    }
  };

  const handleEdit = (query: Query) => {
    setEditingQuery(query);
    setQuery(query.userQuery);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuery) return;

    try {
      await axios.put(`/api/queries/${editingQuery._id}`, {
        userQuery: query,
        status: editingQuery.status
      });
      setEditingQuery(null);
      setQuery("");
      await fetchQueries();
    } catch (err) {
      setError("Failed to update query");
    }
  };

  return (
    <div className="mx-auto text-left">
      <form
        onSubmit={editingQuery ? handleUpdate : handleSubmit}
        className="space-y-6"
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="query" className="text-sm font-medium text-gray-700">
            {editingQuery ? "Edit your query" : "Enter your query"}
          </label>
          <div className="flex gap-4">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to know?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {editingQuery ? "Updating..." : "Generating..."}
                </span>
              ) : editingQuery ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
            {editingQuery && (
              <button
                type="button"
                onClick={() => {
                  setEditingQuery(null);
                  setQuery("");
                }}
                className="px-6 py-2 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {response && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Response</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}
      </form>

      {/* Queries Table */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Previous Queries
        </h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {tableLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Query
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queries.map((q) => (
                  <tr key={q._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{q.userQuery}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          q.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : q.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(q.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 text-center">
                      <button
                        onClick={() => handleEdit(q)}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewModal({ isOpen: true, query: q })}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, query: null })}
        query={viewModal.query}
      />
    </div>
  );
};

export default QueryForm;
