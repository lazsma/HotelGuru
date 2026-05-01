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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/bookinfo" element={<ReservationInfo />} />
          <Route path="/hotel/:hotelId/rooms" element={<RoomList />} />
          <Route path="/book/:roomId" element={<BookReservation />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<LoginProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/reception" element={<ReceptionDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
