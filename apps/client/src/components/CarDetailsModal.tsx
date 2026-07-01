import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Star, Trash2, AlertCircle, Heart, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCars } from '../contexts/CarContext';
import { formatCurrency } from './Overview';

export const CarDetailsModal: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedCar,
    closeCarDetails,
    carReviews,
    reviewsLoading,
    reviewRating,
    setReviewRating,
    reviewText,
    setReviewText,
    reviewSubmitting,
    reviewError,
    handleSubmitReview,
    handleDeleteReview,
    wishlistIds,
    handleToggleWishlist,
    selectedForCompare,
    handleToggleSelectCompare
  } = useCars();

  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Reset carousel index to 0 whenever the selected vehicle changes
  useEffect(() => {
    setCurrentImgIdx(0);
  }, [selectedCar?._id]);

  if (!selectedCar) return null;

  // Build resilient image list (handles arrays, single strings, and empty cases)
  let images: string[] = [];
  if (Array.isArray(selectedCar.images) && selectedCar.images.length > 0) {
    images = selectedCar.images;
  } else if (typeof selectedCar.images === 'string' && selectedCar.images) {
    images = [selectedCar.images];
  } else {
    images = ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'];
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isWishlisted = wishlistIds.includes(selectedCar._id);
  const isCompared = selectedForCompare.some((c) => c._id === selectedCar._id);

  const getReviewerName = (review: any) => {
    if (review.userId && typeof review.userId === 'object') {
      return review.userId.fullName || 'Anonymous';
    }
    return 'Anonymous';
  };

  const isReviewOwner = (review: any) => {
    if (!user) return false;
    const ownerId =
      review.userId && typeof review.userId === 'object'
        ? review.userId._id
        : review.userId;
    return String(ownerId) === String(user._id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-slate-205 flex flex-col p-6 space-y-6">
        
        {/* Header Title */}
        <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
              {selectedCar.make}
            </span>
            <h3 className="font-bold text-xl text-slate-900">
              {selectedCar.model}{' '}
              <span className="text-sm font-normal text-slate-500">({selectedCar.variant})</span>
            </h3>
            <p className="text-sm text-brand-600 font-semibold">{formatCurrency(selectedCar.price)}</p>
          </div>
          <button
            onClick={closeCarDetails}
            className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Multi-Image Carousel Panel */}
        <div className="relative w-full h-56 rounded-lg overflow-hidden group border border-slate-100 bg-slate-50">
          <img
            src={images[currentImgIdx]}
            alt={`${selectedCar.make} ${selectedCar.model} slide`}
            className="w-full h-full object-cover transition-all duration-300"
          />
          {images.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
              {/* Dot Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {images.map((_: string, idx: number) => (
                  <span
                    key={idx}
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      idx === currentImgIdx ? 'bg-brand-600 w-3' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 border border-slate-100">
          <div>
            <span className="text-slate-400 block mb-0.5">Fuel Type</span>
            <span className="font-semibold text-slate-800">⛽ {selectedCar.fuelType}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Transmission</span>
            <span className="font-semibold text-slate-800">⚙️ {selectedCar.transmission}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Body Type</span>
            <span className="font-semibold text-slate-800">🚗 {selectedCar.bodyType}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Mileage</span>
            <span className="font-semibold text-slate-800">📈 {selectedCar.mileage} km/l</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">NCAP Safety</span>
            <span className="font-semibold text-slate-800">⭐ {selectedCar.safetyRating} Star Safety</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Seating</span>
            <span className="font-semibold text-slate-800">👥 {selectedCar.seatingCapacity} Seats</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Engine</span>
            <span className="font-semibold text-slate-800">🔧 {selectedCar.engine}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Model Year</span>
            <span className="font-semibold text-slate-800">📅 {selectedCar.year}</span>
          </div>
        </div>

        {/* Compare & Wishlist Action Bar Inside Modal */}
        <div className="flex space-x-3 pb-2 border-b border-slate-100">
          <button
            onClick={() => handleToggleSelectCompare(selectedCar)}
            className={`flex-1 py-2 rounded-lg font-semibold text-xs border flex items-center justify-center space-x-1.5 transition ${
              isCompared
                ? 'bg-brand-50 border-brand-200 text-brand-600'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>{isCompared ? 'Selected for Compare' : 'Add to Compare'}</span>
          </button>
          <button
            onClick={() => handleToggleWishlist(selectedCar._id)}
            className={`flex-1 py-2 rounded-lg font-semibold text-xs border flex items-center justify-center space-x-1.5 transition ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>
        </div>

        {/* Reviews Section */}
        <div className="space-y-4 pt-1">
          <h4 className="font-bold text-slate-800 flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-brand-600" />
            <span>Customer Reviews</span>
            <span className="text-xs font-normal text-slate-400">({carReviews.length})</span>
          </h4>

          {reviewsLoading ? (
            <div className="text-center py-6 text-sm text-slate-500">Loading reviews...</div>
          ) : carReviews.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400 bg-slate-50 border border-slate-100 border-dashed rounded-lg">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {carReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-semibold text-slate-800">
                        {getReviewerName(review)}
                      </span>
                      <div className="flex items-center mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {isReviewOwner(review) && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-slate-400 hover:text-red-500 transition p-0.5"
                          title="Delete your review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>
          )}

          {/* Write a Review Form */}
          <form onSubmit={handleSubmitReview} className="space-y-3 border-t border-slate-100 pt-4">
            <h5 className="text-xs font-semibold text-slate-800">Write a Review</h5>
            {!user && (
              <p className="text-[10px] text-slate-500 bg-slate-50 p-2 border border-slate-100 rounded">
                💡 Sign in to submit a review for this vehicle.
              </p>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-4.5 w-4.5 ${
                        star <= reviewRating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-200 hover:text-amber-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this vehicle (min 5 characters)..."
                rows={2}
                disabled={!user}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 disabled:opacity-60"
              />
            </div>
            {reviewError && (
              <div className="text-[10px] text-red-500 bg-red-50 border border-red-100 p-2 rounded flex items-center space-x-1.5 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{reviewError}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!user || reviewSubmitting}
              className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
