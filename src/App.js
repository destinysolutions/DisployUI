import { useDispatch, useSelector } from "react-redux";
import Routing from "./Routing/Routing";
// import Toaster from 'reho'
import { Toaster } from "react-hot-toast";
import { useIdleTimer } from "react-idle-timer";
import { useEffect } from "react";
import { auth } from "./FireBase/firebase";
import { useState } from "react";
import { handleLogout } from "./Redux/Authslice";

const App = () => {
  const [timer, setTimer] = useState(0);

  const { user } = useSelector((state) => state.root.auth);

  const dispatch = useDispatch();

  let interval;

  const onIdle = () => {
    clearInterval(interval);
    auth.signOut();
    dispatch(handleLogout());
    // window.location.href = window.location.origin;
    // window.localStorage.clear("timer");
    // localStorage.setItem("role_access", "");
    // window.location.reload();
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
      if (user !== null && timer) {
        interval = setInterval(() => {
          window.localStorage.setItem(
            "timer",
            JSON.stringify(Math.ceil(getRemainingTime() / 1000))
          );
        }, 1000);
      }
      if (user !== null && timer < 1800) {
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
  }, [user, timer]);

  // when user enter first time after login
  useEffect(() => {
    if (user !== null && timer == 1800) {
      start();
    }
  }, [user, timer]);

  useEffect(() => {
    // const user = JSON.parse(window.localStorage.getItem("user"));
    const TIMER = JSON.parse(window.localStorage.getItem("timer"));
    // setLoggedInUser(user);
    setTimer(TIMER);
  }, []);

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
      <Routing />
    </>
  );
};

export default App;
