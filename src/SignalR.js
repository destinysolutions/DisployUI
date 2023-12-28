import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { SIGNAL_R } from "./Pages/Api";

export const connection = new HubConnectionBuilder()
  .withUrl(SIGNAL_R)
  .configureLogging(LogLevel.Information)
  .withAutomaticReconnect()
  .build();

if (connection.state == "Disconnected") {
  connection.start().then((res) => {
    console.log("signal connected");
  });
}

connection.on("ScreenConnected", (screenConnected) => {
  console.log("on--------------->", screenConnected);
});

export let TvStatus;
connection.on("TvStatus", (UserID, ScreenID, status) => {
  console.log("status", status);
  var b = document.getElementById("changetvstatus" + ScreenID);
  b.setAttribute(
    "class",
    "rounded-full px-6 py-2 text-white text-center " +
      (status == true ? "bg-[#3AB700]" : "bg-[#FF0000]")
  );
  b.textContent = status == true ? "Live" : "offline";
  TvStatus = status == true ? "Live" : "Offline";
});
