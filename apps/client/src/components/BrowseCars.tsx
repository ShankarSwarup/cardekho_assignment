import React, { FormEvent } from 'react';
import { Search, Sparkles, Sliders, Activity, AlertCircle, Heart, Scale, Star, ArrowRight, HelpCircle, MessageSquare } from 'lucide-react';
import { useCars } from '../contexts/CarContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from './Overview';

export const BrowseCars: React.FC = () => {
  const { user } = useAuth();
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
    fetchCars,

    // Filters State
    filterBrand,
    setFilterBrand,
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
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    priceError,
    brands,
    fuelTypes,
    transmissions,

    // Smart Advisor State
    searchMode,
    setSearchMode,
    wizardBudget,
    setWizardBudget,
    wizardFamilySize,
    setWizardFamilySize,
    wizardFuel,
    setWizardFuel,
    wizardTransmission,
    setWizardTransmission,
    wizardDailyDistance,
    setWizardDailyDistance,
    wizardPriority,
    setWizardPriority,
    wizardBrandPref,
    setWizardBrandPref,
    smartRecommendations,
    setSmartRecommendations,
    advisorExplanation,
    setAdvisorExplanation,
    advisorLoading,
    consultationHistory,
    handleGenerateRecommendations,

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
      
      {/* Sidebar Section */}
      <div className="glass-panel p-6 space-y-6 h-fit max-h-[84vh] overflow-y-auto lg:sticky lg:top-24">
        
        {/* Search Mode Toggler inside sidebar for clean layout */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setSearchMode('catalog')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
              searchMode === 'catalog'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setSearchMode('advisor')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition flex items-center justify-center space-x-1 ${
              searchMode === 'advisor'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Smart Advisor</span>
          </button>
        </div>

        {searchMode === 'catalog' ? (
          /* CATALOG FILTER SIDEBAR */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
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

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Brand</label>
              <select
                value={filterBrand}
                onChange={(e) => {
                  setFilterBrand(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Preference */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Fuel Type</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setFilterFuel('Any');
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    filterFuel === 'Any'
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Any
                </button>
                {fuelTypes.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilterFuel(f);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      filterFuel === f
                        ? 'bg-brand-50 border-brand-200 text-brand-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission Preference */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Transmission</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => {
                    setFilterTransmission('Any');
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-semibold border transition ${
                    filterTransmission === 'Any'
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Any
                </button>
                {transmissions.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setFilterTransmission(t);
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-semibold border transition ${
                      filterTransmission === t
                        ? 'bg-brand-50 border-brand-200 text-brand-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Engine Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Engine Performance</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { value: 'Any', label: 'Any' },
                  { value: 'Eco', label: 'Eco (<1.2L)' },
                  { value: 'Medium', label: 'Standard (1.2L-1.6L)' },
                  { value: 'High', label: 'Sports (>1.6L)' }
                ].map((perf) => (
                  <button
                    key={perf.value}
                    onClick={() => {
                      setFilterPerformance(perf.value);
                    }}
                    className={`px-1.5 py-1.5 rounded-lg text-[10px] font-semibold border transition text-center ${
                      filterPerformance === perf.value
                        ? 'bg-brand-50 border-brand-200 text-brand-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {perf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Limits */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Price Bounds (INR)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={filterMinPrice}
                  onChange={(e) => {
                    setFilterMinPrice(e.target.value);
                  }}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                />
                <span className="text-slate-450">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={filterMaxPrice}
                  onChange={(e) => {
                    setFilterMaxPrice(e.target.value);
                  }}
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none"
              >
                <option value="price">Price</option>
                <option value="safetyRating">Safety Rating</option>
                <option value="mileage">Mileage</option>
              </select>
              <div className="flex space-x-1.5 mt-1.5">
                <button
                  onClick={() => {
                    setSortOrder('asc');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    sortOrder === 'asc'
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-650'
                  }`}
                >
                  Low to High
                </button>
                <button
                  onClick={() => {
                    setSortOrder('desc');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    sortOrder === 'desc'
                      ? 'bg-brand-50 border-brand-200 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-650'
                  }`}
                >
                  High to Low
                </button>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-sm mt-4"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        ) : (
          /* SMART ADVISOR WIZARD SIDEBAR */
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Sparkles className="h-5 w-5 text-brand-600" />
              <span>Preference Wizard</span>
            </h3>

            <form onSubmit={handleGenerateRecommendations} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Budget Limit: {formatCurrency(wizardBudget)}
                </label>
                <input
                  type="range"
                  min={500000}
                  max={5000000}
                  step={100000}
                  value={wizardBudget}
                  onChange={(e) => setWizardBudget(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[9px] text-slate-450">
                  <span>₹5L</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Passengers: {wizardFamilySize} Seats
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={wizardFamilySize}
                  onChange={(e) => setWizardFamilySize(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[9px] text-slate-450">
                  <span>1 (Solo)</span>
                  <span>8 (Large)</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Daily Commute: {wizardDailyDistance} km
                </label>
                <input
                  type="range"
                  min={5}
                  max={150}
                  value={wizardDailyDistance}
                  onChange={(e) => setWizardDailyDistance(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[9px] text-slate-450">
                  <span>5 km</span>
                  <span>150 km</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Fuel Preference</label>
                <select
                  value={wizardFuel}
                  onChange={(e) => setWizardFuel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                >
                  <option value="Any">Any Fuel</option>
                  {fuelTypes.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Transmission</label>
                <select
                  value={wizardTransmission}
                  onChange={(e) => setWizardTransmission(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                >
                  <option value="Any">Any</option>
                  {transmissions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Evaluation Priority</label>
                <select
                  value={wizardPriority}
                  onChange={(e) => setWizardPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                >
                  <option value="Safety">Safety & Build (NCAP Stars)</option>
                  <option value="Budget">Affordability (Best Value)</option>
                  <option value="Mileage">Fuel Economy (Maximum km/l)</option>
                  <option value="Performance">Engine Performance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Brand Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Tata, Honda"
                  value={wizardBrandPref}
                  onChange={(e) => setWizardBrandPref(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-bold bg-brand-600 hover:bg-brand-500 text-white transition flex items-center justify-center space-x-1 shadow-sm text-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get Shortlist</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Browse Cars List Section */}
      <div className="lg:col-span-3 flex flex-col">
        
        {/* Sticky Search Header */}
        {searchMode === 'catalog' ?
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
              className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition flex items-center space-x-2"
            >
              <span>Find</span>
            </button>
          </form>
        </div> : <></>}

        {searchMode === 'catalog' ? (
          /* CATALOG VIEW WITH STICKY PAGINATION AT BOTTOM */
          <div className="flex flex-col h-[calc(100vh-200px)] mt-4">
            
            {/* Scrollable Cards Grid */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-4">
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
              )}
            </div>

            {/* Sticky Pagination Controls - Next Section, Fixed at Bottom */}
            {cars.length > 0 && (
              <div className="flex items-center justify-between py-3 border-t border-slate-200 bg-slate-50/95 backdrop-blur-sm z-20 mt-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-600 transition shadow-sm animate-none"
                >
                  Previous Page
                </button>
                <span className="text-xs font-bold text-slate-650 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!hasNextPage}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-600 transition shadow-sm animate-none"
                >
                  Next Page
                </button>
              </div>
            )}
          </div>
        ) : (
          /* SMART ADVISOR VIEWPORT (Fixed Height & Scrollable) */
          <div className="h-[calc(100vh-135px)] overflow-y-auto pr-1 mt-4 space-y-4">
            <div className="space-y-6 pb-6">
              {advisorLoading ? (
                <div className="glass-panel p-12 text-center space-y-4">
                  <div className="h-10 w-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h4 className="font-bold text-slate-800">Generating Recommendations...</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Scoring vehicles across the database using budget, safety, mileage, and priority rules.
                  </p>
                </div>
              ) : smartRecommendations.length === 0 ? (
                <div className="glass-panel p-12 text-center space-y-4">
                  <HelpCircle className="h-12 w-12 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-lg">No session active</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Adjust the preference toggles on the sidebar and click "Get Shortlist" to generate your custom shortlist.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Expert Executive Summary */}
                  <div className="glass-panel p-6 border-l-4 border-brand-500 space-y-2 bg-brand-50/20">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="h-4 w-4" />
                      <span>Recommendation Summary</span>
                    </span>
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "{advisorExplanation}"
                    </p>
                  </div>

                  {/* Recommendation Cards */}
                  <div className="space-y-4">
                    {smartRecommendations.map((rec, index) => (
                      <div
                        key={rec.carId}
                        onClick={() => openCarDetails(rec.carDetails)}
                        className="glass-panel p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center cursor-pointer hover:shadow-md hover:border-brand-500/20 transition-all"
                      >
                        <div className="md:col-span-1 space-y-2">
                          <img
                            src={rec.carDetails?.images?.[0]}
                            alt="car"
                            className="h-24 w-full object-cover rounded-lg border border-slate-100"
                          />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                              Match Score: {rec.score}%
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-3 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-base">
                                #{index + 1} {rec.carDetails?.make} {rec.carDetails?.model}
                                <span className="text-xs font-normal text-slate-500 ml-1">
                                  ({rec.carDetails?.variant})
                                </span>
                              </h4>
                              <p className="text-xs text-slate-500">
                                ₹{rec.carDetails?.price.toLocaleString('en-IN')} |{' '}
                                {rec.carDetails?.fuelType} | {rec.carDetails?.transmission}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSelectCompare(rec.carDetails);
                                }}
                                className={`p-2 rounded-lg border transition ${
                                  selectedForCompare.some((c) => c._id === rec.carId)
                                    ? 'bg-brand-50 border-brand-200 text-brand-600'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                                }`}
                              >
                                <Scale className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWishlist(rec.carId);
                                }}
                                className={`p-2 rounded-lg border transition ${
                                  wishlistIds.includes(rec.carId)
                                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                                }`}
                              >
                                <Heart className="h-4 w-4 fill-current" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-bold text-brand-600 block mb-0.5">
                                Why it fits:
                              </span>
                              <p className="text-slate-600 leading-relaxed">{rec.reason}</p>
                            </div>
                            <div>
                              <span className="font-bold text-amber-600 block mb-0.5">
                                Known Trade-off:
                              </span>
                              <p className="text-slate-500 leading-relaxed">{rec.tradeOff}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Historical Query Sessions */}
                  {user && consultationHistory.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="font-bold text-slate-800 text-sm">
                        Your Shortlist Query History
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {consultationHistory.slice(0, 4).map((hist) => (
                          <div key={hist._id} className="glass-panel p-4 text-xs space-y-2 bg-slate-50/50">
                            <div className="flex justify-between text-slate-400">
                              <span>📅 {new Date(hist.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                              <span>Budget: ₹{hist.preferences?.budget?.toLocaleString()}</span>
                            </div>
                            <p className="text-slate-600 line-clamp-2">
                              "{hist.advisorExplanation}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
