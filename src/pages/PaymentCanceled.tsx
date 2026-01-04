import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <XCircle className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold">Payment Canceled</h1>
        <p className="text-muted-foreground">
          Your payment was canceled. No charges were made.
        </p>
        <Button onClick={() => navigate("/")} variant="outline" className="w-full">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default PaymentCanceled;
