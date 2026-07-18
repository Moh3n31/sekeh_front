import { api, type ApiResponse } from "./api";

interface LandingContent {
	hero: HeroSection;
	problem_section: ProblemSection;
	solution_section: SolutionSection;
	features_section: FeaturesSection;
	how_it_works: HowItWorksSection;
	stats: StatsSection;
	final_cta: FinalCTASection;
}

interface HeroSection {
	title: string;
	subtitle: string;
	secondary_cta: string;
	secondary_cta_link: string;
}

interface ProblemSection {
	title: string;
	description: string;
	points: ProblemPoint[];
}

interface ProblemPoint {
	title: string;
	detail: string;
}

interface SolutionSection {
	title: string;
	description: string;
	steps: string[];
}

interface FeaturesSection {
	title: string;
	features: Feature[];
}

interface Feature {
	key: string;
	title: string;
	description: string;
}

interface HowItWorksSection {
	title: string;
	steps: HowItWorksStep[];
}

interface HowItWorksStep {
	step: number;
	title: string;
	description: string;
}

interface StatsSection {
	title: string;
	items: StatItem[];
}

interface StatItem {
	key: string;
	label: string;
	value: number;
}

interface FinalCTASection {
	title: string;
	secondary_cta: string;
	secondary_cta_link: string;
}

const landingAPI = {
	getLanding: () => api.get<ApiResponse<LandingContent>>("/landing"),
};

export type { LandingContent };
export { landingAPI };
