import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { SIGNAL_R } from "./Pages/Api";

export const connection = new HubConnectionBuilder()
  .withUrl(SIGNAL_R)
  .configureLogging(LogLevel.Information)
  .withAutomaticReconnect()
  .build();
