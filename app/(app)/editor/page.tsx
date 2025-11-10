'use client'

import InputBox from "@/components/editor/InputBox"
import OutputBox from "@/components/editor/OutputBox"
import { useState } from "react"

export default function Editor() {
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);


    return (
        <section className="h-[100vh] flex flex-col w-screen pt-[12vh] pb-8 lg:pt-[15vh] lg:py-6 px-8">

            <div className="flex flex-col gap-2 mb-8">
                <h3 className="font-semibold text-2xl text-gray-100">Image Edit</h3>
                <p className="text-gray-300 text-lg">Transform existing images with a single prompt</p>
            </div>

            <main className="w-full lg:h-full flex flex-col items-center lg:flex-row lg:items-start gap-8">
            <InputBox setGeneratedImage={setGeneratedImage} />
            <OutputBox generatedImage={generatedImage} />
            </main>
        </section>
    )
}