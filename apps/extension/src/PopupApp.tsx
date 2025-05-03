import { useState } from "react";
import { RandomModule } from "@repo/module";

// Define the options for the module
const defaultOptions = [
  { label: "Tab 1" },
  { label: "Tab 2" },
  { label: "Tab 3" }
];

export default function PopupApp() {
  const [result, setResult] = useState<string | null>(null);

  const spinWheel = () => {
    const module = new RandomModule(defaultOptions);
    const winner = module.spin();
    setResult(winner.label);
  };

  return (
    <div className="p-4 w-72">
      <h2 className="text-lg font-semibold mb-3">🔄 Activate Module!</h2>
      <button 
        onClick={spinWheel} 
        className="w-full py-2 px-3 mb-3 bg-indigo-600 text-white text-center rounded hover:bg-indigo-700 transition-colors"
      >
        Spin
      </button>
      
      {result && (
        <div className="p-4 border border-dashed border-gray-400 rounded text-center">
          <p className="text-xl">🎊 Result: <strong>{result}</strong></p>
          <p className="text-sm text-gray-500">Congratulations!</p>
        </div>
      )}
    </div>
  );
}