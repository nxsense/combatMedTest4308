import {
    Route,
    Routes,
} from 'react-router-dom'

import ScenariosPage from './pages/ScenariosPage'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import TestsPage from './pages/TestsPage'
import PracticalPage from './pages/PracticalPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {

    return (
        <Routes>

            <Route
                path="/"
                element={<LoginPage />}
            />

            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />

            </Route>
            <Route
                path="/scenarios"
                element={<ScenariosPage />}
            />

            <Route
                path="/tests"
                element={<TestsPage />}
            />

            <Route
                path="/practical"
                element={<PracticalPage />}
            />

            <Route
                path="/analytics"
                element={<AnalyticsPage />}
            />
        </Routes>
    )
}

export default App