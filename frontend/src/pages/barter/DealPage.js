// frontend/src/pages/barter/DealPage.js

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DealPage from "./pages/barter/DealPage";
import UserBarterDeals from "./pages/barter/UserBarterDeals";

<Routes>
    <Route path="/barter" element={<UserBarterDeals />} />
    <Route path="/barter/deal/:id" element={<DealPage />} />
</Routes>
