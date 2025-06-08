import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ContactPage() {
  return (
    <div>
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 border-b border-black pb-2">
          Contact Us
        </h1>
        <p className="text-lg mb-4">
          Have questions, feedback, or need support? We will love to hear from you.
        </p>
        <p className="text-lg mb-4">📧 Email: support@HomiFi.com</p>
        <p className="text-lg mb-4">📞 Phone: +91-98765-43210</p>
        <p className="text-lg">🏢 Address: 101, SaaS Towers, Mumbai, India</p>
      </main>
    </div>
     <div>
            <Footer/>
        </div>
        </div>
  );
}
