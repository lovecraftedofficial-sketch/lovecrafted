import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundMusic from "./components/BackgroundMusic";
import FloatingHearts from "./components/FloatingHearts";
import LandingPage from "./pages/LandingPage";
import MarketplacePage from "./pages/MarketplacePage";
import TemplateDetailsPage from "./pages/TemplateDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import FeedbackPage from "./pages/FeedbackPage";
import EditorPage from "./pages/EditorPage";
import TemplateEditor from "./pages/TemplateEditor";
import ViewWebsitePage from "./pages/ViewWebsitePage";
import NotFoundPage from "./pages/NotFoundPage";

import ErrorBoundary from "./components/ErrorBoundary";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [pathname]);
    return null;
}

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
            <div className="App relative bg-[#0a0507] min-h-screen">
                <BrowserRouter>
                    <ScrollToTop />
                    <BackgroundMusic />
                    <FloatingHearts />

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
                            path="/marketplace"
                            element={
                                <Shell>
                                    <MarketplacePage />
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
                            path="/templates/:id"
                            element={
                                <Shell>
                                    <TemplateDetailsPage />
                                </Shell>
                            }
                        />
                        <Route
                            path="/editor/:id"
                            element={<TemplateEditor />}
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
                            path="/feedback"
                            element={
                                <Shell>
                                    <FeedbackPage />
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
