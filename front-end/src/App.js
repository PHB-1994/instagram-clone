import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import PrivateRoute from "./provider/PrivateRoute";
import SignupPage from "./pages/SignupPage";
import StoryUploadPage from "./pages/StoryUploadPage";
import MyFeedPage from "./pages/MyFeedPage";
import StoryDetail from "./pages/StoryDetail";

function App() {
    return (
        <div>
            {/* TODO: Router 설정을 완성하세요 */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/feed"
                           element={
                               <PrivateRoute>
                                   <FeedPage/>
                               </PrivateRoute>}
                    />
                    <Route path="/upload"
                           element={
                               <PrivateRoute>
                                   <UploadPage/>
                               </PrivateRoute>}
                    />
                    <Route path="/story/upload"
                           element={
                               <PrivateRoute>
                                   <StoryUploadPage/>
                               </PrivateRoute>
                           }
                    />
                    <Route path="/myfeed"
                           element={
                               <PrivateRoute>
                                   <MyFeedPage/>
                               </PrivateRoute>}
                    />
                    <Route path="/story/detail"
                           element={
                               <PrivateRoute>
                                   <StoryDetail/>
                               </PrivateRoute>}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;