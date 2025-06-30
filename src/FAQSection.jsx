import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is MAHI and how can it help me?",
      answer:
        "MAHI is an AI-powered mental health companion designed to help you track your moods, practice mindfulness, and receive personalized advice for improving your mental well-being.",
    },
    {
      question: "Can MAHI track my mood and emotions daily?",
      answer:
        "Yes, MAHI tracks your moods and emotions daily, providing insights into your emotional patterns and offering guidance for emotional growth and balance.",
    },
    {
      question: "Is my data private and secure with MAHI?",
      answer:
        "Absolutely! MAHI uses encryption and best practices in data privacy to ensure that your personal information and emotional data are kept safe and confidential.",
    },
    {
      question: "How do I access MAHI's features?",
      answer:
        "You can access MAHI through our app or website. After signing up, you’ll be able to explore features such as mood tracking, mindfulness exercises, and personalized mental wellness advice.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#fdfaf8] py-24 px-4 md:px-20">
      <h2 className="text-center text-5xl font-serif font-semibold mb-12">
        Frequently Asked <span className="italic text-green-600">Questions</span>
      </h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <button
              className="w-full text-left px-6 py-4 text-lg font-medium flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 text-base">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
