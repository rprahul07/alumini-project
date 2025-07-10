import ContactHeading from "../components/ContactHeading";
import ContactInput from "../components/ContactInput";
import ContactTypes from "../components/ContactTypes";
import Navbar from "../components/Navbar";

function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-8 py-10 font-sans">
        <ContactHeading />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <ContactInput />
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <ContactTypes />
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactPage;