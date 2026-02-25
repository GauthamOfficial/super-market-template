import { TrackOrderForm } from "./TrackOrderForm";

export const metadata = {
  title: "Track order",
  description: "Track your order status",
};

export default function OrderTrackPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-2 sm:px-0">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold sm:text-2xl">Track your order</h1>
        <p className="text-muted-foreground">
          Enter your order number and phone number to see status.
        </p>
      </div>
      <TrackOrderForm />
    </div>
  );
}
