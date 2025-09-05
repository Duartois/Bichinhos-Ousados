import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function Notification({ message, type = "error", onClose }) {
  const colors = {
    error: "from-red-100 to-red-50 border-red-300 text-red-700",
    success: "from-green-100 to-green-50 border-green-300 text-green-700",
    warning: "from-yellow-100 to-yellow-50 border-yellow-300 text-yellow-700",
    info: "from-cyan-100 to-cyan-50 border-cyan-300 text-cyan-700",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto max-w-lg flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${colors[type]} border shadow-lg z-[9999]`}
        >
          <AlertTriangle size={20} />
          <p className="flex-1 text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-2 text-sm font-semibold hover:opacity-70"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
