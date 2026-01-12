import { Link } from "react-router-dom";

export default function HuntPackages() {
  const packages = [
    {
      title: "Trophy Whitetail",
      price: "$2,500",
      duration: "3-Day Hunt",
      image: "https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=800&auto=format&fit=crop",
      features: ["Private Land Access", "Luxury Lodge", "Field Dressing"]
    },
    {
      title: "Mountain Elk",
      price: "$4,500",
      duration: "5-Day Hunt",
      image: "/images/download-1.jpg",
      features: ["Backcountry Camp", "Expert Guides", "Pack-out Service"],
      popular: true
    },
    {
      title: "Waterfowl Dawn",
      price: "$1,200",
      duration: "2-Day Hunt",
      image: "/images/download-2.jpg",
      features: ["Blind Setup", "Decoy Spread", "Retriever Service"]
    }
  ];

  return (
    <div className="bg-[#1a1c18] min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Hunt <span className="text-amber-600">Packages</span>
          </h1>
          <div className="h-1 w-24 bg-amber-600 mx-auto"></div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div 
              key={idx} 
              className="group bg-[#242622] border border-white/10 overflow-hidden transition-all duration-500 hover:border-amber-600/50 shadow-2xl"
            >
              {/* Image Container: Greyscale by default, color on group hover */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                {pkg.popular && (
                  <div className="absolute top-4 left-4 bg-amber-600 text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-1">{pkg.title}</h3>
                <p className="text-amber-600 font-mono text-sm mb-6">{pkg.duration}</p>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-center">
                      <span className="text-amber-600 mr-2 text-lg"></span> {feat}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <span className="text-3xl font-black text-white">{pkg.price}</span>
                  <Link 
                    to="/booking" 
                    className="bg-white text-black px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-colors"
                  >
                    Click to book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}