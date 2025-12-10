import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./provider/PrivateRoute";
import FeedPage from "./pages/FeedPage";
import UploadPage from "./pages/UploadPage";
import SignupPage from "./pages/SignupPage";
import StoryUploadPage from "./pages/StoryUploadPage";
import MyFeedPage from "./pages/MyFeedPage";
import StoryDetail from "./pages/StoryDetail";


function App() {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if(savedUser && token) {
            return JSON.parse(savedUser);
        }
        return null;
    })

    return (
        <div>
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
                    <Route
                        path="/story/detail/:userId"
                        element={
                            <PrivateRoute>
                                <StoryDetail/>
                            </PrivateRoute>}
                    />
                    <Route path="/upload"
                           element={
                               <PrivateRoute>
                                   <UploadPage/>
                               </PrivateRoute>
                           }
                    />
                    <Route
                        path="/story/upload"
                        element={
                            <PrivateRoute>
                                <StoryUploadPage/>
                            </PrivateRoute>}
                    />

                    <Route
                        path="/myfeed"
                        element={<PrivateRoute>
                            <MyFeedPage/>
                        </PrivateRoute>}
                    />

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;