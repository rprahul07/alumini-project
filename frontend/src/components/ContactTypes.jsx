import { Link } from "react-router-dom";
function ContactTypes() {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-purple-700">Get in Touch</h3>

      <div className="border-b pb-4">
        <p className="font-semibold">Email Support</p>
        <p className="text-gray-600">support@example.com</p>
        <div className="bg-green-600 w-fit mt-2 px-3 py-1 rounded-xl">
          <p className="text-white text-sm">24/7 Support</p>
        </div>
      </div>

      <div className="border-b pb-4">
        <p className="font-semibold">Phone Support</p>
        <p className="text-gray-600">+1 555 123-4567</p>
        <div className="bg-green-600 w-fit mt-2 px-3 py-1 rounded-xl">
          <p className="text-white text-sm">Mon–Fri 9am–5pm</p>
        </div>
      </div>

      <div className="border-b pb-4">
        <p className="font-semibold">Office Location</p>
        <p className="text-gray-600">123 Business Avenue, Suite 456</p>
        <p className="text-gray-600">San Francisco, CA 94107</p>
        <div className="bg-green-600 w-fit mt-2 px-3 py-1 rounded-xl">
          <p className="text-white text-sm">Walk-ins Welcome</p>
        </div>
      </div>

<div>
  <p className="font-semibold">Frequently Asked Questions</p>
  <p className="text-gray-600 mb-1">Check our FAQ section for quick answers</p>
  <Link to="/FaqPage" className="text-purple-700 font-semibold hover:underline">
    View FAQ →
  </Link>
</div>
    </div>
  );
}

export default ContactTypes;