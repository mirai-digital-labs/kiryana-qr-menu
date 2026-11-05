import { Suspense, lazy } from "react";
import { CartProvider } from "./cart";
import { DataProvider } from "./data";
import { Spinner, Toaster } from "./components/ui";
import { usePath } from "./router";
import { CategoryPage, Home } from "./features/customer/Home";
import { CartPage, CheckoutPage } from "./features/customer/Checkout";
import { DonePage, TrackPage } from "./features/customer/OrderStatus";

// Admin alag chunk mein, taake customer ka page halka rahe
const AdminApp = lazy(() => import("./features/admin/AdminApp").then((m) => ({ default: m.AdminApp })));

export default function App() {
  const path = usePath();

  if (path === "/admin" || path.startsWith("/admin/")) {
    return (
      <Suspense fallback={<Spinner />}>
        <AdminApp />
        <Toaster />
      </Suspense>
    );
  }

  let page = <Home />;
  let m: RegExpMatchArray | null;
  if ((m = path.match(/^\/c\/([^/]+)/))) page = <CategoryPage id={m[1]} />;
  else if (path === "/cart") page = <CartPage />;
  else if (path === "/checkout") page = <CheckoutPage />;
  else if ((m = path.match(/^\/done\/([^/]+)/))) page = <DonePage id={m[1]} />;
  else if ((m = path.match(/^\/order\/([^/]+)/))) page = <TrackPage id={m[1]} />;

  return (
    <DataProvider>
      <CartProvider>
        {page}
        <Toaster />
      </CartProvider>
    </DataProvider>
  );
}
