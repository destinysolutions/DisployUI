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
import { connection } from "./SignalR";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

// export const socket = io.connect("http://108.166.190.137:3002");
export const socket = io.connect("https://disploysocket.thedestinysolutions.com");
// export const socket = io.connect("http://192.168.1.117:3002");

// export const socket = io.connect("http://localhost:3002");

const App = () => {
  console.log('socket', socket)
  const [timer, setTimer] = useState(0);

  const { user, token, loading } = useSelector((state) => state.root.auth);
  console.log('user', user)
  const dispatch = useDispatch();

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
    if (user !== null && timer == 1800) {
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
    if (user !== null) {
      dispatch(handleGetUserDetails({ id: user?.userID, token }));
    }
  }, [user]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('ScreenConnected', (data) => {
      console.log('Received data from server:', data);
      // var b = document.getElementById(`changetvstatus${data.macId}`);
      // b.setAttribute(
      //   "class",
      //   "rounded-full px-6 py-2 text-white text-center " +
      //     (data?.connection === true ? "bg-[#3AB700]" : "bg-[#FF0000]")
      // );
      // b.textContent = data?.connection === true ? "Live" : "offline";
    });

    socket.on('SendTvStatus', (data) => {
      console.log('Received TV status from server:', data);
      // Handle TV status data if needed
      var b = document.getElementById(`changetvstatus${data?.macId}`);
      b.setAttribute(
        "class",
        "rounded-full px-6 py-2 text-white text-center " +
        (data?.connection === true ? "bg-[#3AB700]" : "bg-[#FF0000]")
      );
      b.textContent = data?.connection === true ? "Live" : "offline";
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



  useEffect(() => {
    if (connection.state == "Disconnected") {
      connection.start().then((res) => {
        console.log("signal connected");
      });
    }
    console.log(connection.state);

    // return () => {
    //   if (connection.state === "Connected") {
    //     connection
    //       .stop()
    //       .then(() => {
    //         console.log("Connection stopped");
    //       })
    //       .catch((error) => {
    //         console.error("Error stopping connection:", error);
    //       });
    //   }
    // };
  }, [connection]);

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
      <Routing />
    </>
  );
};

export default App;
