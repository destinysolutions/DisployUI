import { Provider } from "react-redux";
import Routing from "./Routing/Routing";
import store from "./Redux/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Routing />
      </Provider>
    </>
  );
};

export default App;
