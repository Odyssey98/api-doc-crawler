import React, { useState } from 'react';
import { ApiEndpoint } from '../types/ApiInterface';

interface Props {
  endpoints: ApiEndpoint[];
}

const ApiDisplay = ({ endpoints }: Props) => {
  const [showRaw, setShowRaw] = useState(false);

  // 格式化 JSON 显示
  const formattedJson = JSON.stringify(endpoints, null, 2);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          {showRaw ? '切换到可视化视图' : '切换到 JSON 视图'}
        </button>
      </div>

      {showRaw ? (
        <div className="bg-gray-900 p-4 rounded-lg">
          <pre className="text-green-400 overflow-x-auto">
            <code>{formattedJson}</code>
          </pre>
        </div>
      ) : (
        endpoints.map((endpoint, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 text-white rounded font-mono ${
                endpoint.method === 'GET' ? 'bg-blue-500' :
                endpoint.method === 'POST' ? 'bg-green-500' :
                endpoint.method === 'PUT' ? 'bg-yellow-500' :
                endpoint.method === 'DELETE' ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                {endpoint.method}
              </span>
              <span className="font-mono text-lg">{endpoint.path}</span>
            </div>
            
            <p className="text-gray-600 mb-4">{endpoint.description}</p>
            
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">请求参数</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {endpoint.parameters.map((param, idx) => (
                    <div key={idx} className="mb-2 last:mb-0">
                      <span className="font-mono text-blue-600">{param.name}</span>
                      <span className="text-gray-500 mx-2">({param.type})</span>
                      {param.required && (
                        <span className="text-red-500 text-sm">必填</span>
                      )}
                      {param.description && (
                        <p className="text-gray-600 ml-4 mt-1">{param.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {endpoint.notes && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">重要说明</h3>
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 whitespace-pre-line">
                  {endpoint.notes}
                </div>
              </div>
            )}

            {endpoint.responses && endpoint.responses.length > 0 && (
              <div>
                <h3 className="font-bold mb-2">响应</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {endpoint.responses.map((response, idx) => (
                    <div key={idx}>
                      <span className="text-green-500">{response.status}</span>
                      <span className="ml-2 text-gray-600">{response.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ApiDisplay; 