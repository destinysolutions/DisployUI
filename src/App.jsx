import { Provider } from "react-redux";
import Routing from "./Routing/Routing";
import store from "./Redux/store";
// import Toaster from 'reho'
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <>
      <Provider store={store}>
        <Toaster toastOptions={{ duration: 4000 }} />
        <Routing />
      </Provider>
    </>
  );
};

export default App;
