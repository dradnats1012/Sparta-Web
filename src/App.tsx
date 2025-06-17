// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import LocalStorePage from "./pages/LocalStorePage";

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/library" style={{ marginRight: "1rem" }}>
            도서관
          </Link>
          <Link to="/local-stores">지역화폐 가맹점</Link>
        </nav>
        <Routes>
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/local-stores" element={<LocalStorePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;