import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { ListContainer } from "./style";

export interface Transaction {
  id: string;
  amount: number;
  type: string;
}

export const Transactions = () => {
  const [allTransaction, setAlltransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllTransaction = async () => {
    try {
      const response = await api.get("/payments");

      setAlltransaction(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ListContainer>
          <ul>
            <h2>Tipo</h2>
            {allTransaction.map((transaction) => (
              <p key={transaction.id}>
                {transaction.type === "credit" ? "Crédito" : "Débito"}
              </p>
            ))}
          </ul>
          <ul>
            <h2>Valor</h2>
            {allTransaction.map((transaction) => (
              <p key={transaction.id}>{transaction.amount}</p>
            ))}
          </ul>
        </ListContainer>
      )}
    </>
  );
};
