import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { addToCart } from "@/Redux Toolkit/features/cart/cartSlice";
import { syncOfflineOrders } from "@/utils/offlinePOS";

// Import components
import POSHeader from "./components/POSHeader";
import ProductSection from "./product/ProductSection";
import CartSection from "./cart/CartSection";
import CustomerPaymentSection from "./payment/CustomerPaymentSection";

import PaymentDialog from "./payment/PaymentDialog";
import ReceiptDialog from "./components/ReceiptDialog";
import HeldOrdersDialog from "./components/HeldOrdersDialog";
import CustomerDialog from "./customer/CustomerDialog";
import InvoiceDialog from "./order/OrderDetails/InvoiceDialog";

const CreateOrderPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const searchInputRef = useRef(null);

  const { error: orderError } = useSelector((state) => state.order);
  const { products } = useSelector((state) => state.product);

  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showHeldOrdersDialog, setShowHeldOrdersDialog] = useState(false);

  // Hardware Barcode Scanner Listener
  useBarcodeScanner({
    onScan: (barcode) => {
      if (!products || products.length === 0) return;
      const foundProduct = products.find(
        (p) =>
          p.sku === barcode ||
          (p.sku && p.sku.toLowerCase() === barcode.toLowerCase()) ||
          p.name.toLowerCase() === barcode.toLowerCase()
      );
      if (foundProduct) {
        dispatch(addToCart(foundProduct));
        toast({
          title: "Scanned & Added",
          description: `${foundProduct.name} - ₹${foundProduct.sellingPrice}`,
        });
      } else {
        toast({
          title: "Barcode Not Found",
          description: `No product matching SKU: ${barcode}`,
          variant: "destructive",
        });
      }
    },
  });

  // Offline Order Synchronization Listener
  useEffect(() => {
    const handleOnline = () => {
      syncOfflineOrders((syncedCount) => {
        toast({
          title: "Offline Orders Synced",
          description: `Successfully uploaded ${syncedCount} queued order(s) to cloud.`,
        });
      });
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [toast]);

  useEffect(() => {
    if (orderError) {
      toast({
        title: "Order Error",
        description: orderError,
        variant: "destructive",
      });
    }
  }, [orderError, toast]);

  // Focus on search input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <POSHeader />

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Product Search & List */}
        <ProductSection searchInputRef={searchInputRef} />

        {/* Middle Column - Cart */}
        <CartSection setShowHeldOrdersDialog={setShowHeldOrdersDialog} />

        {/* Right Column - Customer & Payment */}
        <CustomerPaymentSection
          setShowCustomerDialog={setShowCustomerDialog}
          setShowPaymentDialog={setShowPaymentDialog}
        />
      </div>

      <CustomerDialog
        showCustomerDialog={showCustomerDialog}
        setShowCustomerDialog={setShowCustomerDialog}
      />

      <PaymentDialog
        showPaymentDialog={showPaymentDialog}
        setShowPaymentDialog={setShowPaymentDialog}
        setShowReceiptDialog={setShowReceiptDialog}
      />

      {/* <ReceiptDialog
        showReceiptDialog={showReceiptDialog}
        setShowReceiptDialog={setShowReceiptDialog}
      /> */}
      <InvoiceDialog
        showInvoiceDialog={showReceiptDialog}
        setShowInvoiceDialog={setShowReceiptDialog}
        
      />

      <HeldOrdersDialog
        showHeldOrdersDialog={showHeldOrdersDialog}
        setShowHeldOrdersDialog={setShowHeldOrdersDialog}
      />
    </div>
  );
};

export default CreateOrderPage;
