import React from 'react';
import { Sparkles, ShieldCheck, Scale, Heart, Compass, Star, MessageSquare } from 'lucide-react';
import { useCars } from './CarContext';

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}

export const Overview: React.FC = () => {
  const { cars, wishlistIds, selectedForCompare, setActiveTab, openCarDetails, handleToggleSelectCompare, handleToggleWishlist } = useCars();

  const renderCarActions = (car: any) => (
    <div className="flex items-center space-x-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          openCarDetails(car);
        }}
        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
        title="View details & reviews"
      >
        <MessageSquare className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleSelectCompare(car);
        }}
        className={`p-2 rounded-lg border transition ${
          selectedForCompare.some((c) => c._id === car._id)
            ? 'bg-brand-50 border-brand-200 text-brand-600'
            : 'border-slate-200 hover:bg-slate-50 text-slate-500'
        }`}
        title="Compare Spec"
      >
        <Scale className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleWishlist(car._id);
        }}
        className={`p-2 rounded-lg border transition ${
          wishlistIds.includes(car._id)
            ? 'bg-rose-50 border-rose-200 text-rose-600'
            : 'border-slate-200 hover:bg-slate-50 text-slate-500'
        }`}
      >
        <Heart className="h-4 w-4 fill-current" />
      </button>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <div className="text-center py-16 space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>Rule-Based Recommendation Engine v1.0</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Confidently Shortlist Cars Powered by <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">Smart Matching</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Stop manually comparing spec sheets. Set budget limits, safety expectations, and usage parameters to get rule-based recommendations with clear trade-offs.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab('search')}
            className="px-6 py-3 rounded-lg font-semibold bg-brand-600 hover:bg-brand-500 text-white flex items-center space-x-2 transition shadow-md shadow-brand-500/10"
          >
            <Sparkles className="h-5 w-5" />
            <span>Get Recommendations</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className="px-6 py-3 rounded-lg font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            Browse Catalog
          </button>
        </div>
      </div>

      {/* Quick Overview Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Rule-Validated Specs</h3>
          <p className="text-sm text-slate-600">
            Recommendations use only verified spec data from the database. Scoring is transparent and rule-based.
          </p>
        </div>
        <div className="glass-panel p-6 space-y-4">
          <div className="h-10 w-10 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <Scale className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Compare & Analyze</h3>
          <p className="text-sm text-slate-600">
            Compare up to 4 vehicles side-by-side. Highlights the best prices, safety scores, and fuel mileage metrics.
          </p>
        </div>
        <div className="glass-panel p-6 space-y-4">
          <div className="h-10 w-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Personal Wishlists</h3>
          <p className="text-sm text-slate-600">
            Save candidates directly to your profile. Keeps specifications synchronized across devices.
          </p>
        </div>
      </div>

      {/* Showcase Seed Cars */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Compass className="h-6 w-6 text-brand-600" />
            <span>Featured Vehicles</span>
          </h2>
          <button
            onClick={() => setActiveTab('search')}
            className="text-brand-600 hover:text-brand-700 text-sm font-semibold flex items-center"
          >
            <span>View All</span>
            <Compass className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.slice(0, 4).map((car) => (
            <div
              key={car._id}
              onClick={() => openCarDetails(car)}
              className="glass-card overflow-hidden hover-scale flex flex-col justify-between cursor-pointer"
            >
              <img
                src={
                  car.images?.[0] ||
                  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
                }
                alt={`${car.make} ${car.model}`}
                className="h-44 w-full object-cover border-b border-slate-100"
              />
              <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
                      {car.make}
                    </span>
                    <span className="flex items-center text-xs text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-medium">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {car.safetyRating} Star
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-800">
                    {car.model}{' '}
                    <span className="text-xs font-normal text-slate-500">({car.variant})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 my-2 text-xs text-slate-500">
                  <span>⛽ {car.fuelType}</span>
                  <span>⚙️ {car.transmission}</span>
                  <span>🚗 {car.bodyType}</span>
                  <span>📈 {car.mileage} km/l</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-extrabold text-sm text-brand-600">
                    {formatCurrency(car.price)}
                  </span>
                  {renderCarActions(car)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
