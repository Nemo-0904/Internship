import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToHash';
import { CartProvider } from './context/cartContext';
import Cart from './components/Cart';
import Chatbot from './components/Chatbot';
// import RobotLabPage from "./pages/RobotLabPage";
import BlogPage from "./pages/BlogPage";
import ThreeDPrintingHub from './pages/ThreeDPrintingHub';
import ContactPage from './pages/ContactPage';
import RobotLabPageIntegrate from './pages/RobotLabPageIntegrate';

// Pages (Lazy load for performance)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const PaymentSuccessPage = React.lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentCancelledPage = React.lazy(() => import('./pages/PaymentCancelledPage'));

// Styles
import './styles/global.css';
import './styles/CollapsibleSection.css';
import './styles/UrdfUploader.css';
import './styles/CameraView.css';
import './styles/VideoRecorder.css';
import './styles/RobotJointControls.css';
import './styles/UrdfRobotModel.css';
// import './styles/RobotLabPageIntegrate.css';
import './styles/LeftControlPanel.css';
import './styles/MediaPipeController.css';
import './styles/ThreeDPrintingHub.css';
import './styles/ContactPage.css';


function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Authentication check (using localStorage)
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <ScrollToTop />
            <CartProvider>
                <div className="flex flex-col min-h-screen overflow-y-auto">
                    <Navbar onShowCartClick={() => setIsCartOpen(true)} className="flex-none" />

                    <div className="flex-grow">
                        <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                {/* ✅ Pass the function to open the cart to the ProductsPage */}
                                <Route
                                    path="/products"
                                    element={<ProductsPage onShowCartClick={() => setIsCartOpen(true)} />}
                                />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/success" element={<PaymentSuccessPage />} />
                                <Route path="/cancel" element={<PaymentCancelledPage />} />
                                <Route path="/blogs" element={<BlogPage />} />
                                <Route path="/3d-printing-hub" element={<ThreeDPrintingHub />} />
                                <Route path="/contact" element={<ContactPage />} />
                                {/* <Route
                                    path="/robot-lab"
                                    element={
                                        isAuthenticated ? (
                                            <RobotLabPage />
                                        ) : (
                                            <Navigate to="/login" replace />
                                        )
                                    }
                                /> */}
                                <Route
                                    path="/robot-lab"
                                    element={
                                        isAuthenticated ? (
                                            <RobotLabPageIntegrate />
                                        ) : (
                                            <Navigate to="/login" replace />
                                        )
                                    }
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Suspense>
                    </div>

                    <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                    <Chatbot />
                </div>
            </CartProvider>
        </Router>
    );
}

export default App;
