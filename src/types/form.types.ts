export type FormState = {
  label: string;
  amount: string;
  category: string;
  date: string;
  note: string;
};

export const initialState: FormState = {
  label: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};