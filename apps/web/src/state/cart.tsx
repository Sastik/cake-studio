import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type CartState = {
  lines: CartLine[];
  notes: string;
  customRequest: {
    occasion: string;
    flavors: string;
    size: string;
    budget: string;
    date: string;
    message: string;
  };
};

type CartAction =
  | { type: "add"; line: Omit<CartLine, "qty">; qty?: number }
  | { type: "remove"; id: string }
  | { type: "inc"; id: string }
  | { type: "dec"; id: string }
  | { type: "clear" }
  | { type: "setNotes"; notes: string }
  | { type: "setCustom"; key: keyof CartState["customRequest"]; value: string };

const STORAGE_KEY = "cake_web_cart_v1";

function load(): CartState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CartState;
  } catch {
    return null;
  }
}

function save(state: CartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const initial: CartState = {
  lines: [],
  notes: "",
  customRequest: {
    occasion: "",
    flavors: "",
    size: "",
    budget: "",
    date: "",
    message: "",
  },
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.lines.find((l) => l.id === action.line.id);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.id === action.line.id ? { ...l, qty: l.qty + qty } : l,
          ),
        };
      }
      return { ...state, lines: [...state.lines, { ...action.line, qty }] };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };
    case "inc":
      return {
        ...state,
        lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty: l.qty + 1 } : l)),
      };
    case "dec":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.id === action.id ? { ...l, qty: Math.max(1, l.qty - 1) } : l))
          .filter((l) => l.qty > 0),
      };
    case "clear":
      return { ...state, lines: [] };
    case "setNotes":
      return { ...state, notes: action.notes };
    case "setCustom":
      return { ...state, customRequest: { ...state.customRequest, [action.key]: action.value } };
    default:
      return state;
  }
}

type CartApi = {
  lines: CartLine[];
  notes: string;
  customRequest: CartState["customRequest"];
  totalItems: number;
  subtotal: number;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  setNotes: (notes: string) => void;
  setCustom: (key: keyof CartState["customRequest"], value: string) => void;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial, () => load() ?? initial);

  useEffect(() => {
    save(state);
  }, [state]);

  const api = useMemo<CartApi>(() => {
    const subtotal = state.lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    const totalItems = state.lines.reduce((sum, l) => sum + l.qty, 0);
    return {
      lines: state.lines,
      notes: state.notes,
      customRequest: state.customRequest,
      subtotal,
      totalItems,
      add: (line, qty) => dispatch({ type: "add", line, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      inc: (id) => dispatch({ type: "inc", id }),
      dec: (id) => dispatch({ type: "dec", id }),
      clear: () => dispatch({ type: "clear" }),
      setNotes: (notes) => dispatch({ type: "setNotes", notes }),
      setCustom: (key, value) => dispatch({ type: "setCustom", key, value }),
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
