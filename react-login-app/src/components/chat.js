import { useState } from "react";

const qaList = [
  { question: "What is your return policy?", answer: "You can return products within 7 days of delivery." },
  { question: "How to track my order?", answer: "Click on 'My Orders' > Select order > Track." },
  { question: "Do you offer Cash on Delivery?", answer: "Yes, COD is available on eligible products." },
  { question: "Query not mention?", answer: "Please contact to customer service e-commerce@gmail.com"},
];

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLog, setChatLog] = useState([]);

  const handleClick = (q, a) =>
    setChatLog(prev => [...prev, { type: "q", text: q }, { type: "a", text: a }]);

  return (
    <div className="floating-chat-wrapper">
      {isOpen && (
        <div className="floating-chat-box">
          <div className="chat-header">💬 Support Bot</div>
          <div className="chat-body">
            {chatLog.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.type}`}>{msg.text}</div>
            ))}
            {qaList.map((item, idx) => (
              <button
                key={idx}
                className="chat-question-btn"
                onClick={() => handleClick(item.question, item.answer)}
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖ Close" : "💬 Need Help?"}
      </div>
    </div>
  );
};

export default Chat;
