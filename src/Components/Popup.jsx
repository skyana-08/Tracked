import Close from '../assets/Cross(Light).svg';

export default function Popup({ 
  setOpen, 
  message = "Are you sure you want to Archive this Account?", 
  confirmText = "Confirm", 
  buttonColor = "#00A15D", 
  hoverColor = "#00874E" 
}) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/40 z-50 text-[1.125rem]">
      <div className="bg-white rounded-lg shadow-lg w-120 p-5 relative flex flex-col items-center text-center">

        {/* Close Button */}
        <button onClick={() => setOpen(false)} className="absolute top-5 right-5">
          <img src={Close} alt="Close Pop up" className="cursor-pointer" />
        </button>

        {/* Dynamic Message */}
        <div className="text-[#465746] mb-4 mt-7">
          {message}
        </div>

        {/* Confirm Button */}
        <button 
          className="text-white font-bold px-4 py-2 rounded-md w-50 h-12"
          style={{ backgroundColor: buttonColor }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonColor}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

