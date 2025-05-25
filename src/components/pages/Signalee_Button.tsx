import { useState } from "react";
import { signaleePartner } from "@/app/services/partnerService";

interface SignaleeButtonProps {
  partnerId: number;
}

const SignaleeButton: React.FC<SignaleeButtonProps> = ({ partnerId }) => {
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignalee = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await signaleePartner(partnerId);
      setReported(true);
      setMessage("Partner reported successfully.");
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
        "An error occurred. Please try again."
      );
      if (err.response?.status === 409) setReported(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className={`px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition ${
          reported ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSignalee}
        disabled={reported || loading}
      >
        {reported ? "Already Reported" : "Signalee"}
      </button>
      {message && (
        <div className="mt-2 text-sm text-red-600">{message}</div>
      )}
    </div>
  );
};

export default SignaleeButton;