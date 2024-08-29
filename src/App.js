import { useDispatch, useSelector } from "react-redux";
import Routing from "./Routing/Routing";
// import Toaster from 'reho'
import toast, { Toaster } from "react-hot-toast";
import { useIdleTimer } from "react-idle-timer";
import { useEffect } from "react";
import { auth } from "./FireBase/firebase";
import { useState } from "react";
import { handleGetUserDetails, handleLogout } from "./Redux/Authslice";
import {
  handleChangeNavigateFromComposition,
  handleGetAllScheduleTimezone,
  handleNavigateFromCompositionChannel,
} from "./Redux/globalStates";
import io from "socket.io-client";
import { isValidToken } from "./Components/Common/Util";

// export const socket = io.connect("http://108.166.190.137:3002");
export const socket = io.connect("https://disploysocket.disploy.com");
// export const socket = io.connect("http://192.168.1.117:3002");

// export const socket = io.connect("http://localhost:3002");

const App = () => {
  const [timer, setTimer] = useState(0);
  const { user, token, loading, userDetails } = useSelector((state) => state.root.auth);
  const dispatch = useDispatch();

  // console.log('socket', socket)
  // console.log('userDetails', userDetails)
  // console.log('user', user)

  useEffect(() => {
    dispatch(handleNavigateFromCompositionChannel());
    return () => {
      dispatch(handleNavigateFromCompositionChannel());
    };
  }, []);
  let interval;

  const onIdle = () => {
    clearInterval(interval);
    dispatch(handleLogout());
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
      "unload",
      "load",
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
    if (user !== null && timer === 1800) {
      start();
    }
  }, [user, timer]);

  useEffect(() => {
    if (user !== null) {
      dispatch(handleGetAllScheduleTimezone({ token }));
    }
    const TIMER = JSON.parse(window.localStorage.getItem("timer"));
    setTimer(TIMER);
  }, [user]);

  useEffect(() => {
    if (user !== null && user?.role !== "1" && isValidToken(token)) {
      dispatch(handleGetUserDetails({ id: user?.userID, token }));
    }
  }, [user]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('ScreenConnected', (data) => {
      // console.log('Received data from server:', data);
      // var b = document.getElementById(`changetvstatus${data.macId}`);
      // b.setAttribute(
      //   "class",
      //   "rounded-full px-6 py-2 text-white text-center " +
      //     (data?.connection === true ? "bg-[#3AB700]" : "bg-[#FF0000]")
      // );
      // b.textContent = data?.connection === true ? "Live" : "offline";
    });

    socket.on('SendTvStatus', (data) => {
      // console.log('Received TV status from server:', data);
      // Handle TV status data if needed
      var b = document.getElementById(`changetvstatus${data?.macId}`);
      if (b !== null) {
        b.setAttribute(
          "class",
          "rounded-full px-6 py-2 text-white text-center " +
          (data?.connection === true ? "bg-[#3AB700]" : "bg-[#FF0000]")
        );
        b.textContent = data?.connection === true ? "Live" : "offline";
      }
      // TvStatus = data?.connection == true ? "Live" : "Offline";

      // If you want to disconnect after receiving TV status, uncomment the line below
      // socket.disconnect();
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
      socket.emit("OnDisconnectedAsync", socket.id);
      socket.emit("SendTvStatus", socket.id)
    };
  }, [socket]);

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
      <Routing />
    </>
  );
};

export default App;
