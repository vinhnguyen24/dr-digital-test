import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import AbeListPage from "./pages/AbeListPage";
// import './styles/main.scss';

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, background: "#d9d9d9" }}>
        <AbeListPage />
      </main>
    </div>
  );
}

export default App;
