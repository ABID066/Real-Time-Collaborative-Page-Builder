import React from 'react';
import {useDarkMode} from "./hooks/useDarkMode.js";
import {PageProvider} from "./context/PageProvider.jsx";
import Header from "./components/Header.jsx";
import PageBuilder from "./components/PageBuilder.jsx";

const Page = () => {
    const isDarkMode = useDarkMode();
    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <PageProvider>
                <Header/>
                <PageBuilder/>
            </PageProvider>
        </div>
    );
};

export default Page;