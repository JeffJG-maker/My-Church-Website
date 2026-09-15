import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard';
import Sermons from './components/Sermons';
import MainArea from './components/MainArea';
import './App.css'

const pages = {
    dashboard: {
        component: Dashboard,
        title: "Dashboard",
        description: "Overview of your church platform"
    },
    sermons: {
        component: Sermons,
        title: "Sermons",
        description: "Manage your sermon library"
    }
}

function App() {
    const [activePage, setActivePage] = useState("dashboard");

    const CurrentPage = pages[activePage].component;
    const page = pages[activePage]

    return (
        <>
            <Sidebar activePage={activePage}
                setActivePage={setActivePage}
            />

            <MainArea>
                <CurrentPage />
            </MainArea>
        </>
    );
}

export default App;
