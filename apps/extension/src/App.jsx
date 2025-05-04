import React from 'react';

function App() {
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4">Turbo Modern Starter Extension</h1>
      <p className="text-sm text-gray-600 mb-4 text-center">
        This is a browser extension built with the Turbo Modern Starter.
      </p>
      <div className="flex justify-center">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          onClick={() => alert('Button clicked!')}
        >
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;