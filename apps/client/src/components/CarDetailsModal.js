import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, MessageSquare, Star, Trash2, AlertCircle, Heart, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCars } from '../contexts/CarContext';
import { formatCurrency } from './Overview';
export const CarDetailsModal = () => {
    const { user } = useAuth();
    const { selectedCar, closeCarDetails, carReviews, reviewsLoading, reviewRating, setReviewRating, reviewText, setReviewText, reviewSubmitting, reviewError, handleSubmitReview, handleDeleteReview, wishlistIds, handleToggleWishlist, selectedForCompare, handleToggleSelectCompare } = useCars();
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    // Reset carousel index to 0 whenever the selected vehicle changes
    useEffect(() => {
        setCurrentImgIdx(0);
    }, [selectedCar?._id]);
    if (!selectedCar)
        return null;
    // Build resilient image list (handles arrays, single strings, and empty cases)
    let images = [];
    if (Array.isArray(selectedCar.images) && selectedCar.images.length > 0) {
        images = selectedCar.images;
    }
    else if (typeof selectedCar.images === 'string' && selectedCar.images) {
        images = [selectedCar.images];
    }
    else {
        images = ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'];
    }
    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    const isWishlisted = wishlistIds.includes(selectedCar._id);
    const isCompared = selectedForCompare.some((c) => c._id === selectedCar._id);
    const getReviewerName = (review) => {
        if (review.userId && typeof review.userId === 'object') {
            return review.userId.fullName || 'Anonymous';
        }
        return 'Anonymous';
    };
    const isReviewOwner = (review) => {
        if (!user)
            return false;
        const ownerId = review.userId && typeof review.userId === 'object'
            ? review.userId._id
            : review.userId;
        return String(ownerId) === String(user._id);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-slate-205 flex flex-col p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-start gap-4 border-b border-slate-100 pb-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-bold text-brand-600 uppercase tracking-wide", children: selectedCar.make }), _jsxs("h3", { className: "font-bold text-xl text-slate-900", children: [selectedCar.model, ' ', _jsxs("span", { className: "text-sm font-normal text-slate-500", children: ["(", selectedCar.variant, ")"] })] }), _jsx("p", { className: "text-sm text-brand-600 font-semibold", children: formatCurrency(selectedCar.price) })] }), _jsx("button", { onClick: closeCarDetails, className: "text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg transition", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "relative w-full h-56 rounded-lg overflow-hidden group border border-slate-100 bg-slate-50", children: [_jsx("img", { src: images[currentImgIdx], alt: `${selectedCar.make} ${selectedCar.model} slide`, className: "w-full h-full object-cover transition-all duration-300" }), images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: handlePrevImage, className: "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition opacity-0 group-hover:opacity-100", children: _jsx(ChevronLeft, { className: "h-4.5 w-4.5" }) }), _jsx("button", { onClick: handleNextImage, className: "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition opacity-0 group-hover:opacity-100", children: _jsx(ChevronRight, { className: "h-4.5 w-4.5" }) }), _jsx("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1", children: images.map((_, idx) => (_jsx("span", { className: `h-1.5 w-1.5 rounded-full transition ${idx === currentImgIdx ? 'bg-brand-600 w-3' : 'bg-slate-300'}` }, idx))) })] }))] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 border border-slate-100", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "Fuel Type" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\u26FD ", selectedCar.fuelType] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "Transmission" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\u2699\uFE0F ", selectedCar.transmission] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "Body Type" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\uD83D\uDE97 ", selectedCar.bodyType] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "Mileage" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\uD83D\uDCC8 ", selectedCar.mileage, " km/l"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "NCAP Safety" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\u2B50 ", selectedCar.safetyRating, " Star Safety"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "Seating" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\uD83D\uDC65 ", selectedCar.seatingCapacity, " Seats"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "Engine" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\uD83D\uDD27 ", selectedCar.engine] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-0.5", children: "Model Year" }), _jsxs("span", { className: "font-semibold text-slate-800", children: ["\uD83D\uDCC5 ", selectedCar.year] })] })] }), _jsxs("div", { className: "flex space-x-3 pb-2 border-b border-slate-100", children: [_jsxs("button", { onClick: () => handleToggleSelectCompare(selectedCar), className: `flex-1 py-2 rounded-lg font-semibold text-xs border flex items-center justify-center space-x-1.5 transition ${isCompared
                                ? 'bg-brand-50 border-brand-200 text-brand-600'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`, children: [_jsx(Scale, { className: "h-4 w-4" }), _jsx("span", { children: isCompared ? 'Selected for Compare' : 'Add to Compare' })] }), _jsxs("button", { onClick: () => handleToggleWishlist(selectedCar._id), className: `flex-1 py-2 rounded-lg font-semibold text-xs border flex items-center justify-center space-x-1.5 transition ${isWishlisted
                                ? 'bg-rose-50 border-rose-200 text-rose-600'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`, children: [_jsx(Heart, { className: `h-4 w-4 ${isWishlisted ? 'fill-current' : ''}` }), _jsx("span", { children: isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist' })] })] }), _jsxs("div", { className: "space-y-4 pt-1", children: [_jsxs("h4", { className: "font-bold text-slate-800 flex items-center space-x-2", children: [_jsx(MessageSquare, { className: "h-4 w-4 text-brand-600" }), _jsx("span", { children: "Customer Reviews" }), _jsxs("span", { className: "text-xs font-normal text-slate-400", children: ["(", carReviews.length, ")"] })] }), reviewsLoading ? (_jsx("div", { className: "text-center py-6 text-sm text-slate-500", children: "Loading reviews..." })) : carReviews.length === 0 ? (_jsx("div", { className: "text-center py-6 text-sm text-slate-400 bg-slate-50 border border-slate-100 border-dashed rounded-lg", children: "No reviews yet. Be the first to share your experience." })) : (_jsx("div", { className: "space-y-3 max-h-48 overflow-y-auto pr-1", children: carReviews.map((review) => (_jsxs("div", { className: "bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-1.5", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm font-semibold text-slate-800", children: getReviewerName(review) }), _jsx("div", { className: "flex items-center mt-0.5", children: [1, 2, 3, 4, 5].map((star) => (_jsx(Star, { className: `h-3 w-3 ${star <= review.rating
                                                                ? 'text-amber-500 fill-amber-500'
                                                                : 'text-slate-200'}` }, star))) })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-[10px] text-slate-400", children: new Date(review.createdAt).toLocaleDateString() }), isReviewOwner(review) && (_jsx("button", { onClick: () => handleDeleteReview(review._id), className: "text-slate-400 hover:text-red-500 transition p-0.5", title: "Delete your review", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) }))] })] }), _jsx("p", { className: "text-xs text-slate-650 leading-relaxed", children: review.review })] }, review._id))) })), _jsxs("form", { onSubmit: handleSubmitReview, className: "space-y-3 border-t border-slate-100 pt-4", children: [_jsx("h5", { className: "text-xs font-semibold text-slate-800", children: "Write a Review" }), !user && (_jsx("p", { className: "text-[10px] text-slate-500 bg-slate-50 p-2 border border-slate-100 rounded", children: "\uD83D\uDCA1 Sign in to submit a review for this vehicle." })), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-[10px] font-semibold text-slate-500", children: "Rating" }), _jsx("div", { className: "flex items-center space-x-1", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { type: "button", onClick: () => setReviewRating(star), className: "p-0.5", children: _jsx(Star, { className: `h-4.5 w-4.5 ${star <= reviewRating
                                                        ? 'text-amber-500 fill-amber-500'
                                                        : 'text-slate-200 hover:text-amber-400'}` }) }, star))) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-[10px] font-semibold text-slate-500", children: "Your Review" }), _jsx("textarea", { value: reviewText, onChange: (e) => setReviewText(e.target.value), placeholder: "Share your experience with this vehicle (min 5 characters)...", rows: 2, disabled: !user, className: "w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 disabled:opacity-60" })] }), reviewError && (_jsxs("div", { className: "text-[10px] text-red-500 bg-red-50 border border-red-100 p-2 rounded flex items-center space-x-1.5 font-medium", children: [_jsx(AlertCircle, { className: "h-3.5 w-3.5" }), _jsx("span", { children: reviewError })] })), _jsx("button", { type: "submit", disabled: !user || reviewSubmitting, className: "w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm", children: reviewSubmitting ? 'Submitting...' : 'Submit Review' })] })] })] }) }));
};
//# sourceMappingURL=CarDetailsModal.js.map