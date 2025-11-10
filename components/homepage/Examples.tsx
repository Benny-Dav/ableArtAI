
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

interface Generation {
  id: string;
  storage_url: string;
  created_at: string;
}

export default function ExamplesSection() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenerations = async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("id, storage_url, created_at")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching generations:", error);
      else setGenerations(data || []);

      setLoading(false);
    };

    fetchGenerations();
  }, []);

  return (
    <section className="min-h-screen mt-[8vh] bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg p-6 text-white flex flex-col gap-4">
       <div className="flex flex-col items-center justify-center gap-6">
       <h3 className="font-bold text-2xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-center">Lightning Fast Generations</h3>
       <p className="text-xl mb-6 text-center">See what <span className="text-gradient">Able</span> generates in milliseconds</p>
       </div>

      {loading ? (
        <p>Loading...</p>
      ) : generations.length === 0 ? (
        <p>No generated images yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {generations.map((gen) => (
            <div
              key={gen.id}
              className="rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
            >
              <Image
                src={gen.storage_url}
                alt="Generated image"
                width={400}
                height={400}
                className="object-cover w-full h-64"
              />
              {/* <div className="p-3 text-sm text-gray-300">
                <p className="text-xs text-gray-500">
                  {new Date(gen.created_at).toLocaleString()}
                </p>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
