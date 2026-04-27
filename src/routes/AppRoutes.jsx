import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import GoalList from "../pages/GoalList";
import GoalCreate from "../pages/GoalCreate";
import GoalDetails from "../pages/GoalDetails";
import Archive from "../pages/Archive";
import Calendar from "../pages/Calendar";
import Categories from "../pages/Categories";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/layout/ProtectedRoute";
import GoalEdit from "../pages/GoalEdit";
import SearchPage from "../pages/SearchPage";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<GoalList />} />
        <Route path="/goals/new" element={<GoalCreate />} />
        <Route path="/goals/:id" element={<GoalDetails />} />
        <Route path="/goals/edit/:id" element={<GoalEdit/>} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
