import { useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import SaveAssignScreenModal from "./SaveAssignScreenModal";
import "../../Styles/schedule.css";
import Paper from "@mui/material/Paper";
import {
  EditingState,
  IntegratedEditing,
  ViewState,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  MonthView,
  Appointments,
  DayView,
  Toolbar,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  EditRecurrenceMenu,
  Resources,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import EventEditor from "./EventEditor";

const AddSchedule = () => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [data, setData] = useState([
    {
      id: 1,
      title: "Website Re-Design Plan",
      startDate: new Date(2023, 7, 1, 9, 30),
      endDate: new Date(2023, 7, 1, 11, 30),
      location: "Office A",
      asset: "Asset 1",
    },
    {
      id: 2,
      title: "Book Flights to San Fran for Sales Trip",
      startDate: new Date(2023, 7, 1, 12, 0),
      endDate: new Date(2023, 7, 1, 13, 0),
      location: "Office B",
      asset: "Asset 2",
    },
    {
      id: 3,
      title: "Install New Router in Dev Room",
      startDate: new Date(2023, 7, 1, 14, 30),
      endDate: new Date(2023, 7, 1, 15, 30),
      location: "Office C",
      asset: "Asset 3",
    },
    {
      id: 4,
      title: "Install Router in Dev Room",
      startDate: new Date(2023, 6, 31, 14, 30),
      endDate: new Date(2023, 6, 31, 15, 30),
      location: "Office D",
      asset: "Asset 4",
    },
  ]);

  const assetResource = {
    fieldName: "asset",
    title: "Asset",
    instances: [
      { id: "Asset 1", text: "Asset 1", color: "#ff5722" },
      { id: "Asset 2", text: "Asset 2", color: "#e91e63" },
      { id: "Asset 3", text: "Asset 3", color: "#ff9800" },
      { id: "Asset 4", text: "Asset 4", color: "#b2ff59" },
    ],
  };
  const resources = [
    {
      fieldName: "location",
      title: "Location",
      instances: [
        { id: "Office A", text: "Office A", color: "#4fc3f7" },
        { id: "Office B", text: "Office B", color: "#cddc39" },
        { id: "Office C", text: "Office C", color: "#ff9800" },
        { id: "Office D", text: "Office D", color: "#b2ff59" },
      ],
    },
    assetResource,
  ];
  const [currentViewName, setCurrentViewName] = useState("Day");

  const handleCurrentViewNameChange = (newViewName) => {
    setCurrentViewName(newViewName);
  };

  const commitChanges = ({ added, changed, deleted }) => {
    setData((prevData) => {
      let updatedData = [...prevData];
      if (added) {
        const startingAddedId =
          prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 0;
        updatedData = [...prevData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        updatedData = updatedData.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        updatedData = updatedData.filter(
          (appointment) => appointment.id !== deleted
        );
      }
      return updatedData;
    });
  };
  const handleFieldChange = (changes) => {
    // Handle changes to the appointmentData here
    // For example, you can update the state or send the changes to the server
    console.log("Field changes:", changes);
  };
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex items-center mt-5">
            <h1 className="text-xl font-semibold">Create Schedule</h1>
            <button className="ml-3 text-sm">
              <BsPencilFill />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 mt-5">
          <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 ">
            <Paper>
              <Scheduler data={data} height={700}>
                <ViewState
                  currentViewName={currentViewName}
                  onCurrentViewNameChange={handleCurrentViewNameChange}
                />
                <WeekView startDayHour={10} endDayHour={19} />
                <DayView />
                <EditingState onCommitChanges={commitChanges} />
                <IntegratedEditing />
                <MonthView />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
                <EditRecurrenceMenu />
                <Appointments />
                <AppointmentTooltip
                  showCloseButton
                  showOpenButton
                  showDeleteButton
                  // contentComponent={({ onFieldChange, appointmentData }) => (
                  //   <EventEditor
                  //     onFieldChange={onFieldChange}
                  //     appointmentData={appointmentData}
                  //   />
                  // )}
                  contentComponent={(props) => (
                    <EventEditor {...props} onFieldChange={handleFieldChange} />
                  )}
                />
                <AppointmentForm />
                <Resources data={resources} />
                <DragDropProvider />
              </Scheduler>
            </Paper>
          </div>
          <div className=" bg-white shadow-2xl lg:ml-5 md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 lg:mt-0 md:mt-0 sm:mt-3 xs:mt-3 ">
            <div className="p-3">
              <span className="text-xl">Schedule Name</span>
            </div>
            <div className="border-b-2 border-[#D5E3FF]"></div>
            <div className="p-3">
              <div className="mb-2">Schedule Date time</div>
              <div>
                <ul className="border-2 border-[#D5E3FF] rounded">
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>Start Date & Time:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>End Date & Time:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className="p-3">
                    <select className="w-full">
                      <option>Associated Assets</option>
                      <option> Assets Name 1</option>
                      <option> Assets Name 2</option>
                      <option> Assets Name 3</option>
                    </select>
                  </li>
                </ul>
              </div>
              <div className="flex mt-4">
                <div className="mt-1">
                  <button>
                    <IoArrowBackOutline />
                  </button>
                </div>
                <p className="mx-3">
                  No Associated Assets start by select date & time on calendar.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <Link to="/myschedule">
            <button className="border-2 border-primary  px-5 py-2 rounded-full">
              Cancel
            </button>{" "}
          </Link>
          <Link to="/myschedule">
            <button className="border-2 border-primary  px-6 py-2 rounded-full ml-3">
              Save
            </button>
          </Link>
          <button
            className="border-2 border-primary  px-4 py-2 rounded-full ml-3"
            onClick={() => setSelectScreenModal(true)}
          >
            Save & Assign screen
          </button>
          {selectScreenModal && (
            <SaveAssignScreenModal
              setSelectScreenModal={setSelectScreenModal}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AddSchedule;
