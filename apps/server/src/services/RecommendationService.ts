import { CarRepository } from '../repositories/CarRepository.js';
import { RecommendationRepository } from '../repositories/RecommendationRepository.js';
import { RecommendationPreferences, RecommendationResult, RecommendationSession } from '@automatch/types';

interface ScoredCandidate {
  car: {
    _id: unknown;
    make: string;
    model: string;
    variant: string;
    price: number;
    mileage: number;
    safetyRating: number;
    fuelType: string;
    transmission: string;
    seatingCapacity: number;
    engine: string;
  };
  score: number;
}

export class RecommendationService {
  private carRepository = new CarRepository();
  private recommendationRepository = new RecommendationRepository();

  private buildRuleBasedRecommendations(
    preferences: RecommendationPreferences,
    topCandidates: ScoredCandidate[]
  ): { recommendations: RecommendationResult[]; explanation: string } {
    const { priority, budget, dailyDistance } = preferences;

    const recommendations = topCandidates.slice(0, 3).map((candidate, index) => {
      const car = candidate.car;
      let reason = '';
      let tradeOff = '';
      
      const score = Math.max(60, Math.min(98, candidate.score));

      const priceText = `At ₹${car.price.toLocaleString('en-IN')}`;
      const seatsText = `${car.seatingCapacity}-seater capacity`;
      const safetyText = `${car.safetyRating}-star safety rating`;
      const mileageText = `${car.mileage} km/l mileage`;

      if (priority === 'Safety') {
        reason = `${priceText}, this model offers a stellar ${safetyText} and ${seatsText}, ensuring robust passenger protection for daily driving.`;
        tradeOff = car.price > budget * 0.95 
          ? 'Stretches close to or beyond your target budget limit.' 
          : 'May have slightly lower fuel economy than lighter, less rigid alternatives.';
      } else if (priority === 'Mileage') {
        reason = `Highly efficient option returning an excellent ${mileageText}. Featuring a ${car.engine} layout, it optimizes long-term running costs for your daily commutes.`;
        tradeOff = car.safetyRating < 4
          ? `Safety rating is ${car.safetyRating} stars, which is lower than premium safety-focused competitors.`
          : 'Acceleration and raw power output might feel linear rather than aggressive.';
      } else if (priority === 'Budget') {
        reason = `Excellent value proposition. ${priceText} fits comfortably within your limit while still providing a ${seatsText} and reliable specifications.`;
        tradeOff = car.safetyRating < 4
          ? 'Lower safety equipment package compared to high-end segment variants.'
          : 'Feature suite might exclude some premium interior materials.';
      } else if (priority === 'Performance') {
        reason = `Selected for its high-performance ${car.engine} powertrain and responsive ${car.transmission} transmission, matching a sporty driving preference.`;
        tradeOff = car.mileage < 16
          ? `Fuel economy is relatively modest at ${mileageText} due to the performance tuning.`
          : 'May demand slightly higher maintenance and insurance costs.';
      } else {
        reason = `A well-balanced selection combining a ${seatsText}, decent ${mileageText}, and a solid ${safetyText}.`;
        tradeOff = 'A jack-of-all-trades choice that doesn\'t specialize in any single extreme attribute.';
      }

      if (car.transmission.toLowerCase().includes('manual') && dailyDistance > 50) {
        tradeOff += ` Note: Driving a manual transmission over ${dailyDistance} km daily in traffic could be exhausting.`;
      }

      return {
        carId: String(car._id),
        score,
        reason,
        tradeOff
      };
    });

    const priorityPhrases: Record<string, string> = {
      Safety: 'prioritizing occupant protection and NCAP safety ratings',
      Budget: 'optimizing total upfront cost constraints',
      Mileage: 'maximizing fuel economy for your daily commute',
      Performance: 'focusing on engine specifications and transmission responsiveness'
    };

    const topCar = topCandidates[0]?.car;
    const explanation = `Based on your preferences, we scored vehicles in the database ${
      priorityPhrases[priority] || 'focusing on balanced value'
    }. The top pick is the ${topCar?.make ?? 'Tata'} ${topCar?.model ?? 'Nexon'} scoring ${topCandidates[0]?.score ?? 95}% overall compatibility.`;

    return { recommendations, explanation };
  }

