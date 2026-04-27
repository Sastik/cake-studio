import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { RedirectIfAuthed, RequireAuthLayout } from "./components/auth/RequireAuth";
import ShellLayout from "./components/ShellLayout";
import AuthShellLayout from "./components/auth/AuthShellLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CustomCakePage = lazy(() => import("./pages/CustomCakePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderStatusPage = lazy(() => import("./pages/OrderStatusPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AuthShellLayout />}>
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuthed>
                <SignupPage />
              </RedirectIfAuthed>
            }
          />
        </Route>

        <Route element={<ShellLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cakes" element={<ProductsPage />} />

          <Route element={<RequireAuthLayout />}>
            <Route path="/cakes/:id" element={<ProductDetailsPage />} />
            <Route path="/custom" element={<CustomCakePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders/:id" element={<OrderStatusPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
