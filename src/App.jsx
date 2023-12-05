import { Provider } from "react-redux";
import Routing from "./Routing/Routing";
import store from "./Redux/store";
// import Toaster from 'reho'
import { Toaster } from "react-hot-toast";
import { useIdleTimer } from "react-idle-timer";
import { useEffect } from "react";
import { auth } from "./FireBase/firebase";

const App = () => {
  let interval;

  const onIdle = () => {
    clearInterval(interval);
    auth.signOut();
    window.location.href = "/";
    window.localStorage.clear("timer");
    localStorage.setItem("role_access", "");
    window.location.reload();
  };
  var { start, getRemainingTime, isIdle } = useIdleTimer({
    onIdle,
    // startManually: true,
    // startOnMount: false,
    timeout: 18_00_000,
    throttle: 500,
    stopOnIdle: true,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
      "focus",
    ],
  });

  const loggedInUser = JSON.parse(window.localStorage.getItem("user"));
  const timer = JSON.parse(window.localStorage.getItem("timer"));

  // for timer
  useEffect(() => {
    if (!isIdle()) {
      if (loggedInUser !== null && timer) {
        interval = setInterval(() => {
          window.localStorage.setItem(
            "timer",
            JSON.stringify(Math.ceil(getRemainingTime() / 1000))
            );
          }, 1000);
        } else if (loggedInUser && timer < 18_00_000) {
        start();
        interval = setInterval(() => {
          window.localStorage.setItem(
            "timer",
            JSON.stringify(Math.ceil(getRemainingTime() / 1000))
          );
        }, 1000);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [loggedInUser]);

  // when user enter first time after login
  useEffect(() => {
    if (loggedInUser && timer === 18_00_000) {
      start();
    }
  }, [loggedInUser]);


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
