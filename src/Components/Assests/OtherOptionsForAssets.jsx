import { FilePicker } from "@apideck/file-picker";
import "@apideck/file-picker/dist/styles.css";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  handelGetSessionToken,
  handleChangeSessionToken,
} from "../../Redux/globalStates";
import { handelPostImageFromDrive } from "../../Redux/Assetslice";
import toast from "react-hot-toast";

const OtherOptionsForAssets = ({ handleSelect }) => {
  const [selectedService, setSelectedService] = useState(null);
  const { session_token_apideck, tokenLoading } = useSelector(
    (state) => state.root.globalstates
  );
  const { token } = useSelector((state) => state.root.auth);
  const { imageUploadLoading } = useSelector((state) => state.root.asset);

  const dispatch = useDispatch();
  const popUpRef = useRef(null);

  function checkTokenExpire() {
    if (session_token_apideck === null) {
      return dispatch(handelGetSessionToken());
    } else if (session_token_apideck !== null) {
      const decodeToken = jwtDecode(session_token_apideck);
      const currentTimestamp = moment().unix();
      const currentMoment = moment.unix(currentTimestamp);
      const givenMoment = moment.unix(decodeToken?.exp);

      // Get the difference in milliseconds
      const differenceInMilliseconds = givenMoment.diff(currentMoment);

      // Convert the difference to minutes
      const differenceInMinutes = moment
        .duration(differenceInMilliseconds)
        .asMinutes();

      let checkExpireOrNot = parseInt(differenceInMinutes).toFixed(2) > 0;
      if (checkExpireOrNot && session_token_apideck !== null) {
        return dispatch(handleChangeSessionToken(session_token_apideck));
      } else if (session_token_apideck !== null && !checkExpireOrNot) {
        console.log("expire token recall");
        return dispatch(handelGetSessionToken());
      }
    }
  }
  useEffect(() => {
    checkTokenExpire();
  });

  // const handleSelect = async (file) => {
  //   toast.loading("Uploading...");
  //   const res = dispatch(
  //     handelPostImageFromDrive({
  //       serviceId: selectedService,
  //       imageId: file?.id,
  //       imageName: file?.name,
  //       token,
  //       fileSizeInBytes: file?.size,
  //     })
  //   );
  //   if (res) {
  //     res.then((data) => {
  //       if (data?.payload?.status == true) {
  //         toast.success("Image uploaded successfully.");
  //       }
  //       toast.remove();
  //     });
  //   }
  // };

  const handleOnchangeFile = (file) => {
    // console.log(file);
    handleSelect(
      selectedService,
      file?.id,
      file?.name,
      file?.size,
      file?.mime_type
    );
  };

  return (
    <div>
      {tokenLoading ? (
        <div>...</div>
      ) : (
        <div>
        <FilePicker
          onSelect={handleOnchangeFile}
          trigger={<button>More options</button>}
          token={session_token_apideck}
          title="Choose file from options"
          showAttribution={false}
          onConnectionSelect={(e) => {
            setSelectedService(e?.service_id);
          }}
          subTitle={tokenLoading ? "Loading..." : ""}
          ref={popUpRef}
        />
        </div>
      )}
    </div>
  );
};

export default OtherOptionsForAssets;
