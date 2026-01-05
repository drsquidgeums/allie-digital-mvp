import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <XCircle className="h-16 w-16 mx-auto" style={{ color: '#6b7280' }} />
        <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Payment Canceled</h1>
        <p style={{ color: '#6b7280' }}>
          Your payment was canceled. No charges were made.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          variant="outline" 
          className="w-full"
          style={{ borderColor: '#d1d5db', color: '#000000' }}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default PaymentCanceled;
