import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundMusic from "@/components/BackgroundMusic";
import LandingPage from "@/pages/LandingPage";
import MarketplacePage from "@/pages/MarketplacePage";
import TemplateDetailsPage from "@/pages/TemplateDetailsPage";
import DashboardPage from "@/pages/DashboardPage";
import EditorPage from "@/pages/EditorPage";
import ViewWebsitePage from "@/pages/ViewWebsitePage";
import NotFoundPage from "@/pages/NotFoundPage";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [pathname]);
    return null;
}

import ErrorBoundary from "@/components/ErrorBoundary";

function Shell({ children, hideFooter = false }) {
    return (
        <div className="relative z-[2]">
            <Navbar />
            <main>{children}</main>
            {!hideFooter && <Footer />}
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <div className="App">
                <BrowserRouter>
                    <ScrollToTop />
                    {/* Global Sleek Ambient Music Player */}
                    <BackgroundMusic />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Shell>
                                <LandingPage />
                            </Shell>
                        }
                    />
                    <Route
                        path="/templates"
                        element={
                            <Shell>
                                <MarketplacePage />
                            </Shell>
                        }
                    />
                    <Route
                        path="/templates/:slug"
                        element={
                            <Shell>
                                <TemplateDetailsPage />
                            </Shell>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <Shell>
                                <DashboardPage />
                            </Shell>
                        }
                    />
                    <Route
                        path="/dashboard/websites/:slug/edit"
                        element={
                            <Shell hideFooter>
                                <EditorPage />
                            </Shell>
                        }
                    />
                    {/* Dynamic View Route for Customized Partner Websites */}
                    <Route path="/v/:shareId" element={<ViewWebsitePage />} />
                    <Route path="/v" element={<ViewWebsitePage />} />

                    <Route
                        path="*"
                        element={
                            <Shell>
                                <NotFoundPage />
                            </Shell>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    </ErrorBoundary>
);
}

export default App;