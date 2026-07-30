import React from "react";
import { Heart, RotateCcw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0e060b] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="p-4 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300">
            <Heart size={32} className="animate-pulse fill-rose-400 text-rose-400" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">
            Something went wrong while displaying this page
          </h2>
          <p className="text-sm text-stone-400 max-w-md italic">
            Don't worry, your data is safe! Click refresh below to reload the experience.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
