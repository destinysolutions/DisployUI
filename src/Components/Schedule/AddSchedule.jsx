import { useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import SaveAssignScreenModal from "./SaveAssignScreenModal";
import { AiOutlineSearch } from "react-icons/ai";
import { BsTags } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { MdDateRange, MdOutlinePermMedia } from "react-icons/md";
import { VscCompass } from "react-icons/vsc";
import "../../Styles/schedule.css";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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
} from "@devexpress/dx-react-scheduler-material-ui";
import { useEffect } from "react";
const SHIFT_KEY = 16;
const ExternalViewSwitcher = ({ currentViewName, onChange }) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: "row" }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    <FormControlLabel
      value="Day"
      control={<Radio />}
      label="Day"
      className="border-r border-primary mr-0 w-24 text-center"
    />
    <FormControlLabel
      value="Week"
      control={<Radio />}
      label="Week"
      className="border-r border-primary mr-0 w-24 text-center"
    />

    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);

const AddSchedule = () => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [data, setData] = useState([
    {
      title: "Website Re-Design Plan",
      startDate: new Date(2023, 7, 1, 9, 30),
      endDate: new Date(2023, 7, 1, 11, 30),
    },
    {
      title: "Book Flights to San Fran for Sales Trip",
      startDate: new Date(2023, 7, 1, 12, 0),
      endDate: new Date(2023, 7, 1, 13, 0),
    },
    {
      title: "Install New Router in Dev Room",
      startDate: new Date(2023, 6, 31, 14, 30),
      endDate: new Date(2023, 6, 31, 15, 30),
    },
  ]);
  const [currentViewName, setCurrentViewName] = useState("Day");

  const handleCurrentViewNameChange = (newViewName) => {
    setCurrentViewName(newViewName);
  };

  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.keyCode === SHIFT_KEY) {
        setIsShiftPressed(true);
      }
    };

    const onKeyUp = (event) => {
      if (event.keyCode === SHIFT_KEY) {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const commitChanges = ({ added, changed, deleted }) => {
    setData((prevData) => {
      let updatedData = [...prevData];
      if (added) {
        const startingAddedId =
          prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 0;
        updatedData = [...prevData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        if (isShiftPressed) {
          const changedAppointment = prevData.find(
            (appointment) => changed[appointment.id]
          );
          const startingAddedId =
            prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 0;
          updatedData = [
            ...prevData,
            {
              ...changedAppointment,
              id: startingAddedId,
              ...changed[changedAppointment.id],
            },
          ];
        } else {
          updatedData = prevData.map((appointment) =>
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment
          );
        }
      }
      if (deleted !== undefined) {
        updatedData = prevData.filter(
          (appointment) => appointment.id !== deleted
        );
      }
      return updatedData;
    });
  };
  const CustomFormTemplate = ({ children, appointmentData, onFieldChange }) => {
    return (
      <div className="pt-6 px-5">
        <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
          Select Assets and Shedule Time
        </h1>

        <div className="grid grid-cols-12 mt-9">
          <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 bg-white shadow-md rounded-lg p-4">
            <div className="mr-5 relative sm:mr-0">
              <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
              <input
                type="text"
                placeholder=" Search by Name"
                className="border border-primary rounded-full px-7 py-2 search-user"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="mt-9 w-full sm:mt-3">
                <thead>
                  <tr className="flex justify-between items-center">
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <MdOutlinePermMedia className="mr-2 text-xl" />
                        Assets
                      </button>
                    </th>
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <MdDateRange className="mr-2 text-xl" />
                        Date Added
                      </button>
                    </th>
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <GrSchedules className="mr-2 text-xl" />
                        Associated Schedule
                      </button>
                    </th>
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <VscCompass className="mr-2 text-xl" />
                        orientation
                      </button>
                    </th>

                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                        <BsTags className="mr-2 text-xl" />
                        Tags
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                    <td className="py-2">Assets Name 1</td>
                    <td className="py-2">25 May 2023</td>
                    <td className="break-words	w-[150px] py-2">
                      Schedule Name Till 28 June 2023
                    </td>
                    <td className="py-2">0</td>

                    <td className="py-2">Tags, Tags</td>
                  </tr>
                  <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                    <td className="py-2">Assets Name 2</td>
                    <td className="py-2">25 May 2023</td>
                    <td className="break-words	w-[150px] py-2">
                      Schedule Name Till 28 June 2023
                    </td>
                    <td className="py-2">90</td>

                    <td className="py-2">Tags, Tags</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" bg-white shadow-md ml-5 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 ">
            <div className="p-3">
              <span className="text-xl">Assets Name</span>
              <input
                value={appointmentData.title}
                onChange={(e) => onFieldChange({ title: e.target.value })}
              />
            </div>
            <div className="border-b-2 border-[#D5E3FF]"></div>
            <div className="p-3">
              <div className="mb-2">Schedule Date time</div>
              <div>
                <ul className="border-2 border-[#D5E3FF] rounded">
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>Start Date:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      {/* 01 / 06 /2023 */}
                      <input
                        type="datetime-local"
                        value={appointmentData.startDate}
                        onChange={(e) =>
                          onFieldChange({ startDate: new Date(e.target.value) })
                        }
                      />
                    </div>
                  </li>
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>End Date:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      {/* 01 / 06 /2023 */}
                      <input
                        type="datetime-local"
                        value={appointmentData.endDate}
                        onChange={(e) =>
                          onFieldChange({ endDate: new Date(e.target.value) })
                        }
                      />
                    </div>
                  </li>
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>Start Time:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      04:00 PM
                    </div>
                  </li>
                  <li className=" p-3">
                    <h3>End Time:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      04:00 PM
                    </div>
                  </li>
                </ul>
              </div>
              {children}
              <div className="p-3">
                <div>Repeat Multiple Day</div>

                <div className="flex justify-between">
                  <label>Repeat</label>
                  <input type="checkbox" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex items-center pb-5">
            <h1 className="text-xl font-semibold">Create Schedule</h1>
            <button className="ml-3 text-sm">
              <BsPencilFill />
            </button>
          </div>
          {/* <div>
            <Link to="/myschedule">
              <button className="border-2 border-primary rounded-full px-3 py-1">
                save
              </button>
            </Link>
          </div> */}
        </div>

        <div className="grid grid-cols-12">
          <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 ">
            <Paper>
              <Scheduler data={data} height={700}>
                <ViewState
                  defaultCurrentDate="2023-07-28"
                  currentViewName={currentViewName}
                />
                <WeekView startDayHour={10} endDayHour={19} />
                <DayView />
                <EditingState onCommitChanges={commitChanges} />
                <IntegratedEditing />
                <MonthView />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <div className="flex justify-end absolute top-2 right-0 border border-primary rounded-3xl px-2">
                  <ExternalViewSwitcher
                    currentViewName={currentViewName}
                    onChange={(e) =>
                      handleCurrentViewNameChange(e.target.value)
                    }
                  />
                </div>
                <EditRecurrenceMenu />
                <Appointments />
                <AppointmentTooltip
                  showCloseButton
                  showOpenButton
                  contentComponent={({ onFieldChange, appointmentData }) => (
                    <CustomFormTemplate
                      onFieldChange={onFieldChange}
                      appointmentData={appointmentData}
                    />
                  )}
                />

                {/* Use Template to provide the custom form editor */}
                {/* <Template name="appointmentForm">
            {({ onFieldChange, appointmentData }) => (
              <CustomFormEditor
                onFieldChange={onFieldChange}
                appointmentData={appointmentData}
              />
            )}
          </Template> */}

                {/* Pass the template to the AppointmentForm */}
                <AppointmentForm formTemplate="appointmentForm" />
                <DragDropProvider />
              </Scheduler>
            </Paper>
          </div>
          <div className=" bg-white shadow-md ml-5 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 ">
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
