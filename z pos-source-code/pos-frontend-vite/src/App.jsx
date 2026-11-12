import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

// Lazy-loaded route bundles for maximum performance & code splitting
const AuthRoutes = lazy(() => import("./routes/AuthRoutes"));
const StoreRoutes = lazy(() => import("./routes/StoreRoutes"));
const BranchManagerRoutes = lazy(() => import("./routes/BranchManagerRoutes"));
const CashierRoutes = lazy(() => import("./routes/CashierRoutes"));
const SuperAdminRoutes = lazy(() => import("./routes/SuperAdminRoutes"));

import { getUserProfile } from "./Redux Toolkit/features/user/userThunks";
import Landing from "./pages/common/Landing/Landing";
import Onboarding from "./pages/onboarding/Onboarding";
import { getStoreByAdmin } from "./Redux Toolkit/features/store/storeThunks";
import PageNotFound from "./pages/common/PageNotFound";
import PaymentSuccess from "./pages/common/PaymentSuccess";

const App = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  const { store } = useSelector((state) => state.store);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserProfile(jwt));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userProfile && userProfile.role === "ROLE_STORE_ADMIN") {
      dispatch(getStoreByAdmin(userProfile.jwt));
    }
  }, [dispatch, userProfile]);

  let content;

  // console.log("state ", user)

  if (userProfile && userProfile.role) {
    // User is logged in
    if (userProfile.role === "ROLE_ADMIN") {
      content = (
        <Routes>
          <Route path="/" element={<Navigate to="/super-admin" replace />} />
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          <Route
            path="*"
            element={<PageNotFound/>}
          />
        </Routes>
      );
    } else if (userProfile.role === "ROLE_BRANCH_CASHIER") {
      content = (
        <Routes>
          <Route path="/" element={<Navigate to="/cashier" replace />} />
          <Route path="/cashier/*" element={<CashierRoutes />} />
          <Route
            path="*"
            element={<PageNotFound/>}
          />
        </Routes>
      );
    } else if (
      userProfile.role === "ROLE_STORE_ADMIN" ||
      userProfile.role === "ROLE_STORE_MANAGER"
    ) {
      // console.log("get inside", store);
      if (!store) {
        // console.log("get inside 1");
        content = (
          <Routes>
            <Route path="/auth/onboarding" element={<Onboarding />} />
            <Route
              path="*"
              element={<PageNotFound/>}
            />
          </Routes>
        );
        return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background space-y-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading POS workspace...</p>
        </div>
      }
    >
      {content}
    </Suspense>
  );
      } else {
        // console.log("get inside 2");
        content = (
          <Routes>
            <Route path="/" element={<Navigate to="/store" replace />} />
            <Route path="/store/*" element={<StoreRoutes />} />
            <Route path="/booking-success/:id" element={<PaymentSuccess />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route
              path="*"
              element={<PageNotFound/>}
            />
          </Routes>
        );
      }
    } else if (
      userProfile.role === "ROLE_BRANCH_MANAGER" ||
      userProfile.role === "ROLE_BRANCH_ADMIN"
    ) {
      content = (
        <Routes>
          <Route path="/" element={<Navigate to="/branch" replace />} />
          <Route path="/branch/*" element={<BranchManagerRoutes />} />
          <Route
            path="*"
            element={<PageNotFound/>}
          />
        </Routes>
      );
    } else {
      // Unknown role, redirect to landing or error page
      content = (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="*"
            element={ <PageNotFound/>}
          />
        </Routes>
      );
    }
  } else {
    // User is not logged in, show landing page and auth routes
    content = (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/booking-success/:id" element={<PaymentSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route
          path="*"
          element={
          <PageNotFound/>
          }
        />
      </Routes>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background space-y-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading POS workspace...</p>
        </div>
      }
    >
      {content}
    </Suspense>
  );
};

export default App;