  async generateRecommendations(
    userId: string,
    preferences: RecommendationPreferences
  ): Promise<any> {
    const { budget, priority, familySize, fuel, transmission } = preferences;

    const allCars = await this.carRepository.findAllCandidates(preferences);

    const scoredCandidates = allCars.map((car) => {
      let score = 0;

      // 1. Price Match (35 Points)
      if (car.price <= budget) {
        const ratio = car.price / budget;
        if (ratio >= 0.6) {
          score += 35;
        } else {
          score += 15 + Math.round(20 * (ratio / 0.6));
        }
      } else if (car.price <= budget * 1.2) {
        const excessRatio = (car.price - budget) / (budget * 0.2);
        score += 20 - Math.round(15 * excessRatio);
      } else {
        score += 0;
      }

      // 2. Seating Capacity Match (20 Points)
      if (car.seatingCapacity === familySize) {
        score += 20;
      } else if (car.seatingCapacity > familySize) {
        score += 15;
      } else {
        score += 0;
      }

      // 3. Priority Match (25 Points)
      if (priority === 'Safety') {
        if (car.safetyRating === 5) score += 25;
        else if (car.safetyRating === 4) score += 18;
        else if (car.safetyRating === 3) score += 10;
        else score += 3;
      } else if (priority === 'Mileage') {
        if (car.mileage >= 22) score += 25;
        else if (car.mileage >= 18) score += 20;
        else if (car.mileage >= 15) score += 12;
        else score += 5;
      } else if (priority === 'Budget') {
        if (car.price <= budget * 0.7) score += 25;
        else if (car.price <= budget * 0.9) score += 20;
        else if (car.price <= budget) score += 15;
        else score += 5;
      } else if (priority === 'Performance') {
        const isEV = car.fuelType.toLowerCase() === 'electric' || car.engine.toLowerCase().includes('motor');
        const isTurbo = car.engine.toLowerCase().includes('turbo') || car.engine.toLowerCase().includes('tsi');
        const ccMatch = car.engine.match(/(\d+)\s*cc/);
        const cc = ccMatch ? parseInt(ccMatch[1]) : 0;
        if (isEV || cc > 1600 || isTurbo) {
          score += 25;
        } else if (cc >= 1200) {
          score += 18;
        } else {
          score += 8;
        }
      }

      // 4. Fuel & Transmission match (10 Points)
      if (fuel && fuel !== 'Any' && car.fuelType.toLowerCase() === fuel.toLowerCase()) {
        score += 5;
      } else if (!fuel || fuel === 'Any') {
        score += 5;
      }
      if (transmission && transmission !== 'Any' && car.transmission.toLowerCase() === transmission.toLowerCase()) {
        score += 5;
      } else if (!transmission || transmission === 'Any') {
        score += 5;
      }

      // 5. Brand Preference (10 Points)
      if (
        preferences.brandPreference &&
        car.make.toLowerCase().includes(preferences.brandPreference.toLowerCase())
      ) {
        score += 10;
      }

      return {
        car,
        score: Math.round(score)
      };
    });

    const topCandidates = scoredCandidates.sort((a, b) => b.score - a.score).slice(0, 5);

    if (topCandidates.length === 0) {
      throw new Error('No candidate vehicles match basic availability guidelines');
    }

    const { recommendations, explanation } = this.buildRuleBasedRecommendations(
      preferences,
      topCandidates
    );

    const sessionData: Partial<RecommendationSession> = {
      userId,
      preferences,
      shortlistedCars: recommendations.map((r) => r.carId),
      advisorExplanation: explanation
    };
    await this.recommendationRepository.create(sessionData);

    const hydratedRecommendations = recommendations.map((rec) => {
      const match = allCars.find((c) => String(c._id) === String(rec.carId));
      return {
        ...rec,
        carDetails: match
      };
    });

    return {
      preferences,
      recommendations: hydratedRecommendations,
      explanation
    };
  }

  async getHistory(userId: string): Promise<RecommendationSession[]> {
    return this.recommendationRepository.findByUserId(userId);
  }
}
