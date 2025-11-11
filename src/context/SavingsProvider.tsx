import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

// ----- Types -----
export type SavingsGoal = {
  amount: number;
  durationMonths: number;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  type: "daily" | "monthly";
  photoUrl?: string;
};

type UserMetadata = {
  savingsGoal?: SavingsGoal;
  expenses?: Expense[];
};

type SavingsContextType = {
  goal: SavingsGoal | null;
  expenses: Expense[];
  saveGoal: (goal: SavingsGoal) => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
};

// ----- Context -----
const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // ----- Load goal and expenses from Clerk unsafeMetadata -----
  useEffect(() => {
    if (!user) return;

    const metadata = user.unsafeMetadata as UserMetadata;

    if (metadata.savingsGoal) setGoal(metadata.savingsGoal);
    else setGoal(null);

    if (metadata.expenses) setExpenses(metadata.expenses);
    else setExpenses([]);
  }, [user]);

  // ----- Save goal -----
  const saveGoal = async (newGoal: SavingsGoal) => {
    if (!user) return;

    const metadata = user.unsafeMetadata as UserMetadata;

    try {
      await user.update({
        unsafeMetadata: {
          ...metadata,
          savingsGoal: newGoal,
        },
      });
      setGoal(newGoal);
    } catch (err) {
      console.error("Failed to save goal:", err);
    }
  };

  // ----- Add expense -----
  const addExpense = async (expense: Expense) => {
    if (!user) return;

    const updated = [...expenses, expense];
    setExpenses(updated);
    localStorage.setItem(`expenses_${user.id}`, JSON.stringify(updated));

    // Save to Clerk unsafeMetadata
    const metadata = user.unsafeMetadata as UserMetadata;
    try {
      await user.update({
        unsafeMetadata: {
          ...metadata,
          expenses: updated,
        },
      });
    } catch (err) {
      console.error("Failed to save expenses:", err);
    }

    // ----- Budget alerts -----
    if (goal) {
      const monthlyLimit = goal.amount / goal.durationMonths;
      const dailyLimit = monthlyLimit / 30;

      const monthlySpent = updated
        .filter((e) => e.type === "monthly")
        .reduce((sum, e) => sum + e.amount, 0);

      const dailySpent = updated
        .filter((e) => e.type === "daily")
        .reduce((sum, e) => sum + e.amount, 0);

      if (monthlySpent > monthlyLimit) alert("⚠️ Exceeding monthly budget!");
      if (dailySpent > dailyLimit) alert("⚠️ Exceeding daily budget!");
    }
  };

  // ----- Remove expense -----
  const removeExpense = async (id: string) => {
    if (!user) return;

    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    localStorage.setItem(`expenses_${user.id}`, JSON.stringify(updated));

    const metadata = user.unsafeMetadata as UserMetadata;
    try {
      await user.update({
        unsafeMetadata: {
          ...metadata,
          expenses: updated,
        },
      });
    } catch (err) {
      console.error("Failed to remove expense:", err);
    }
  };

  return (
    <SavingsContext.Provider
      value={{ goal, expenses, saveGoal, addExpense, removeExpense }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

// ----- Hook -----
export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) throw new Error("useSavings must be used inside SavingsProvider");
  return context;
};
