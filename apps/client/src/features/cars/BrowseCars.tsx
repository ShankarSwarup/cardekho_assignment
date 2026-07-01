import React, { FormEvent } from 'react';
import { Search, Sliders, AlertCircle, Heart, Scale, Star, MessageSquare } from 'lucide-react';
import { useCars } from '../cars/CarContext';
import { formatCurrency } from './Overview';

export const BrowseCars: React.FC = () => {
  const {
    // Catalog State
    cars,
    totalCars,
    currentPage,
    setCurrentPage,
    hasNextPage,
    loadingCars,
    searchKeyword,
    setSearchKeyword,

    // Filters State
    filterBrand,
    setFilterBrand,
    filterModel,
    setFilterModel,
    filterFuel,
    setFilterFuel,
    filterTransmission,
    setFilterTransmission,
    filterMinPrice,
    setFilterMinPrice,
    filterMaxPrice,
    setFilterMaxPrice,
    filterPerformance,
    setFilterPerformance,
    filterSafetyRating,
    setFilterSafetyRating,
    filterSeatingCapacity,
    setFilterSeatingCapacity,
    filterMinYear,
    setFilterMinYear,
    filterMaxYear,
    setFilterMaxYear,
    filterMinMileage,
    setFilterMinMileage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    priceError,
    brands,
    brandModels,
    fuelTypes,
    transmissions,
    seatingCapacities,
    safetyRatings,
    years,

    // Actions
    selectedForCompare,
    wishlistIds,
    handleToggleWishlist,
    handleToggleSelectCompare,
    openCarDetails,
    applyFilters,
    resetFilters
  } = useCars();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleResetFilters = () => {
    resetFilters();
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Section - Sticky with flex layout */}
      <div className="glass-panel p-5 lg:sticky lg:top-24 h-[calc(100vh-8.5rem)] flex flex-col justify-between overflow-hidden shadow-sm">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0 bg-white z-10">
          <h3 className="font-bold text-slate-800 flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-brand-600" />
            <span>Filters</span>
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-brand-600 transition"
          >
            Reset
          </button>
        </div>

        {/* Scrollable filters list */}
        <div className="flex-grow overflow-y-auto py-4 space-y-5 custom-scrollbar pr-1.5">
          {/* Brand Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Brand</label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Model Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Model</label>
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              disabled={!filterBrand}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{filterBrand ? 'All Models' : 'Select Brand First'}</option>
              {filterBrand && brandModels[filterBrand] && brandModels[filterBrand].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Fuel Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setFilterFuel('Any')}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  filterFuel === 'Any'
                    ? 'bg-brand-50 border-brand-200 text-brand-600'
                    : 'border-slate-200 bg-white text-slate-660 hover:bg-slate-50'
                }`}
              >
                Any
              </button>
              {fuelTypes.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterFuel(f)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    filterFuel === f
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-660 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Transmission</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setFilterTransmission('Any')}
                className={`py-1.5 rounded-lg text-[10px] font-semibold border transition ${
                  filterTransmission === 'Any'
                    ? 'bg-brand-50 border-brand-200 text-brand-600'
                    : 'border-slate-200 bg-white text-slate-660 hover:bg-slate-50'
                }`}
              >
                Any
              </button>
              {transmissions.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTransmission(t)}
                  className={`py-1.5 rounded-lg text-[10px] font-semibold border transition ${
                    filterTransmission === t
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-660 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Rating Star Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Min Safety Rating (NCAP)</label>
            <div className="flex gap-1">
              {[0, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setFilterSafetyRating(stars)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    filterSafetyRating === stars
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-660 hover:bg-slate-50'
                  }`}
                >
                  {stars === 0 ? 'Any' : `${stars}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Seating Capacity Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Seating Capacity</label>
            <div className="flex gap-1.5">
              {[0, 5, 7].map((seats) => (
                <button
                  key={seats}
                  onClick={() => setFilterSeatingCapacity(seats)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    filterSeatingCapacity === seats
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-660 hover:bg-slate-50'
                  }`}
                >
                  {seats === 0 ? 'Any' : `${seats} Seats`}
                </button>
              ))}
            </div>
          </div>

          {/* Model Year Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Model Year Range</label>
            <div className="flex items-center space-x-2">
              <select
                value={filterMinYear}
                onChange={(e) => setFilterMinYear(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="">Min</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="text-slate-450">-</span>
              <select
                value={filterMaxYear}
                onChange={(e) => setFilterMaxYear(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="">Max</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Minimum Mileage Slider */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex justify-between">
              <span>Min Mileage:</span>
              <span className="text-brand-600 font-bold">
                {filterMinMileage ? `${filterMinMileage} km/l` : 'Any'}
              </span>
            </label>
            <input
              type="range"
              min={10}
              max={25}
              step={1}
              value={filterMinMileage || '10'}
              onChange={(e) => setFilterMinMileage(e.target.value === '10' ? '' : e.target.value)}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Any (10 km/l)</span>
              <span>25 km/l</span>
            </div>
          </div>

          {/* Performance Engine Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Engine Performance</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { value: 'Any', label: 'Any' },
                { value: 'Eco', label: 'Eco (<1.2L)' },
                { value: 'Medium', label: 'Standard (1.2-1.6L)' },
                { value: 'High', label: 'Sports (>1.6L)' }
              ].map((perf) => (
                <button
                  key={perf.value}
                  onClick={() => setFilterPerformance(perf.value)}
                  className={`px-1.5 py-1.5 rounded-lg text-[10px] font-semibold border transition text-center ${
                    filterPerformance === perf.value
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-660'
                  }`}
                >
                  {perf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Limits */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Price Bounds (INR)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={filterMinPrice}
                onChange={(e) => setFilterMinPrice(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
              <span className="text-slate-450">-</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            {priceError && (
              <div className="text-[10px] text-red-500 font-semibold mt-1">
                ⚠️ {priceError}
              </div>
            )}
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
            >
              <option value="price">Price</option>
              <option value="safetyRating">Safety Rating</option>
              <option value="mileage">Mileage</option>
            </select>
            <div className="flex space-x-1.5 mt-1.5">
              <button
                onClick={() => setSortOrder('asc')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  sortOrder === 'asc'
                    ? 'bg-brand-50 border-brand-200 text-brand-600'
                    : 'border-slate-200 bg-white text-slate-660'
                }`}
              >
                Low to High
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  sortOrder === 'desc'
                    ? 'bg-brand-50 border-brand-200 text-brand-600'
                    : 'border-slate-200 bg-white text-slate-660'
                }`}
              >
                High to Low
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Apply Button */}
        <div className="pt-3 border-t border-slate-100 shrink-0 bg-white z-10">
          <button
            onClick={applyFilters}
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Main Browse Cars List Section */}
      <div className="lg:col-span-3 flex flex-col">
        
        {/* Sticky Search Header */}
        <div className="sticky top-16 bg-slate-50/95 backdrop-blur-sm z-30 pb-4 pt-1 border-b border-slate-200">
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by keywords (e.g. Swift, Nexon, Sedan)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition flex items-center space-x-2 shadow-sm"
            >
              <span>Find</span>
            </button>
          </form>
        </div>

        {/* CATALOG VIEW WITH STICKY PAGINATION AT BOTTOM */}
        <div className="flex flex-col h-[calc(100vh-200px)] mt-4 justify-between">
          
          {/* Scrollable Cards Grid */}
          <div className="overflow-y-auto pr-1 space-y-4 flex-grow custom-scrollbar">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
              <span>
                Displaying <b>{cars.length}</b> of <b>{totalCars}</b> vehicles matches
              </span>
            </div>

            {loadingCars ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card animate-pulse h-80 w-full" />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="glass-panel p-12 text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-brand-600 mx-auto" />
                <h4 className="font-bold text-slate-800">No vehicles found</h4>
                <p className="text-sm text-slate-500">
                  Try modifying your filter parameters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                {cars.map((car) => (
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
                          <span className="flex items-center text-xs text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-medium">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-0.5" />
                            {car.safetyRating} Star
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-800">
                          {car.model}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            ({car.variant})
                          </span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 my-2 text-xs text-slate-555">
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
            )}
          </div>

          {/* Sticky Pagination Controls - Next Section, Fixed at Bottom */}
          {cars.length > 0 && (
            <div className="flex items-center justify-between py-3 border-t border-slate-200 bg-slate-50/95 backdrop-blur-sm z-20 mt-2 shrink-0">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-600 transition shadow-sm"
              >
                Previous Page
              </button>
              <span className="text-xs font-bold text-slate-650 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                Page {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!hasNextPage}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-600 transition shadow-sm"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
