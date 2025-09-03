import { Routes, Route, Navigate } from "react-router-dom";
import AnnouncementsList from "./pages/AnnouncementsList";
import AnnouncementDetail from "./pages/AnnouncementDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AnnouncementsList />} />
      <Route path="/announcement/:id" element={<AnnouncementDetail />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

