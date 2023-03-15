import "./App.css";
import { Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Search from "./components/Search";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="/search" element={<Search />} />
      </Route>
    </Routes>
  );
}

export default App;
