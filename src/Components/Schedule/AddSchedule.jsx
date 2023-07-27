import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  DragAndDrop,
  Resize,
  ResourcesDirective,
  ResourceDirective,
} from "@syncfusion/ej2-react-schedule";
import { useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import SaveAssignScreenModal from "./SaveAssignScreenModal";
import { AiOutlineSearch } from "react-icons/ai";
import { BsTags } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import {
  MdDateRange,
  MdKeyboardArrowLeft,
  MdOutlinePermMedia,
} from "react-icons/md";
import { VscCompass } from "react-icons/vsc";
import "../../Styles/schedule.css";

const EventEditor = ({ eventData, onSave, onCancel }) => {
  const [subject, setSubject] = useState(eventData?.Subject || "");
  const [startTime, setStartTime] = useState(
    eventData?.StartTime || new Date().toISOString().slice(0, 16)
  );
  const [endTime, setEndTime] = useState(
    eventData?.EndTime || new Date().toISOString().slice(0, 16)
  );

  const handleSave = () => {
    const updatedEvent = {
      ...eventData,
      Subject: subject,
      StartTime: new Date(startTime),
      EndTime: new Date(endTime),
    };
    onSave(updatedEvent);
  };

  return (
    <div className="pt-6 px-5">
      <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
        Select Assets and Shedule Time
      </h1>

      <div className="grid grid-cols-12 mt-9">
        <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 bg-white shadow-md rounded-lg p-4">
          <div className="mr-5 relative sm:mr-0">
            <AiOutlineSearch className="absolute top-[9px] left-[12px] z-10 text-gray" />
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
          </div>
          <div className="border-b-2 border-[#D5E3FF]"></div>
          <div className="p-3">
            <div className="mb-2">Schedule Date time</div>
            <div>
              <ul className="border-2 border-[#D5E3FF] rounded">
                <li className="border-b-2 border-[#D5E3FF] p-3">
                  <h3>Start Date:</h3>
                  <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                    01 / 06 /2023
                  </div>
                </li>
                <li className="border-b-2 border-[#D5E3FF] p-3">
                  <h3>End Date:</h3>
                  <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                    01 / 06 /2023
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
const AddSchedule = () => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const data = [
    {
      Id: 1,
      Subject: "Playlist Name",
      StartTime: new Date(2023, 6, 26, 1, 0), // Aug 20th, 2023, 6:00 AM
      EndTime: new Date(2023, 6, 26, 3, 30), // Aug 20th, 2023, 7:00 AM
      Location: "Video1",
      ResourceID: 1,
    },
    {
      Id: 2,
      Subject: "Playlist Name",
      StartTime: new Date(2023, 6, 26, 5, 0), // Aug 20th, 2023, 3:00 PM
      EndTime: new Date(2023, 6, 26, 7, 0), // Aug 20th, 2023, 4:00 PM
      Location: "Video2",
      ResourceID: 2,
    },
    {
      Id: 3,
      Subject: "Playlist Name",
      StartTime: new Date(2023, 6, 26, 10, 0), // Aug 20th, 2023, 3:00 PM
      EndTime: new Date(2023, 6, 26, 11, 30), // Aug 20th, 2023, 4:00 PM
      Location: "Video3",
      ResourceID: 3,
    },
  ];
  const resourceDataSource = [
    {
      Name: "Playlist 1",
      Id: 1,
      Color: "#29CC39",
    },
    {
      Name: "Playlist 2",
      Id: 2,
      Color: "#FF6347",
    },
    {
      Name: "Playlist 3",
      Id: 3,
      Color: "#7A29CC",
    },
  ];

  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleEventClick = (args) => {
    setSelectedEvent(args.event.data);
    setShowEditor(true);
  };

  const handleEditorSave = (updatedEvent) => {
    setShowEditor(false);
    setSelectedEvent(null);
    //navigate("/eventedit");
  };

  const handleEditorCancel = () => {
    // Close the editor without saving
    setShowEditor(false);
    setSelectedEvent(null);
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
          <div>
            <Link to="/myschedule">
              <button className="border-2 border-primary rounded-full px-3 py-1">
                save
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-12">
          <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 ">
            <ScheduleComponent
              eventSettings={{ dataSource: data }}
              onEventClick={handleEventClick}
              editorTemplate={(props) => (
                <EventEditor
                  {...props}
                  onSave={handleEditorSave}
                  eventData={selectedEvent}
                  nCancel={handleEditorCancel}
                />
              )}
            >
              <ResourcesDirective>
                <ResourceDirective
                  dataSource={resourceDataSource}
                  field="ResourceID"
                  title="Resource Name"
                  name="Resources"
                  textField="Name"
                  idField="Id"
                  colorField="Color"
                />
              </ResourcesDirective>
              <Inject
                services={[
                  Day,
                  Week,
                  WorkWeek,
                  Month,
                  Agenda,
                  DragAndDrop,
                  Resize,
                ]}
              />
            </ScheduleComponent>

            {/* {showEditor && (
              <EventEditor
                eventData={selectedEvent}
                onSave={handleEditorSave}
                onCancel={handleEditorCancel}
              />
            )} */}
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
