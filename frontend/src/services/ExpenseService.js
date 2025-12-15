import axios from "axios";

const API_URL = "http://localhost:8080/expense";

export const getAllExpenses = async () => {
  return axios.get(API_URL);
};

export async function addExpense(expense) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Failed: " + response.status);
  }

  return response.json();
}

export const updateExpense = (id, expense) => {
  return axios.put(`${API_URL}/${id}`, expense);
};

export const deleteExpense = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const getExpenseByMonth = (year, month) => {
  return axios.get(`${API_URL}/month/${year}/${month}`);
};

export const getCurrentMonthExpenses = () => {
  return axios.get(`${API_URL}/month/current`);
};
