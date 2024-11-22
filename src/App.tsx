import React, { useState, FormEvent } from 'react';
import { scrapeDocumentation } from './services/docScraper';
import ApiDisplay from './components/ApiDisplay';
import { ApiEndpoint } from './types/ApiInterface';

function App() {
  const [url, setUrl] = useState('');
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await scrapeDocumentation(url);
      setEndpoints(data);
    } catch (err) {
      setError('文档抓取失败，请检查URL是否正确');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">API文档抓取工具</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入API文档URL"
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? '抓取中...' : '抓取'}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {endpoints.length > 0 && (
          <ApiDisplay endpoints={endpoints} />
        )}
      </div>
    </div>
  );
}

export default App; 