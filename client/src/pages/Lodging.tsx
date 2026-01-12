import { Link } from "react-router-dom";

export default function Lodging() {
  const features = [
    {
      title: "The Main Lodge",
      desc: "A 4,000 sq. ft. timber-frame retreat featuring a massive stone fireplace, panoramic views of the valley, and custom-built oak furniture.",
      image: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Private Suites",
      desc: "Each hunter enjoys a private or semi-private room with premium linens, en-suite bathrooms, and dedicated gear storage areas.",
      image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Field-to-Table Dining",
      desc: "Our on-site chef prepares three hearty meals daily, featuring local game, garden-fresh vegetables, and campfire desserts.",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-[#1a1c18] min-h-screen text-white">
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          alt="Mountain Lodge"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            Base <span className="text-amber-600">Camp</span>
          </h1>
          <p className="text-amber-100/70 font-serif italic text-xl">Rugged comfort for the modern hunter.</p>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="space-y-32">
          {features.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
            >
              {/* Image with Border */}
              <div className="w-full md:w-1/2">
                <div className="relative p-2 border-2 border-amber-900/30">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-4xl font-bold uppercase tracking-tight text-amber-500">{item.title}</h2>
                <div className="h-1 w-12 bg-amber-900"></div>
                <p className="text-gray-400 text-lg leading-relaxed font-serif">
                  {item.desc}
                </p>
                <div className="pt-4">
                   <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Standard Amenity // 0{idx + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-amber-600 py-16 text-black text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Ready to reserve your stay?</h2>
        <Link to="/booking" className="inline-block bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-zinc-900 transition-all">
          Check Availability
        </Link>
      </section>
    </div>
  );
}