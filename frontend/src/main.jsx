import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/CollapsibleSection.css';
import './styles/UrdfUploader.css';
import './styles/CameraView.css';
import './styles/VideoRecorder.css';
import './styles/RobotJointControls.css'; 
import './styles/UrdfRobotModel.css';
import './styles/RobotLabPage.css'; 
import './styles/LeftControlPanel.css';
import './styles/MediaPipeController.css';
import './styles/ThreeDPrintingHub.css'; 
import './styles/ContactPage.css';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// ✅ Correct way (consistent with filename: CartContext.jsx)
import { CartProvider } from './context/cartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CartProvider> {/* ✅ WRAP HERE */}
    <App />
  </CartProvider>
);
