import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Step1_SelectShowtime from "./Step1_SelectShowtime";
import Step2_SelectSeat from "./Step2_SelectSeat";
import Step3_Checkout from "./Step3_Checkout";

const SellTicketWizard = () => {
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    movie: null,
    showtime: null,
    seats: [],
    totalPrice: 0,
  });

  useEffect(() => {
    if (location.state?.preSelected) {
      setBookingData({
        movie: location.state.preSelected.movie,
        showtime: location.state.preSelected.showtime,
        seats: [],
        totalPrice: 0,
      });

      setCurrentStep(2);
    }
  }, [location.state]);

  const handleNextStep = (stepData) => {
    setBookingData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setBookingData({
      movie: null,
      showtime: null,
      seats: [],
      totalPrice: 0,
    });

    setCurrentStep(1);
  };

  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 space-y-6">
      <div className="rounded-2xl p-4 flex justify-between items-center px-12 shrink-0 min-w-0 overflow-x-auto scrollbar-hide shadow-lg border border-white/[0.06] bg-[#131A2A]/80">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-3 shrink-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 shrink-0 ${
                currentStep === step
                  ? "bg-[#FFB000] text-slate-950 shadow-[0_0_15px_rgba(255,176,0,0.3)] scale-105"
                  : currentStep > step
                    ? "bg-[#FFB000]/10 border border-[#FFB000]/30 text-[#FFB000]"
                    : "bg-slate-800/40 border border-white/5 text-slate-500"
              }`}
            >
              {step}
            </div>

            <span
              className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                currentStep >= step ? "text-[#FFB000]" : "text-slate-500"
              }`}
            >
              {step === 1
                ? "Chọn Suất"
                : step === 2
                  ? "Chọn Ghế"
                  : "Thanh Toán"}
            </span>

            {step < 3 && (
              <div
                className={`w-16 h-[2px] mx-4 hidden md:block shrink-0 rounded-full transition-all duration-300 ${
                  currentStep > step
                    ? "bg-[#FFB000]"
                    : "bg-white/10"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 min-w-0">
        {currentStep === 1 && <Step1_SelectShowtime onNext={handleNextStep} />}

        {currentStep === 2 && (
          <Step2_SelectSeat
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            bookingData={bookingData}
          />
        )}

        {currentStep === 3 && (
          <Step3_Checkout
            bookingData={bookingData}
            onPrev={handlePrevStep}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default SellTicketWizard;
