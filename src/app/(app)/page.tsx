"use client";

import HomeGrid from "../../component/HomeGrid"; 
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  /**
   * handleAction
   * This satisfies the TypeScript requirement for the HomeGrid.
   * On your main landing page, we usually want to redirect users 
   * to the full discovery archive when they click a profile.
   */
  function handleAction(id: string): void {
    console.log(`Navigating to profile or checkout for: ${id}`);
    // Redirect to the discovery page where the full payment logic lives
    router.push("/discovery"); 
  }

  return (
    <main className="pt-4 pb-20 bg-black min-h-screen">
      {/* If girls={[]} is empty, the HomeGrid will show your "Signal Lost" message.
          If you want to show featured girls here, you would fetch them 
          from Supabase just like you did in your other HomePage.
      */}
      <HomeGrid girls={[]} />
      
      {/* Optional: Add a button to go to discovery if the grid is empty */}
      <div className="flex justify-center mt-10">
         <button 
           onClick={() => router.push('/discovery')}
           className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 border border-red-600/20 px-6 py-3 rounded-full hover:bg-red-600 hover:text-white transition-all"
         >
           Enter Archives
         </button>
      </div>
    </main>
  );
}