import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../toast/ToastContext';
const CarContext = createContext(undefined);
export const CarProvider = ({ children }) => {
    const { user, token, setUser, setShowLoginModal } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('home');
    // Catalog State
    const [cars, setCars] = useState([]);
    const [totalCars, setTotalCars] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loadingCars, setLoadingCars] = useState(false);
    // Filters State
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterModel, setFilterModel] = useState('');
    const [filterFuel, setFilterFuel] = useState('Any');
    const [filterTransmission, setFilterTransmission] = useState('Any');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');
    const [filterPerformance, setFilterPerformance] = useState('Any');
    const [filterSafetyRating, setFilterSafetyRating] = useState(0);
    const [filterSeatingCapacity, setFilterSeatingCapacity] = useState(0);
    const [filterMinYear, setFilterMinYear] = useState('');
    const [filterMaxYear, setFilterMaxYear] = useState('');
    const [filterMinMileage, setFilterMinMileage] = useState('');
    const [sortBy, setSortBy] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc');
    const [priceError, setPriceError] = useState('');
    // Applied Filters State (only changes when user clicks Find/Apply)
    const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('');
    const [appliedBrand, setAppliedBrand] = useState('');
    const [appliedModel, setAppliedModel] = useState('');
    const [appliedFuel, setAppliedFuel] = useState('Any');
    const [appliedTransmission, setAppliedTransmission] = useState('Any');
    const [appliedMinPrice, setAppliedMinPrice] = useState('');
    const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
    const [appliedPerformance, setAppliedPerformance] = useState('Any');
    const [appliedSafetyRating, setAppliedSafetyRating] = useState(0);
    const [appliedSeatingCapacity, setAppliedSeatingCapacity] = useState(0);
    const [appliedMinYear, setAppliedMinYear] = useState('');
    const [appliedMaxYear, setAppliedMaxYear] = useState('');
    const [appliedMinMileage, setAppliedMinMileage] = useState('');
    // Dynamic filter values from API
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [brandModels, setBrandModels] = useState({});
    const [fuelTypes, setFuelTypes] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [seatingCapacities, setSeatingCapacities] = useState([]);
    const [safetyRatings, setSafetyRatings] = useState([]);
    const [years, setYears] = useState([]);
    // Comparison State
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [compareData, setCompareData] = useState(null);
    const [loadingCompare, setLoadingCompare] = useState(false);
    // Wishlist State
    const [wishlistIds, setWishlistIds] = useState([]);
    const [wishlistCars, setWishlistCars] = useState([]);
    // Details Modal State
    const [selectedCar, setSelectedCar] = useState(null);
    const [carReviews, setCarReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
    // Validate price bounds
    useEffect(() => {
        const minVal = filterMinPrice ? parseFloat(filterMinPrice) : 0;
        const maxVal = filterMaxPrice ? parseFloat(filterMaxPrice) : Infinity;
        if (minVal < 0 || maxVal < 0) {
            setPriceError('Price bounds cannot be negative.');
            return;
        }
        if (filterMinPrice && filterMaxPrice && maxVal < minVal) {
            setPriceError('Max price cannot be less than min price.');
            return;
        }
        setPriceError('');
    }, [filterMinPrice, filterMaxPrice]);
    // Reset Model filter when Brand changes to avoid selecting invalid model
    useEffect(() => {
        setFilterModel('');
    }, [filterBrand]);
    // Fetch unique filter values from API
    const fetchCarFilters = useCallback(async () => {
        try {
            const res = await axios.get(`${BASE_URL}/cars/filters`);
            if (res.data.success) {
                setBrands(res.data.data.brands || []);
                setModels(res.data.data.models || []);
                setBrandModels(res.data.data.brandModels || {});
                setFuelTypes(res.data.data.fuelTypes || []);
                setTransmissions(res.data.data.transmissions || []);
                setBodyTypes(res.data.data.bodyTypes || []);
                setSeatingCapacities(res.data.data.seatingCapacities || []);
                setSafetyRatings(res.data.data.safetyRatings || []);
                setYears(res.data.data.years || []);
            }
        }
        catch (err) {
            console.error('Failed to load dynamic filter configurations:', err);
        }
    }, [BASE_URL]);
    // Fetch catalog cars based on applied filters
    const fetchCars = useCallback(async () => {
        if (priceError) {
            setLoadingCars(false);
            return;
        }
        setLoadingCars(true);
        try {
            const fuelQuery = appliedFuel === 'Any' ? '' : `&fuel=${appliedFuel}`;
            const transQuery = appliedTransmission === 'Any' ? '' : `&transmission=${appliedTransmission}`;
            const performanceQuery = appliedPerformance === 'Any' ? '' : `&performance=${appliedPerformance}`;
            const minPriceQuery = appliedMinPrice ? `&minPrice=${appliedMinPrice}` : '';
            const maxPriceQuery = appliedMaxPrice ? `&maxPrice=${appliedMaxPrice}` : '';
            const brandQuery = appliedBrand ? `&brand=${appliedBrand}` : '';
            const modelQuery = appliedModel ? `&model=${appliedModel}` : '';
            const keywordQuery = appliedSearchKeyword ? `&keyword=${appliedSearchKeyword}` : '';
            // Dynamic filters
            const safetyQuery = appliedSafetyRating > 0 ? `&safetyRating=${appliedSafetyRating}` : '';
            const seatingQuery = appliedSeatingCapacity > 0 ? `&seatingCapacity=${appliedSeatingCapacity}` : '';
            const minYearQuery = appliedMinYear ? `&minYear=${appliedMinYear}` : '';
            const maxYearQuery = appliedMaxYear ? `&maxYear=${appliedMaxYear}` : '';
            const mileageQuery = appliedMinMileage ? `&minMileage=${appliedMinMileage}` : '';
            const url = `${BASE_URL}/cars?page=${currentPage}&limit=6&sortBy=${sortBy}&sortOrder=${sortOrder}${brandQuery}${modelQuery}${fuelQuery}${transQuery}${performanceQuery}${minPriceQuery}${maxPriceQuery}${keywordQuery}${safetyQuery}${seatingQuery}${minYearQuery}${maxYearQuery}${mileageQuery}`;
            const res = await axios.get(url);
            if (res.data.success) {
                setCars(res.data.data.cars);
                setTotalCars(res.data.data.pagination.total);
                setHasNextPage(res.data.data.pagination.hasNext);
            }
        }
        catch (err) {
            console.error('Failed to load vehicle catalog:', err);
        }
        finally {
            setLoadingCars(false);
        }
    }, [
        currentPage,
        appliedFuel,
        appliedTransmission,
        appliedPerformance,
        appliedMinPrice,
        appliedMaxPrice,
        appliedBrand,
        appliedModel,
        appliedSearchKeyword,
        appliedSafetyRating,
        appliedSeatingCapacity,
        appliedMinYear,
        appliedMaxYear,
        appliedMinMileage,
        sortBy,
        sortOrder,
        priceError,
        BASE_URL
    ]);
    const applyFilters = useCallback(() => {
        if (priceError)
            return;
        setAppliedBrand(filterBrand);
        setAppliedModel(filterModel);
        setAppliedFuel(filterFuel);
        setAppliedTransmission(filterTransmission);
        setAppliedMinPrice(filterMinPrice);
        setAppliedMaxPrice(filterMaxPrice);
        setAppliedPerformance(filterPerformance);
        setAppliedSearchKeyword(searchKeyword);
        setAppliedSafetyRating(filterSafetyRating);
        setAppliedSeatingCapacity(filterSeatingCapacity);
        setAppliedMinYear(filterMinYear);
        setAppliedMaxYear(filterMaxYear);
        setAppliedMinMileage(filterMinMileage);
        setCurrentPage(1);
        showToast('Filters applied successfully.', 'success');
    }, [
        filterBrand,
        filterModel,
        filterFuel,
        filterTransmission,
        filterMinPrice,
        filterMaxPrice,
        filterPerformance,
        searchKeyword,
        filterSafetyRating,
        filterSeatingCapacity,
        filterMinYear,
        filterMaxYear,
        filterMinMileage,
        priceError,
        showToast
    ]);
    const resetFilters = useCallback(() => {
        setFilterBrand('');
        setFilterModel('');
        setFilterFuel('Any');
        setFilterTransmission('Any');
        setFilterMinPrice('');
        setFilterMaxPrice('');
        setFilterPerformance('Any');
        setSearchKeyword('');
        setFilterSafetyRating(0);
        setFilterSeatingCapacity(0);
        setFilterMinYear('');
        setFilterMaxYear('');
        setFilterMinMileage('');
        setAppliedBrand('');
        setAppliedModel('');
        setAppliedFuel('Any');
        setAppliedTransmission('Any');
        setAppliedMinPrice('');
        setAppliedMaxPrice('');
        setAppliedPerformance('Any');
        setAppliedSearchKeyword('');
        setAppliedSafetyRating(0);
        setAppliedSeatingCapacity(0);
        setAppliedMinYear('');
        setAppliedMaxYear('');
        setAppliedMinMileage('');
        setCurrentPage(1);
        showToast('Filters cleared.', 'info');
    }, [showToast]);
    // Fetch user's wishlist from backend
    const fetchWishlist = useCallback(async () => {
        if (!token)
            return;
        try {
            const res = await axios.get(`${BASE_URL}/cars/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const cars = res.data.data || [];
                setWishlistCars(cars);
                setWishlistIds(cars.map((c) => c._id));
            }
        }
        catch (err) {
            console.error('Failed to fetch wishlist:', err);
        }
    }, [token, BASE_URL]);
    // Sync wishlist whenever token changes
    useEffect(() => {
        if (token) {
            fetchWishlist();
        }
        else {
            setWishlistIds([]);
            setWishlistCars([]);
        }
    }, [token, fetchWishlist]);
    // Fetch wishlist dynamically when active tab changes to wishlist
    useEffect(() => {
        if (activeTab === 'wishlist' && token) {
            fetchWishlist();
        }
    }, [activeTab, token, fetchWishlist]);
    // Fetch filters on mount and run initial catalog search
    useEffect(() => {
        fetchCarFilters();
    }, [fetchCarFilters]);
    // Unified catalog updates useEffect
    useEffect(() => {
        fetchCars();
    }, [fetchCars]);
    // Toggle wishlist synchronization
    const handleToggleWishlist = useCallback(async (carId) => {
        if (!user) {
            setShowLoginModal(true);
            showToast('Please sign in to save vehicles to your wishlist.', 'info');
            return;
        }
        const isWishlisted = wishlistIds.includes(carId);
        const action = isWishlisted ? 'remove' : 'add';
        try {
            const res = await axios.post(`${BASE_URL}/cars/wishlist`, { carId, action }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) {
                const updatedUser = res.data.data;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                fetchWishlist();
                showToast(isWishlisted ? 'Removed from wishlist.' : 'Saved to wishlist!', 'success');
            }
        }
        catch (err) {
            console.error('Wishlist modification error:', err);
            showToast('Failed to update wishlist.', 'error');
        }
    }, [user, wishlistIds, token, fetchWishlist, setUser, setShowLoginModal, showToast, BASE_URL]);
    // Select / Unselect vehicles for comparison
    const handleToggleSelectCompare = useCallback((car) => {
        const isSelected = selectedForCompare.some((c) => c._id === car._id);
        if (isSelected) {
            setSelectedForCompare((prev) => prev.filter((c) => c._id !== car._id));
            showToast(`${car.make} ${car.model} removed from compare.`, 'info');
        }
        else {
            if (selectedForCompare.length >= 4) {
                showToast('Maximum comparison limit is 4 cars.', 'error');
                return;
            }
            setSelectedForCompare((prev) => [...prev, car]);
            showToast(`${car.make} ${car.model} added to compare list.`, 'success');
        }
    }, [selectedForCompare, setSelectedForCompare, showToast]);
    // Fetch comparison spec details
    const triggerComparisonFetch = useCallback(async () => {
        if (selectedForCompare.length === 0)
            return;
        setLoadingCompare(true);
        try {
            const ids = selectedForCompare.map((c) => c._id).join(',');
            const res = await axios.get(`${BASE_URL}/cars/compare?ids=${ids}`);
            if (res.data.success) {
                setCompareData(res.data.data);
                setActiveTab('compare');
            }
        }
        catch (err) {
            console.error('Failed to fetch specifications comparison:', err);
            showToast('Failed to load specifications comparison.', 'error');
        }
        finally {
            setLoadingCompare(false);
        }
    }, [selectedForCompare, setActiveTab, showToast, BASE_URL]);
    // Fetch reviews list for a selected vehicle
    const fetchCarReviews = useCallback(async (carId) => {
        setReviewsLoading(true);
        setReviewError('');
        try {
            const res = await axios.get(`${BASE_URL}/cars/${carId}/reviews`);
            if (res.data.success) {
                setCarReviews(res.data.data);
            }
        }
        catch (err) {
            console.error('Failed to load reviews:', err);
            setReviewError('Unable to load reviews for this vehicle.');
        }
        finally {
            setReviewsLoading(false);
        }
    }, [BASE_URL]);
    const openCarDetails = useCallback((car) => {
        setSelectedCar(car);
        setReviewRating(5);
        setReviewText('');
        setReviewError('');
        fetchCarReviews(car._id);
    }, [fetchCarReviews]);
    const closeCarDetails = useCallback(() => {
        setSelectedCar(null);
        setCarReviews([]);
        setReviewError('');
    }, []);
    const handleSubmitReview = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedCar)
            return;
        if (!user) {
            setShowLoginModal(true);
            showToast('Please sign in to write a review.', 'info');
            return;
        }
        if (reviewText.trim().length < 5) {
            setReviewError('Review must be at least 5 characters.');
            showToast('Review message is too short.', 'error');
            return;
        }
        setReviewSubmitting(true);
        setReviewError('');
        try {
            const res = await axios.post(`${BASE_URL}/cars/${selectedCar._id}/reviews`, {
                rating: reviewRating,
                review: reviewText.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setReviewText('');
                setReviewRating(5);
                fetchCarReviews(selectedCar._id);
                showToast('Review submitted successfully!', 'success');
            }
        }
        catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to submit review.';
            setReviewError(errMsg);
            showToast(errMsg, 'error');
        }
        finally {
            setReviewSubmitting(false);
        }
    }, [selectedCar, user, reviewText, reviewRating, token, fetchCarReviews, setShowLoginModal, showToast, BASE_URL]);
    const handleDeleteReview = useCallback(async (reviewId) => {
        if (!token)
            return;
        try {
            await axios.delete(`${BASE_URL}/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (selectedCar) {
                fetchCarReviews(selectedCar._id);
            }
            showToast('Review deleted.', 'success');
        }
        catch (err) {
            console.error('Failed to delete review:', err);
            showToast('Failed to delete review.', 'error');
        }
    }, [token, selectedCar, fetchCarReviews, showToast, BASE_URL]);
    return (_jsx(CarContext.Provider, { value: {
            activeTab,
            setActiveTab,
            cars,
            totalCars,
            currentPage,
            setCurrentPage,
            hasNextPage,
            loadingCars,
            searchKeyword,
            setSearchKeyword,
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
            models,
            brandModels,
            fuelTypes,
            transmissions,
            bodyTypes,
            seatingCapacities,
            safetyRatings,
            years,
            selectedForCompare,
            setSelectedForCompare,
            compareData,
            loadingCompare,
            handleToggleSelectCompare,
            triggerComparisonFetch,
            wishlistIds,
            wishlistCars,
            handleToggleWishlist,
            selectedCar,
            setSelectedCar,
            carReviews,
            reviewsLoading,
            reviewRating,
            setReviewRating,
            reviewText,
            setReviewText,
            reviewSubmitting,
            reviewError,
            openCarDetails,
            closeCarDetails,
            handleSubmitReview,
            handleDeleteReview,
            fetchCars,
            applyFilters,
            resetFilters
        }, children: children }));
};
export const useCars = () => {
    const context = useContext(CarContext);
    if (context === undefined) {
        throw new Error('useCars must be used within a CarProvider');
    }
    return context;
};
//# sourceMappingURL=CarContext.js.map