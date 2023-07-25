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
import { Link } from "react-router-dom";
import SaveAssignScreenModal from "./SaveAssignScreenModal";

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
  // Event handler to access the Schedule event data
  // const onActionBegin = (args) => {
  //   if (args.requestType === "eventCreate") {
  //     // New event is being created
  //     console.log("New event data:", args.data); // The newly added event data will be logged here
  //     const eventsInLocalStorage =
  //       JSON.parse(localStorage.getItem("events")) || [];
  //     eventsInLocalStorage.push(args.data);
  //     localStorage.setItem("events", JSON.stringify(eventsInLocalStorage));
  //   } else if (args.requestType === "eventChange") {
  //     // Event is being edited/updated
  //     console.log("Updated event data:", args.data); // The updated event data will be logged here
  //   } else if (args.requestType === "eventRemove") {
  //     // Event is being deleted
  //     console.log("Deleted event data:", args.data); // The deleted event data will be logged here
  //   }
  // };
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
              //actionBegin={onActionBegin}
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
                ></ResourceDirective>
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
