import { useState } from "react";

function ContactInput() {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Message, setMessage] = useState("");
  const [Subject, setSubject] = useState("");
  const [Submitted, setSubmitted] = useState(false);
  const [Errors, setErrors] = useState({});

  const validateName = (name) => {
    if (name.trim() === "") return "Error: Name cannot be blank.";
    return /^[A-Za-z\s]+$/.test(name)
      ? ""
      : "Error: Name must only contain letters.";
  };

  const validateEmail = (email) => {
    if (email.trim() === "") return "Error: Email cannot be blank";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ""
      : "Error: Invalid Email Format";
  };

  const validateSubject = (subject) =>
    subject.trim().length >= 2 ? "" : "Subject length is too small";

  const validateMessage = (message) =>
    message.trim().length >= 2 ? "" : "Message length is too short";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      FullNameError: validateName(FullName),
      EmailError: validateEmail(Email),
      SubjectError: validateSubject(Subject),
      MessageError: validateMessage(Message),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) {
      setSubmitted(false);
      return;
    }

    try {
      const response = await fetch("https://your-backend-api.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ FullName, Email, Subject, Message }),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded-lg">
      <label className="block font-semibold">
        Full Name
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </label>

      <label className="block font-semibold">
        Email Address
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </label>

      <label className="block font-semibold">
        Subject
        <input
          type="text"
          placeholder="What's this about?"
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </label>

      <label className="block font-semibold">
        Message
        <textarea
          rows="6"
          placeholder="How can we help you?"
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </label>

      <button type="submit"className="bg-purple-700 text-white px-5 py-2 rounded-lg transition duration-300 hover:bg-[rgba(74,35,218,1)]">
        Send Message
      </button>

      {Errors.FullNameError && <p className="text-red-600 text-sm">{Errors.FullNameError}</p>}
      {Errors.EmailError && <p className="text-red-600 text-sm">{Errors.EmailError}</p>}
      {Errors.SubjectError && <p className="text-red-600 text-sm">{Errors.SubjectError}</p>}
      {Errors.MessageError && <p className="text-red-600 text-sm">{Errors.MessageError}</p>}
      {Submitted && (
        <p className="text-green-600 font-semibold mt-4">
          Thank you, {FullName}! Your message was sent.
        </p>
      )}
    </form>
  );
}

export default ContactInput;