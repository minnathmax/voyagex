import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Globe, Shield, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">VoyageX</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We are revolutionizing the way you travel. VoyageX is your ultimate AI-powered travel companion, 
            designed to make discovering, planning, and booking your dream destinations seamless and unforgettable.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-800/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-blue-600" /> Our Mission
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To empower global explorers by providing intelligent, personalized, and effortless travel solutions. 
                We believe that everyone deserves to experience the beauty of the world without the stress of complex planning.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-800/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Plane className="h-6 w-6 text-purple-600" /> Our Vision
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To become the world's most trusted and innovative travel platform, seamlessly blending cutting-edge artificial intelligence 
                with human curiosity to unlock extraordinary journeys for every traveler.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-10">Why Choose VoyageX?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-800/50 hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-full mb-4">
                  <Plane className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-slate-100">Seamless Booking</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Book flights, hotels, and experiences all in one unified platform.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-800/50 hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center rounded-full mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-slate-100">AI Recommendations</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Smart itineraries tailored specifically to your preferences and budget.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-800/50 hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center rounded-full mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-slate-100">Secure Payments</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Enterprise-grade security ensuring your transactions are always safe.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-800/50 hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center rounded-full mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 dark:text-slate-100">24/7 Support</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Our global support team is available around the clock to assist you.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
