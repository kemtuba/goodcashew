import { useState } from "react";

export default function AgentChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!question.trim()) return;

  setIsLoading(true);
  setAnswer("");

  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    // Check if the API call itself was not successful
    if (!response.ok) {
      // Use the error from the backend if available, otherwise throw a generic one
      throw new Error(data.error || "Network response was not ok");
    }

    setAnswer(data.answer);

  } catch (error) {
    console.error("Error fetching answer:", error);

    // Improved error handling
    if (error.message.includes("503") || error.message.includes("overloaded")) {
      setAnswer("The AI model is currently busy. Please wait a moment and try your question again.");
    } else {
      setAnswer("Sorry, something went wrong. Please try again.");
    }
  }

  setIsLoading(false);
};

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>tira</h2>
      <p>how may i help you?</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., How do I handle pests?"
          style={{ width: '80%', padding: '8px', marginRight: '10px' }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}