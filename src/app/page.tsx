"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();

  useEffect(() => {
  router.push("/home")
  }, [])

  
  return (
   <div className="min-h-screen bg-black">

   </div>
  );
}
