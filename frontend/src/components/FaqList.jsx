import { useState } from 'react';

const faqData = [
  { 
    question: 'How do I create an alumni account?', 
    answer: 'Click on \'Sign Up\' and select \'Alumni\' as your role. Fill in your graduation details and current professional information to complete your profile.', 
    category: 'Account' 
  },
  { 
    question: 'How can I post job opportunities?', 
    answer: 'As an alumni, you can post job opportunities by navigating to the Opportunities section in your dashboard. Click on "Create Opportunity" and fill in the job details including company name, job title, description, and requirements.', 
    category: 'Opportunities' 
  },
  { 
    question: 'How do I connect with other alumni?', 
    answer: 'You can connect with other alumni through the Alumni page where you can search, filter, and view alumni profiles. You can also send mentorship requests or connect through events and networking opportunities.', 
    category: 'Networking' 
  },
  { 
    question: 'Can students apply for jobs posted by alumni?', 
    answer: 'Yes, students can view and apply for job opportunities posted by alumni. They can access these opportunities through the Jobs page and apply directly through the platform.', 
    category: 'Opportunities' 
  },
  { 
    question: 'How do I update my profile information?', 
    answer: 'You can update your profile information by going to your dashboard and clicking on "Edit Profile". From there, you can modify your personal details, professional information, and contact details.', 
    category: 'Profile' 
  },
  { 
    question: 'How can I reset my password?', 
    answer: 'Click on "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link via email to create a new password.', 
    category: 'Account' 
  },
  { 
    question: 'How do I contact support?', 
    answer: 'You can contact our support team through the Contact Us page, or reach out via email at support@cucekalumni.com. We typically respond within 24 hours.', 
    category: 'Support' 
  },
  { 
    question: 'What browsers are supported?', 
    answer: 'Our platform works best with modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.', 
    category: 'Technical' 
  },
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
            className="bg-white rounded-xl p-4 mb-3 hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-slate-200"
          >
            <div className="flex justify-between items-center font-semibold text-slate-900 mb-2">
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
              className={`text-slate-700 overflow-hidden transition-all duration-300 ease-in-out ${
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