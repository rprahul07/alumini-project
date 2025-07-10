import { useState } from 'react';

const faqData = [
  { question: 'How do I create an Account?', answer: 'Answer 1', category: 'Account' },
  { question: 'How can I reset my password?', answer: 'Answer 2', category: 'Account' },
  { question: 'What payment methods do you accept?', answer: 'Answer 3', category: 'Billing' },
  { question: 'Can I change my user?', answer: 'Answer 4', category: 'Account' },
  { question: 'What browsers are supported?', answer: 'Answer 5', category: 'Technical' },
  { question: 'Is there an API available?', answer: 'Answer 6', category: 'Technical' },
  { question: 'How do I contact customer support?', answer: 'Answer 7', category: 'Support' },
  { question: 'What is your policy?', answer: 'Answer 8', category: 'Support' },
];

function FaqList({ selectedCategory }) {
  const [openQuestion, setOpenQuestion] = useState(null);

  const filteredFaqs =
    selectedCategory === 'All'
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  const toggle = (question) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  return (
    <>
      {filteredFaqs.map((item, index) => {
        const isOpen = openQuestion === item.question;
        return (
          <div
            key={index}
            onClick={() => toggle(item.question)}
            className="bg-white rounded-xl p-4 mb-3 hover:bg-[#EFEFEF] transition-all duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-center font-semibold text-[#5A32EA] mb-2">
              <span>{item.question}</span>
              <span
                className={`text-sm transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                ⌄
              </span>
            </div>
            <div
              className={`text-black overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-52 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default FaqList;