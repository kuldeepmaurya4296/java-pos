import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getUserProfile } from "@/Redux Toolkit/features/user/userThunks";
import { getStoreByAdmin } from "@/Redux Toolkit/features/store/storeThunks";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const subscriptionId = params.id || searchParams.get("subscriptionId");
  const razorpayPaymentId = searchParams.get("razorpay_payment_id");

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserProfile(jwt));
      dispatch(getStoreByAdmin(jwt));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center shadow-lg border">
        <CardHeader className="flex flex-col items-center space-y-2">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your subscription has been activated successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptionId && (
            <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Reference ID:</span> #{subscriptionId}
            </div>
          )}
          {razorpayPaymentId && (
            <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Transaction ID:</span> {razorpayPaymentId}
            </div>
          )}
          <Button
            className="w-full mt-4"
            onClick={() => navigate("/store")}
          >
            Go to Store Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

