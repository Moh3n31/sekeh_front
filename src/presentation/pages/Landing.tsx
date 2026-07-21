import { useNavigate } from "react-router";
import { landingAPI } from "../../services/landing";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import {
	Sparkles,
	Rocket,
	Brain,
	Target,
	MessageCircle,
	TrendingUp,
	Users,
	Briefcase,
	MessagesSquare,
	FileText,
	Zap,
	Star,
} from "lucide-react";
import Title from "../components/shared/Title";
import { checkTokens } from "../../utils/authTokens";

export default function Landing() {
	const { getLanding } = landingAPI;
	const { data } = useCustomQuery({ func: getLanding, key: ["landing-data"] });
	const navigate = useNavigate();

	const handleDirectPage = () => {
		if (checkTokens()) navigate("/chats");
		else navigate("/auth/login");
	};

	const landingContent = data?.data; // adjust based on your API response structure

	if (!landingContent) {
		return (
			<div className="h-screen w-screen bg-surface flex items-center justify-center">
				<div className="animate-pulse flex flex-col items-center gap-4">
					<div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
					<p className="text-primary-text text-lg">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-surface min-h-screen" id="landing-container">
			{/* Header */}
			<header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
				<button
					className="bg-accent text-white md:px-6 md:py-2.5 rounded-full text-sm font-medium
          hover:bg-accent-hover transition-all duration-300 hover:scale-105 hover:shadow-lg
          flex items-center gap-2 cursor-pointer max-md:size-8 max-md:justify-center"
					onClick={handleDirectPage}>
					<MessageCircle size={18} />
					<span className="max-md:hidden">
						{landingContent.hero.secondary_cta}
					</span>
				</button>

				<Title subColor="primary-text" mianColor="accent" />
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
				{/* Hero Section */}
				<section className="text-center space-y-6 pt-8">
					<div className="inline-flex items-center gap-2 bg-accent-soft text-accent px-4 py-2 rounded-full text-sm font-medium">
						<Zap size={16} />
						AI-Powered Career Assistant
					</div>
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-text leading-tight">
						{landingContent.hero.title}
					</h1>
					<p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed">
						{landingContent.hero.subtitle}
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4 pt-4">
						<button
							onClick={handleDirectPage}
							className="bg-accent text-white px-8 py-4 rounded-full text-lg font-medium
              hover:bg-accent-hover transition-all duration-300 hover:scale-105 hover:shadow-xl
              flex items-center gap-2">
							<Rocket size={22} />
							{landingContent.hero.secondary_cta}
						</button>
					</div>
				</section>

				{/* Problem Section */}
				<section className="bg-background rounded-3xl p-8 md:p-12 shadow-sm border border-border">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-primary-text mb-4">
							{landingContent.problem_section.title}
						</h2>
						<p className="text-lg text-text-muted max-w-2xl mx-auto">
							{landingContent.problem_section.description}
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6">
						{landingContent.problem_section.points.map((point, idx) => (
							<div
								key={idx}
								className="bg-surface rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
								<div className="bg-primary-red/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
									<span className="text-2xl">⚠️</span>
								</div>
								<h3 className="text-xl font-semibold text-primary-text mb-2">
									{point.title}
								</h3>
								<p className="text-text-muted">{point.detail}</p>
							</div>
						))}
					</div>
				</section>

				{/* Solution Section */}
				<section className="bg-linear-to-br from-accent/5 to-accent-soft/30 rounded-3xl p-8 md:p-12 border border-accent/20">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-primary-text mb-4">
							{landingContent.solution_section.title}
						</h2>
						<p className="text-lg text-text-muted max-w-2xl mx-auto">
							{landingContent.solution_section.description}
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6">
						{landingContent.solution_section.steps.map((step, idx) => (
							<div
								key={idx}
								className="flex items-start gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6">
								<div className="shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
									{idx + 1}
								</div>
								<p className="text-primary-text text-lg leading-relaxed">
									{step}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Features Section */}
				<section>
					<h2 className="text-3xl md:text-4xl font-bold text-primary-text text-center mb-12">
						{landingContent.features_section.title}
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{landingContent.features_section.features.map((feature) => {
							const icons = {
								resume_analysis: <FileText size={24} />,
								job_scoring: <Target size={24} />,
								ai_chat: <Brain size={24} />,
								requirement_analysis: <TrendingUp size={24} />,
								company_reviews: <Star size={24} />,
							};
							return (
								<div
									key={feature.key}
									className="bg-background rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border hover:border-accent/30 group cursor-pointer">
									<div className="bg-accent-soft w-14 h-14 rounded-2xl flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
										{icons[feature.key as keyof typeof icons] || (
											<Sparkles size={24} />
										)}
									</div>
									<h3 className="text-xl font-semibold text-primary-text mb-2">
										{feature.title}
									</h3>
									<p className="text-text-muted leading-relaxed">
										{feature.description}
									</p>
								</div>
							);
						})}
					</div>
				</section>

				{/* How It Works */}
				<section className="bg-background rounded-3xl p-8 md:p-12 border border-border">
					<h2 className="text-3xl md:text-4xl font-bold text-primary-text text-center mb-12">
						{landingContent.how_it_works.title}
					</h2>
					<div className="relative">
						<div className="hidden md:block absolute top-1/2 start-0 end-0 h-0.5 bg-border -translate-y-1/2"></div>
						<div className="grid md:grid-cols-3 gap-8 relative">
							{landingContent.how_it_works.steps.map((step, idx) => (
								<div
									key={idx}
									className="flex flex-col items-center text-center">
									<div className="relative z-10 w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-accent/30">
										{step.step}
									</div>
									<h3 className="text-xl font-semibold text-primary-text mb-2">
										{step.title}
									</h3>
									<p className="text-text-muted">{step.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Stats Section */}
				<section className="bg-linear-to-br from-accent to-accent-hover rounded-3xl p-8 md:p-12 text-white">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						{landingContent.stats.title}
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{landingContent.stats.items.map((stat) => {
							const icons = {
								total_users: <Users size={32} />,
								total_jobs: <Briefcase size={32} />,
								total_chats: <MessagesSquare size={32} />,
								total_messages: <FileText size={32} />,
							};
							return (
								<div key={stat.key} className="text-center">
									<div className="flex justify-center mb-3 opacity-80">
										{icons[stat.key as keyof typeof icons] || (
											<Sparkles size={32} />
										)}
									</div>
									<p className="text-3xl md:text-4xl font-bold mb-1">
										{stat.value.toLocaleString()}
									</p>
									<p className="text-sm opacity-90">{stat.label}</p>
								</div>
							);
						})}
					</div>
				</section>

				{/* Final CTA */}
				<section className="text-center py-12 space-y-6">
					<h2 className="text-3xl md:text-5xl font-bold text-primary-text">
						{landingContent.final_cta.title}
					</h2>
					<button
						onClick={() =>
							navigate(landingContent.final_cta.secondary_cta_link)
						}
						className="bg-accent text-white px-10 py-5 rounded-full text-xl font-medium
            hover:bg-accent-hover transition-all duration-300 hover:scale-105 hover:shadow-2xl
            flex items-center gap-3 mx-auto shadow-lg shadow-accent/30">
						<MessageCircle size={24} />
						{landingContent.final_cta.secondary_cta}
					</button>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-background border-t border-border mt-16 py-8">
				<div className="max-w-7xl mx-auto px-4 text-center text-text-muted text-sm">
					<p>© 2026 JobAssistant — AI-Powered Career Platform</p>
				</div>
			</footer>
		</div>
	);
}
