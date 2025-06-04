import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ServicesPage() {
  return (
    <div>
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 border-b border-black pb-2">
          Our Services
        </h1>
        <ul className="space-y-4 text-lg">
          <li>• Property Listing Management</li>
          <li>• Advanced Search & Filters for Renters</li>
          <li>• Secure Booking & Payment System</li>
          <li>• Real-time Messaging Between Owners & Renters</li>
          <li>• Analytics Dashboard for Property Owners</li>
          <li>• Mobile-Optimized Experience</li>
        </ul>
      </main>
    </div>
     <div>
            <Footer/>
        </div>
        </div>
  );
}
5