import React from 'react';

function App() {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg">
      <h1 className="mb-4 text-center text-xl font-bold">Turbo Modern Starter Extension</h1>
      <p className="mb-4 text-center text-sm text-gray-600">
        This is a browser extension built with the Turbo Modern Starter.
      </p>
      <div className="flex justify-center">
        <button 
          className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => alert('Button clicked!')}
        >
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;