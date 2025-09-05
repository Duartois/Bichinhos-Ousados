import { createContext, useContext, useState, useCallback } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({
        open: true,
        message,
        onConfirm: () => {
          resolve(true);
          setState((s) => ({ ...s, open: false }));
        },
        onCancel: () => {
          resolve(false);
          setState((s) => ({ ...s, open: false }));
        },
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={state.open}
        message={state.message}
        onConfirm={state.onConfirm}
        onCancel={state.onCancel}
      />
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
