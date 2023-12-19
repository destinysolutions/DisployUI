import { FilePicker } from "@apideck/file-picker";
import React, { useState } from "react";

const OtherOptionsForAssets = () => {
  const [selectedService, setSelectedService] = useState(null);

  const session_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb25zdW1lcl9pZCI6InRlc3QtY29uc3VtZXIiLCJhcHBsaWNhdGlvbl9pZCI6IlpLZmlsM1JYejVzc0JkalhxVWdZeTBLSEtZbTE0TTVjWExxVWciLCJzY29wZXMiOltdLCJpYXQiOjE3MDI5NjIwNTIsImV4cCI6MTcwMjk2NTY1Mn0.F7JYhGywIoFCF0so2odsI4TcP0Rjb9b3idf7FH3wmX4";
  const handleSelect = async (file) => {
    // setFile(file);
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
        token={session_token}
        title="Choose file from options"
        showAttribution={false}
        onConnectionSelect={(e) => {
          // console.log(e);
          setSelectedService(e?.service_id);
        }}
      />
    </div>
  );
};

export default OtherOptionsForAssets;
