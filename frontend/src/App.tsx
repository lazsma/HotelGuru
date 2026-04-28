import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BookReservation from "./pages/BookReservation";
import HotelList from "./pages/HotelList";
import RoomList from "./pages/RoomList";

// TODO: replace with real user data from authentication
const user = {
  name: "John Doe",
  profileImage: "https://i.pravatar.cc/100"
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotel/:hotelId/rooms" element={<RoomList />} />
          <Route path="/book/:roomId" element={<BookReservation />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
