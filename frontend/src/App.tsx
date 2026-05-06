import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BookReservation from "./pages/BookReservation";
import HotelList from "./pages/HotelList";
import RoomList from "./pages/RoomList";
import ReservationInfo from "./pages/ReservationInfo";
import ReceptionDashboard from './pages/ReceptionDashboard';
import LoginProtectedRoute from "./components/LoginProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import RegisterPage from "./pages/RegisterPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/bookinfo" element={<ReservationInfo />} />
          
          <Route path="/hotel/:hotelId/rooms" element={<RoomList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<LoginProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route element={<RoleProtectedRoute allowedRoles={["Receptionist"]} />}>
              <Route path="/reception" element={<ReceptionDashboard />} />
            </Route>
            <Route path="/book/:roomId" element={<BookReservation />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
