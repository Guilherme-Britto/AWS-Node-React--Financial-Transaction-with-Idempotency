import { Transactions } from "../components/Transactions";
import { HomeStyle } from "./style";

export const Home = () => {
  return (
    <HomeStyle>
      <header>
        <h1>Transações</h1>
      </header>
      <main>
        <Transactions />
      </main>
    </HomeStyle>
  );
};
