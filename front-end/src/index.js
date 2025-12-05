import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import InstagramUI from "./InstagramUI";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
        {/*<InstagramUI />*/}
    </React.StrictMode>
);