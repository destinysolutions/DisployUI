import { Provider } from "react-redux";
import Routing from "./Routing/Routing";
import store from "./Redux/store";
// import Toaster from 'reho'
import { Toaster } from "react-hot-toast";
import { useIdleTimer } from "react-idle-timer";
import { useEffect } from "react";
import { auth } from "./FireBase/firebase";
import { useState } from "react";

const App = () => {
  const [timer, setTimer] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
  let interval;

  const onIdle = () => {
    clearInterval(interval);
    auth.signOut();
    window.location.href = window.location.origin;
    window.localStorage.clear("timer");
    localStorage.setItem("role_access", "");
    window.location.reload();
  };

  var { start, getRemainingTime, isIdle } = useIdleTimer({
    onIdle,
    startManually: true,
    startOnMount: false,
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
      }
      if (loggedInUser !== null && timer < 1800) {
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
  }, [loggedInUser, timer]);

  // when user enter first time after login
  useEffect(() => {
    if (loggedInUser !== null && timer == 1800) {
      start();
    }
  }, [loggedInUser, timer]);

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const TIMER = JSON.parse(window.localStorage.getItem("timer"));
    setLoggedInUser(user);
    setTimer(TIMER);
  }, []);

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
