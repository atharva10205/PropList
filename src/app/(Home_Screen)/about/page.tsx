import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  return (
    <div>
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 border-b border-black pb-2">
          About Our Platform
        </h1>
        <p className="text-lg mb-4">
          Welcome to <span className="font-semibold">HomiFi</span> — your go-to property rental platform designed for ease, speed, and convenience.
        </p>
        <p className="text-lg mb-4">
          Whether you're a property owner or someone looking for the perfect rental, our SaaS solution offers a seamless experience to manage listings, communicate with tenants, and handle payments — all in one place.
        </p>
        <p className="text-lg mb-4">
          We believe in minimalism, performance, and clarity. That’s why our dashboard and booking flow are crafted with a modern black and white theme that makes everything feel crisp and professional.
        </p>
        <p className="text-lg">
          Thank you for choosing HomiFi — where renting is truly easy.
        </p>
      </main>
    </div>
     <div>
            <Footer/>
        </div>
        </div>
  );
}
