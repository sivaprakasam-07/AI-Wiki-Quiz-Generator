import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                success: {
                    duration: 3000,
                    style: {
                        background: '#10b981',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10b981',
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: '#ef4444',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#ef4444',
                    },
                },
            }}
        />
        <App />
    </React.StrictMode>
);

