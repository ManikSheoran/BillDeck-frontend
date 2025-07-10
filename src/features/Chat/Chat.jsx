import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SendHorizonal, Loader2 } from "lucide-react";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    const userMessage = prompt;
    setHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
    setPrompt("");

    try {
      const res = await axios.post("http://localhost:8000/api/ai/sql/", {
        prompt: userMessage,
      });
      const serverResponse = res.data.response || "No response received.";
      setResponse(serverResponse);
      setHistory((prev) => [...prev, { sender: "bot", text: serverResponse }]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = "Something went wrong. Please try again.";
      setResponse(errorMsg);
      setHistory((prev) => [...prev, { sender: "bot", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <motion.h2
        className="text-2xl font-bold text-emerald-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Chat with Inventory Assistant
      </motion.h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-4 h-[400px] overflow-y-auto space-y-3 mb-4">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">Start a conversation...</p>
        ) : (
          history.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded max-w-[75%] ${
                msg.sender === "user"
                  ? "ml-auto bg-emerald-100 text-right text-emerald-800"
                  : "mr-auto bg-gray-100 text-left text-gray-800"
              }`}
            >
              {msg.text}
            </motion.div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask about prices, stock, etc..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <SendHorizonal className="w-4 h-4" /> Send
            </>
          )}
        </button>
      </form>
    </div>
  );
}
