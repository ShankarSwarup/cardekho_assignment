import React from 'react';
import { Heart, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCars } from '../cars/CarContext';
import { formatCurrency } from '../cars/Overview';

export const Wishlist: React.FC = () => {
  const { user, setShowLoginModal } = useAuth();
  const {
    wishlistCars,
    handleToggleWishlist,
    setActiveTab,
    openCarDetails,
    selectedForCompare,
    handleToggleSelectCompare
  } = useCars();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
        <Heart className="h-6 w-6 text-rose-500 fill-current" />
        <span>Your Saved Wishlist</span>
      </h2>

      {!user ? (
        <div className="glass-panel p-12 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-brand-600 mx-auto" />
          <h4 className="font-bold text-slate-800">Login required to view wishlist</h4>
          <p className="text-sm text-slate-500">Save items directly to your profile database.</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-5 py-2.5 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-500 text-xs shadow-sm"
          >
            Sign In
          </button>
        </div>
      ) : wishlistCars.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Heart className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-800">Your wishlist is empty</h4>
          <p className="text-sm text-slate-500">
            Start exploring vehicles to add candidates to your saved shortlist.
          </p>
          <button
            onClick={() => setActiveTab('search')}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistCars.map((car) => (
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
                alt={car.model}
                className="h-44 w-full object-cover border-b border-slate-100"
              />
              <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
                      {car.make}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(car._id);
                      }}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-base text-slate-850">
                    {car.model}{' '}
                    <span className="text-xs font-normal text-slate-500">({car.variant})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 my-2 text-xs text-slate-550">
                  <span>⛽ {car.fuelType}</span>
                  <span>⚙️ {car.transmission}</span>
                  <span>🚗 {car.bodyType}</span>
                  <span>📈 {car.mileage} km/l</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-extrabold text-sm text-brand-600">
                    {formatCurrency(car.price)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCarDetails(car);
                      }}
                      className="px-3 py-1.5 rounded bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Reviews
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelectCompare(car);
                      }}
                      className={`px-4 py-1.5 rounded text-xs font-semibold border transition ${
                        selectedForCompare.some((c) => c._id === car._id)
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-brand-50 border-brand-200 text-brand-600 hover:bg-brand-100'
                      }`}
                    >
                      {selectedForCompare.some((c) => c._id === car._id) ? 'Selected' : 'Compare'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
