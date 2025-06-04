import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div>
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 border-b border-black pb-2">
          Privacy Policy
        </h1>
        <p className="text-lg mb-4">
          At HomiFi, we prioritize your privacy and data protection.
        </p>
        <p className="text-lg mb-4">
          We collect only the necessary information to provide and improve our services, including names, email addresses, and rental preferences.
        </p>
        <p className="text-lg mb-4">
          Your information is stored securely and is never sold or shared with third parties without your consent.
        </p>
        <p className="text-lg">
          If you have any concerns or questions about your data, please contact us at <span className="underline">privacy@HomiFi.com</span>.
        </p>
      </main>
    </div>

    <div>
        <Footer/>
    </div>
    </div>
    
  );
}
