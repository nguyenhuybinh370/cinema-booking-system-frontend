import { useState } from "react";
import Step1_SelectShowtime from "./Step1_SelectShowtime";
// import Step2_SelectSeat from './Step2_SelectSeat';
// import Step3_Checkout from './Step3_Checkout';

const SellTicketWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    movie: null,
    showtime: null,
    seats: [],
    totalPrice: 0,
  });

  // Hàm chuyển bước và lưu dữ liệu
  const handleNextStep = (stepData) => {
    setBookingData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Thanh tiến trình (Stepper) */}
      <div className="glass-effect rounded-2xl p-4 flex justify-between items-center px-10">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                currentStep >= step
                  ? "bg-[var(--btn-neon)] text-slate-900 shadow-[0_0_15px_rgba(253,224,71,0.5)]"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {step}
            </div>
            <span
              className={`text-sm font-semibold uppercase tracking-wider ${
                currentStep >= step ? "text-glow text-white" : "text-white/40"
              }`}
            >
              {step === 1
                ? "Chọn Suất"
                : step === 2
                  ? "Chọn Ghế"
                  : "Thanh Toán"}
            </span>
            {step < 3 && (
              <div className="w-16 h-px bg-white/20 mx-4 hidden md:block"></div>
            )}
          </div>
        ))}
      </div>

      {/* Khu vực render nội dung từng bước */}
      <div className="flex-1">
        {currentStep === 1 && <Step1_SelectShowtime onNext={handleNextStep} />}
        {currentStep === 2 && (
          <div className="glass-effect p-10 rounded-2xl text-center">
            <h2 className="text-2xl text-glow mb-4">
              Bước 2: Sơ đồ ghế (Đang cập nhật)
            </h2>
            <button className="btn-bright" onClick={handlePrevStep}>
              Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellTicketWizard;
