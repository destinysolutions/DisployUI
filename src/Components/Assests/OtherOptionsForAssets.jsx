import { FilePicker } from "@apideck/file-picker";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleChangeSessionToken } from "../../Redux/globalStates";

const OtherOptionsForAssets = () => {
  const [selectedService, setSelectedService] = useState(null);
  const { session_token_apideck } = useSelector(
    (state) => state.root.globalstates
  );

  const dispatch = useDispatch();

  const session_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb25zdW1lcl9pZCI6InRlc3QtY29uc3VtZXIiLCJhcHBsaWNhdGlvbl9pZCI6IlpLZmlsM1JYejVzc0JkalhxVWdZeTBLSEtZbTE0TTVjWExxVWciLCJzY29wZXMiOltdLCJpYXQiOjE3MDM3NDM3NTEsImV4cCI6MTcwMzc0NzM1MX0.ntkj1ho2Z7H3rOw8dkn9l-xXDXxWcEa12Uf5OEaletA";
  function checkTokenExpire() {
    const decodeTime = jwtDecode(session_token);
    const currentTimestamp = moment().unix();
    const currentMoment = moment.unix(currentTimestamp);
    const givenMoment = moment.unix(decodeTime?.exp);

    // Get the difference in milliseconds
    const differenceInMilliseconds = givenMoment.diff(currentMoment);

    // Convert the difference to minutes
    const differenceInMinutes = moment
      .duration(differenceInMilliseconds)
      .asMinutes();

    let checkExpireOrNot = parseInt(differenceInMinutes).toFixed(2) > 0;
    if (
      (checkExpireOrNot && session_token_apideck !== null) ||
      session_token_apideck === null
    ) {
      return dispatch(handleChangeSessionToken(session_token));
    } else if (session_token_apideck !== null && !checkExpireOrNot) {
      return console.log("call create session api");
    }
  }
  useEffect(() => {
    console.log(checkTokenExpire());
  });

  const handleSelect = async (file) => {
    console.log(file);
    // try {
    //   const { data } = await axios.get(
    //     `https://unify.apideck.com/file-storage/files/${file?.id}/download`,
    //     {
    //       headers: {
    //         Authorization:
    //           "Bearer sk_live_18c615f7-b6cd-4ac0-8f3e-b7fd465c511d-z0CYU6dhwX12IO8qUg-f3e8f762-4f83-47e0-a264-5b012b253aca",
    //         "x-apideck-consumer-id": "test-consumer",
    //         "x-apideck-app-id": "ZKfil3RXz5ssBdjXqUgYy0KHKYm14M5cXLqUg",
    //         "x-apideck-service-id": selectedService,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   // console.log(data);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div>
      <FilePicker
        onSelect={handleSelect}
        trigger={
          <button>
            {/* <img src={Onedrive} className="w-9" /> */}
            More options
          </button>
        }
        token={session_token_apideck}
        title="Choose file from options"
        showAttribution={false}
        onConnectionSelect={(e) => {
          setSelectedService(e?.service_id);
        }}
      />
    </div>
  );
};

export default OtherOptionsForAssets;
