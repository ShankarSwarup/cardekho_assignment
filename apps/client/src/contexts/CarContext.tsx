import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface CarContextType {
  activeTab: 'home' | 'search' | 'compare' | 'wishlist';
  setActiveTab: (tab: 'home' | 'search' | 'compare' | 'wishlist') => void;

  // Catalog State
  cars: any[];
  totalCars: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  hasNextPage: boolean;
  loadingCars: boolean;

  // Filters State
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  filterBrand: string;
  setFilterBrand: (brand: string) => void;
  filterFuel: string;
  setFilterFuel: (fuel: string) => void;
  filterTransmission: string;
  setFilterTransmission: (transmission: string) => void;
  filterMinPrice: string;
  setFilterMinPrice: (minPrice: string) => void;
  filterMaxPrice: string;
  setFilterMaxPrice: (maxPrice: string) => void;
  filterPerformance: string;
  setFilterPerformance: (performance: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  priceError: string;

  // Dynamic filter values from API
  brands: string[];
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];

  // Smart Recs State
  searchMode: 'catalog' | 'advisor';
  setSearchMode: (mode: 'catalog' | 'advisor') => void;
  wizardBudget: number;
  setWizardBudget: (budget: number) => void;
  wizardFamilySize: number;
  setWizardFamilySize: (size: number) => void;
  wizardFuel: string;
  setWizardFuel: (fuel: string) => void;
  wizardTransmission: string;
  setWizardTransmission: (transmission: string) => void;
  wizardDailyDistance: number;
  setWizardDailyDistance: (distance: number) => void;
  wizardPriority: string;
  setWizardPriority: (priority: string) => void;
  wizardBrandPref: string;
  setWizardBrandPref: (brand: string) => void;
  smartRecommendations: any[];
  setSmartRecommendations: (recs: any[]) => void;
  advisorExplanation: string;
  setAdvisorExplanation: (exp: string) => void;
  advisorLoading: boolean;
  consultationHistory: any[];

  // Comparison State
  selectedForCompare: any[];
  setSelectedForCompare: React.Dispatch<React.SetStateAction<any[]>>;
  compareData: any;
  loadingCompare: boolean;
  handleToggleSelectCompare: (car: any) => void;
  triggerComparisonFetch: () => Promise<void>;

  // Wishlist State
  wishlistIds: string[];
  wishlistCars: any[];
  handleToggleWishlist: (carId: string) => Promise<void>;

  // Details & Reviews Modal
  selectedCar: any;
  setSelectedCar: (car: any) => void;
  carReviews: any[];
  reviewsLoading: boolean;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  reviewSubmitting: boolean;
  reviewError: string;
  openCarDetails: (car: any) => void;
  closeCarDetails: () => void;
  handleSubmitReview: (e: React.FormEvent) => Promise<void>;
  handleDeleteReview: (reviewId: string) => Promise<void>;
  handleGenerateRecommendations: (e: React.FormEvent) => Promise<void>;
  fetchCars: () => Promise<void>;
  applyFilters: () => void;
  resetFilters: () => void;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, setUser, setShowLoginModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'compare' | 'wishlist'>('home');

  // Catalog State
  const [cars, setCars] = useState<any[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingCars, setLoadingCars] = useState(false);

  // Filters State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterFuel, setFilterFuel] = useState('Any');
  const [filterTransmission, setFilterTransmission] = useState('Any');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterPerformance, setFilterPerformance] = useState('Any');
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceError, setPriceError] = useState('');

  // Applied Filters State (only changes when user clicks Find/Apply)
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('');
  const [appliedBrand, setAppliedBrand] = useState('');
  const [appliedFuel, setAppliedFuel] = useState('Any');
  const [appliedTransmission, setAppliedTransmission] = useState('Any');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [appliedPerformance, setAppliedPerformance] = useState('Any');

  // Dynamic filter values from API
  const [brands, setBrands] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);

  // Smart Rec Mode / Wizard State
  const [searchMode, setSearchMode] = useState<'catalog' | 'advisor'>('catalog');
  const [wizardBudget, setWizardBudget] = useState(1500000);
  const [wizardFamilySize, setWizardFamilySize] = useState(5);
  const [wizardFuel, setWizardFuel] = useState('Petrol');
  const [wizardTransmission, setWizardTransmission] = useState('Automatic');
  const [wizardDailyDistance, setWizardDailyDistance] = useState(40);
  const [wizardPriority, setWizardPriority] = useState('Safety');
  const [wizardBrandPref, setWizardBrandPref] = useState('');

  const [smartRecommendations, setSmartRecommendations] = useState<any[]>([]);
  const [advisorExplanation, setAdvisorExplanation] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<any[]>([]);

  // Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<any>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistCars, setWishlistCars] = useState<any[]>([]);

  // Details Modal State
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [carReviews, setCarReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '/api/v1';

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

  // Fetch unique filter values from API
  const fetchCarFilters = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cars/filters`);
      if (res.data.success) {
        setBrands(res.data.data.brands || []);
        setFuelTypes(res.data.data.fuelTypes || []);
        setTransmissions(res.data.data.transmissions || []);
        setBodyTypes(res.data.data.bodyTypes || []);
      }
    } catch (err) {
      console.error('Failed to load dynamic filter configurations:', err);
    }
  }, []);

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
      const keywordQuery = appliedSearchKeyword ? `&keyword=${appliedSearchKeyword}` : '';

      const url = `${BASE_URL}/cars?page=${currentPage}&limit=6&sortBy=${sortBy}&sortOrder=${sortOrder}${brandQuery}${fuelQuery}${transQuery}${performanceQuery}${minPriceQuery}${maxPriceQuery}${keywordQuery}`;
      const res = await axios.get(url);

      if (res.data.success) {
        setCars(res.data.data.cars);
        setTotalCars(res.data.data.pagination.total);
        setHasNextPage(res.data.data.pagination.hasNext);
      }
    } catch (err) {
      console.error('Failed to load vehicle catalog:', err);
    } finally {
      setLoadingCars(false);
    }
  }, [currentPage, appliedFuel, appliedTransmission, appliedPerformance, appliedMinPrice, appliedMaxPrice, appliedBrand, appliedSearchKeyword, sortBy, sortOrder, priceError]);

  const applyFilters = useCallback(() => {
    if (priceError) return;
    setAppliedBrand(filterBrand);
    setAppliedFuel(filterFuel);
    setAppliedTransmission(filterTransmission);
    setAppliedMinPrice(filterMinPrice);
    setAppliedMaxPrice(filterMaxPrice);
    setAppliedPerformance(filterPerformance);
    setAppliedSearchKeyword(searchKeyword);
    setCurrentPage(1);
  }, [filterBrand, filterFuel, filterTransmission, filterMinPrice, filterMaxPrice, filterPerformance, searchKeyword, priceError]);

  const resetFilters = useCallback(() => {
    setFilterBrand('');
    setFilterFuel('Any');
    setFilterTransmission('Any');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterPerformance('Any');
    setSearchKeyword('');

    setAppliedBrand('');
    setAppliedFuel('Any');
    setAppliedTransmission('Any');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setAppliedPerformance('Any');
    setAppliedSearchKeyword('');
    setCurrentPage(1);
  }, []);

  // Fetch recommendation sessions history
  const fetchConsultationHistory = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/recommendations/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setConsultationHistory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch recommendation history:', err);
    }
  }, [token]);

  // Fetch user's wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/cars/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const cars = res.data.data || [];
        setWishlistCars(cars);
        setWishlistIds(cars.map((c: any) => c._id));
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  }, [token]);

  // Sync wishlist and history whenever token changes
  useEffect(() => {
    if (token) {
      fetchWishlist();
      fetchConsultationHistory();
    } else {
      setWishlistIds([]);
      setWishlistCars([]);
      setConsultationHistory([]);
    }
  }, [token, fetchWishlist, fetchConsultationHistory]);

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
  const handleToggleWishlist = useCallback(async (carId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const isWishlisted = wishlistIds.includes(carId);
    const action = isWishlisted ? 'remove' : 'add';

    try {
      const res = await axios.post(
        `${BASE_URL}/cars/wishlist`,
        { carId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update user state and sync with local storage
        const updatedUser = res.data.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Instantly reload wishlist details from backend database
        fetchWishlist();
      }
    } catch (err) {
      console.error('Wishlist modification error:', err);
    }
  }, [user, wishlistIds, token, fetchWishlist, setUser, setShowLoginModal]);

  // Select / Unselect vehicles for comparison
  const handleToggleSelectCompare = useCallback((car: any) => {
    const isSelected = selectedForCompare.some((c) => c._id === car._id);
    if (isSelected) {
      setSelectedForCompare((prev) => prev.filter((c) => c._id !== car._id));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('Maximum comparison limit is 4 cars.');
        return;
      }
      setSelectedForCompare((prev) => [...prev, car]);
    }
  }, [selectedForCompare, setSelectedForCompare]);

  // Fetch comparison spec details
  const triggerComparisonFetch = useCallback(async () => {
    if (selectedForCompare.length === 0) return;
    setLoadingCompare(true);
    try {
      const ids = selectedForCompare.map((c) => c._id).join(',');
      const res = await axios.get(`${BASE_URL}/cars/compare?ids=${ids}`);
      if (res.data.success) {
        setCompareData(res.data.data);
        setActiveTab('compare');
      }
    } catch (err) {
      console.error('Failed to fetch specifications comparison:', err);
    } finally {
      setLoadingCompare(false);
    }
  }, [selectedForCompare, setActiveTab]);

  // Fetch reviews list for a selected vehicle
  const fetchCarReviews = useCallback(async (carId: string) => {
    setReviewsLoading(true);
    setReviewError('');
    try {
      const res = await axios.get(`${BASE_URL}/cars/${carId}/reviews`);
      if (res.data.success) {
        setCarReviews(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setReviewError('Unable to load reviews for this vehicle.');
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const openCarDetails = useCallback((car: any) => {
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

  const handleSubmitReview = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (reviewText.trim().length < 5) {
      setReviewError('Review must be at least 5 characters.');
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
      }
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  }, [selectedCar, user, reviewText, reviewRating, token, fetchCarReviews, setShowLoginModal]);

  const handleDeleteReview = useCallback(async (reviewId: string) => {
    if (!token) return;
    try {
      await axios.delete(`${BASE_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (selectedCar) {
        fetchCarReviews(selectedCar._id);
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  }, [token, selectedCar, fetchCarReviews]);

  // Smart Consultation computations
  const handleGenerateRecommendations = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setAdvisorLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/recommendations`, {
        budget: wizardBudget,
        familySize: wizardFamilySize,
        fuel: wizardFuel,
        transmission: wizardTransmission,
        dailyDistance: wizardDailyDistance,
        priority: wizardPriority,
        brandPreference: wizardBrandPref || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSmartRecommendations(res.data.data.recommendations);
        setAdvisorExplanation(res.data.data.explanation);
        fetchConsultationHistory();
      }
    } catch (err) {
      console.error('Failed to compute recommendation metrics:', err);
    } finally {
      setAdvisorLoading(false);
    }
  }, [
    user,
    wizardBudget,
    wizardFamilySize,
    wizardFuel,
    wizardTransmission,
    wizardDailyDistance,
    wizardPriority,
    wizardBrandPref,
    token,
    fetchConsultationHistory,
    setShowLoginModal
  ]);

  return (
    <CarContext.Provider
      value={{
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
        bodyTypes,
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
        handleGenerateRecommendations,
        fetchCars,
        applyFilters,
        resetFilters
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};
