'use client'

import { useState, useEffect } from "react";
import { MessageCircle, Sparkles, Zap, Star, ArrowRight, Play } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

const heroImages = [
  {
    id: 1,
    url: 'https://replicate.delivery/xezq/M8xf6TII57zLWyj9RApZtecVu3XE6T1s78Ecpg2Np04MrpnVA/tmp6fpzc81e.jpeg',
    alt: 'AI generated artistic portrait'
  },
  {
    id: 2,
    url: 'https://replicate.delivery/xezq/ZCZozStRqxb3AJqfi6fgoN0k9GBpMWJ97QojoqhfvJerUnesC/tmpm707q6vx.jpeg',
    alt: 'AI generated creative artwork'
  },
  {
    id: 3,
    url: 'https://replicate.delivery/xezq/eR4P3fMiozh2qk1M56Y0hBIU5VIpeWKilbi5UlneKoNfbP9sC/tmpubsnfhfk.jpeg',
    alt: 'AI generated landscape scene'
  },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate stunning images in seconds",
  },
  {
    icon: MessageCircle,
    title: "Natural Language",
    description: "Describe what you want in plain English",
  },
  {
    icon: Sparkles,
    title: "AI Powered",
    description: "Advanced AI models for best results",
  },
];

const stats = [
  { value: "10K+", label: "Images Generated" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "User Rating" },
];

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToEditor = () => {
    router.push(user ? '/editor' : '/signup');
  };

  return (
    <div>
      <section className="relative w-screen min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center gap-6 px-6 lg:px-8 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
        {/* hero text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-gentle"></div>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-8 max-w-2xl text-center lg:text-left z-10 animate-fade-in">
          {/* <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 text-primary-400 text-sm font-medium animate-pulse">
            <Star size={14} />
            New: Enhanced AI Models Available
          </div> */}

          <div className="space-y-6">
            <h1 className="font-extrabold text-4xl sm:text-3xl lg:text-6xl xl:text-7xl leading-tight">
              <span className="text-gradient">Transform Ideas </span>
              <br className="hidden lg:flex"/>
              into <span className="text-white">Stunning Images</span>
            </h1>

            <p className="text-gray-300 text-lg lg:text-xl max-w-xl leading-relaxed">
              Experience the future of image creation with AI-powered generation.
              Upload your image or describe your vision, and watch magic happen in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={goToEditor}
              className="btn-primary group flex items-center justify-center gap-3"
            >
              <Sparkles size={20} className="group-hover:animate-pulse" />
              {user ? 'Start Creating' : 'Get Started Free'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/examples')}
              className="btn-secondary group flex items-center justify-center gap-3"
            >
              <Play size={18} />
              View Examples
            </button>
          </div>


        </div>

        {/* images stack */}
        <div className=" relative flex items-center justify-center mt-16 lg:mt-0 lg:ml-16 perspective-1000 animate-slide-in">
          <div className="relative flex flex-row -space-x-40 lg:-space-x-40 transform-style-preserve-3d ">
            {heroImages.map((image, index) => {
              const center = Math.floor((heroImages.length - 1) / 2);
              const offset = index - center;
              return (
                <div
                  key={image.id}
                  className="relative w-64 h-72 lg:w-84 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-y-0 hover:translate-z-20 transition-transform duration-500"
                  style={{
                    transform: `rotateY(${offset * 10}deg) translateZ(${-Math.abs(offset) * 30}px)`,
                    zIndex: index,
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 320px, 384px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                 

                 
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* <section className="py-20 px-6 lg:px-8 bg-dark-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Powerful Features for <span className="text-gradient">Creative Minds</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to bring your imagination to life with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover text-center p-8 group animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-primary-500" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}