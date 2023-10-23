import React from "react";

const TextScrollDetail = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <div className="p-5 page-contain">
        <div className="lg:flex lg:justify-between sm:block items-center">
          <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 flex items-center ">
            New Instance Name
            <span className="ml-3">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.49916 4.44517L7.55482 3.50082L1.33552 9.72014V10.6645H2.27987L8.49916 4.44517ZM9.44351 3.50082L10.3879 2.55646L9.44351 1.61211L8.49916 2.55646L9.44351 3.50082ZM2.83306 12H0V9.16697L8.97134 0.195585C9.23216 -0.0651949 9.65492 -0.0651949 9.91568 0.195585L11.8044 2.08429C12.0652 2.34507 12.0652 2.76786 11.8044 3.02864L2.83306 12Z"
                  fill="#001737"
                />
              </svg>
            </span>
          </h1>
          <div className="flex items-center">
            <button className="flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
              Preview
            </button>
            <button className="flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 mx-3 text-base sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
              Save
            </button>
            <button className="mr-3">
              <svg
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="22.5"
                  cy="22.5"
                  r="21.5"
                  stroke="#00072E"
                  strokeWidth="2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 22.5C18 23.8807 16.8807 25 15.5 25C14.1193 25 13 23.8807 13 22.5C13 21.1193 14.1193 20 15.5 20C16.8807 20 18 21.1193 18 22.5ZM25 22.5C25 23.8807 23.8807 25 22.5 25C21.1193 25 20 23.8807 20 22.5C20 21.1193 21.1193 20 22.5 20C23.8807 20 25 21.1193 25 22.5ZM29.5 25C30.8807 25 32 23.8807 32 22.5C32 21.1193 30.8807 20 29.5 20C28.1193 20 27 21.1193 27 22.5C27 23.8807 28.1193 25 29.5 25Z"
                  fill="#00072E"
                />
              </svg>
            </button>
            <button className="">
              <svg
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="22.5"
                  cy="22.5"
                  r="21.5"
                  stroke="#00072E"
                  strokeWidth="2"
                />
                <path
                  d="M29.7074 15.2923C29.3179 14.9026 28.6859 14.9026 28.2964 15.2923L22.5 21.089L16.7031 15.2923C16.3136 14.9026 15.6816 14.9026 15.2921 15.2923C14.9026 15.6818 14.9026 16.3135 15.2921 16.7033L21.0891 22.5003L15.2921 28.2969C14.9026 28.6864 14.9026 29.3181 15.2921 29.7079C15.6816 30.0974 16.3136 30.0974 16.7031 29.7079L22.4997 23.9109L28.2964 29.7076C28.6859 30.0971 29.3179 30.0971 29.7074 29.7076C30.0968 29.3178 30.0968 28.6861 29.7074 28.2966L23.911 22.5L29.7074 16.7033C30.0968 16.3135 30.0968 15.6818 29.7074 15.2923Z"
                  fill="#00072E"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-5 mb-5">
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-10 ">
              <div className="shadow-md bg-white rounded-lg p-5">
                <div className="mb-3 relative inline-flex items-center w-full">
                  <label className="w-2/5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>
                <div className="mb-3 relative inline-flex items-center w-full">
                  <label className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select an option
                  </label>
                  <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>Choose a country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                  </select>
                </div>
                <p className="text-center pt-6">
                  If you choose to display weather in a ticker tape zone layout,
                  then this setting determines the view. If using full screen as
                  in the preview above, this setting will not alter the app.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-10 ">
              <div className="shadow-md bg-white rounded-lg p-5">
                <div
                  className="w-full p-12 flex items-center justify-center"
                  //style="border-radius: 0.625rem; border: 2px solid #FFF;background: #017B83;box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.25); height: 100%;"
                >
                  <svg
                    width="353"
                    height="200"
                    viewBox="0 0 353 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M106.972 126.021C101.772 125.952 96.7098 124.347 92.4204 121.408C88.131 118.469 84.8064 114.327 82.8646 109.504C80.9228 104.68 80.4505 99.3901 81.5072 94.299C82.5639 89.2078 85.1024 84.5427 88.8034 80.8904C92.5044 77.2381 97.2027 74.7617 102.307 73.7725C107.412 72.7833 112.695 73.3256 117.493 75.3311C122.29 77.3366 126.387 80.7158 129.269 85.0438C132.151 89.3717 133.689 94.4552 133.689 99.6549C133.597 106.68 130.741 113.386 125.741 118.32C120.74 123.255 113.997 126.022 106.972 126.021Z"
                      fill="white"
                    />
                    <path
                      d="M174.646 126.021C189.207 126.021 201.011 114.217 201.011 99.656C201.011 85.095 189.207 73.291 174.646 73.291C160.085 73.291 148.281 85.095 148.281 99.656C148.281 114.217 160.085 126.021 174.646 126.021Z"
                      fill="white"
                    />
                    <path
                      d="M244.954 126.019C239.725 126.088 234.594 124.6 230.213 121.745C225.832 118.89 222.399 114.797 220.35 109.986C218.301 105.175 217.729 99.8631 218.707 94.7261C219.685 89.5892 222.168 84.859 225.841 81.137C229.514 77.415 234.211 74.8693 239.335 73.8236C244.458 72.7779 249.777 73.2793 254.615 75.2642C259.453 77.2491 263.591 80.6278 266.504 84.9707C269.416 89.3136 270.972 94.4246 270.972 99.6538C270.973 106.587 268.243 113.241 263.373 118.175C258.504 123.11 251.886 125.928 244.954 126.019Z"
                      fill="white"
                    />
                    <path
                      d="M253.394 200C250.81 199.952 248.295 199.155 246.154 197.706C244.014 196.257 242.339 194.218 241.335 191.836C240.33 189.455 240.038 186.833 240.494 184.288C240.949 181.744 242.134 179.387 243.903 177.502L320.713 100.34L243.551 22.827C242.256 21.6201 241.217 20.1648 240.497 18.5477C239.776 16.9307 239.389 15.1851 239.358 13.4151C239.326 11.645 239.652 9.88687 240.315 8.24542C240.978 6.60396 241.965 5.11286 243.217 3.86107C244.468 2.60928 245.959 1.62244 247.601 0.95943C249.242 0.296419 251.001 -0.0291784 252.771 0.00205159C254.541 0.0332816 256.286 0.420707 257.903 1.14121C259.52 1.86171 260.976 2.90053 262.182 4.1957L348.66 90.1457C351.128 92.6174 352.515 95.968 352.515 99.4613C352.515 102.955 351.128 106.305 348.66 108.777L262.71 195.254C261.563 196.639 260.145 197.774 258.543 198.59C256.941 199.406 255.188 199.886 253.394 200Z"
                      fill="white"
                    />
                    <path
                      d="M98.8915 199.835C97.1595 199.844 95.4433 199.506 93.8436 198.842C92.2439 198.178 90.793 197.201 89.5759 195.968L3.0986 109.843C1.92061 108.444 1.04662 106.815 0.5322 105.06C0.0177815 103.305 -0.125811 101.462 0.110557 99.6482C0.151054 96.1608 1.53631 92.8236 3.97743 90.3326L89.0486 3.85527C91.5203 1.38661 94.8709 0 98.3643 0C101.858 0 105.208 1.38661 107.68 3.85527C110.149 6.327 111.535 9.67754 111.535 13.1709C111.535 16.6643 110.149 20.0148 107.68 22.4866L31.0455 99.6482L108.207 176.458C110.676 178.93 112.062 182.281 112.062 185.774C112.062 189.267 110.676 192.618 108.207 195.09C107.067 196.482 105.651 197.623 104.047 198.44C102.444 199.257 100.688 199.732 98.8915 199.835Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextScrollDetail;
