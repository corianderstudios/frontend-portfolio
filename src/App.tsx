import { BrowserRouter, Routes, Route } from "react-router";
import ProductDetailsPage from "./components/ProductDetailsPage.tsx";
import ProductContainer from "./components/ProductContainer.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductContainer />} />
        <Route
          path="/products/:productId"
          element={<ProductDetailsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
