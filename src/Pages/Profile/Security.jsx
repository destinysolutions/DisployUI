import React from "react";

const Security = () => {
  return <div>
    <div className="rounded-xl mt-8 shadow bg-white p-5">          
          <h4 class="user-name mb-3">Change Password</h4>          
            <div class="-mx-3 flex mb-6">
              <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                <form class="space-y-2" action="#">
                    <div>
                        <label for="email" class="label_top text-sm font-medium text-gray-900 dark:text-white">Current Password</label>
                        <input type="email" name="email" id="email" class="bg-gray-200 border input-bor-color text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Current Password" required="" />
                    </div>
                    <div>
                        <label for="password" class="label_top text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                        <input type="password" name="password" id="password" placeholder="Enter New Password" class="bg-gray-200 border input-bor-color text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                    </div>
                    <div>
                        <label for="confirm-password" class="label_top text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="Enter Confirm New Password" class="bg-gray-200 border input-bor-color text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                    </div>
                    <div class="flex items-center pb-2">
                        <div class="flex items-center h-5">
                          <input id="newsletter" aria-describedby="newsletter" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="newsletter" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                        </div>
                    </div>
                    <div class="md:w-full px-3 flex">
                    <button class="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3">Save Changes</button>
                    <button class=" px-5 py-2 border border-primary rounded-full text-primary">Reset</button>
                  </div>
                </form>
              </div>
              <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                <h4 class="user-name mb-3">Password Requirements:</h4>
                <ul>
                  <li className="flex items-center"><span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M0.0979682 7.2727C-0.0239126 7.16235 -0.0333736 6.97408 0.0768995 6.8522C0.187252 6.73024 0.375519 6.72086 0.49748 6.83113L3.20486 9.28608L9.25509 2.94963C9.3687 2.83029 9.55752 2.82552 9.67686 2.93914C9.79628 3.05267 9.80097 3.24149 9.68743 3.36091L3.43645 9.90765L3.43605 9.90725C3.32507 10.024 3.14062 10.0315 3.02048 9.92283L0.0979682 7.2727Z" fill="#515151"/>
                    <path d="M0.0979682 4.41577C-0.0239126 4.30542 -0.0333736 4.11715 0.0768995 3.99527C0.187252 3.87331 0.375519 3.86392 0.49748 3.9742L3.20486 6.42915L9.25509 0.0926969C9.3687 -0.0266397 9.55752 -0.03141 9.67686 0.0822023C9.79628 0.195735 9.80097 0.384559 9.68743 0.503975L3.43645 7.05071L3.43605 7.05032C3.32507 7.16703 3.14062 7.17458 3.02048 7.0659L0.0979682 4.41577Z" fill="#515151"/>
                    </svg></span>Minimum 8 characters long - the more, the better</li>
                  <li className="flex items-center"><span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M0.0979682 7.2727C-0.0239126 7.16235 -0.0333736 6.97408 0.0768995 6.8522C0.187252 6.73024 0.375519 6.72086 0.49748 6.83113L3.20486 9.28608L9.25509 2.94963C9.3687 2.83029 9.55752 2.82552 9.67686 2.93914C9.79628 3.05267 9.80097 3.24149 9.68743 3.36091L3.43645 9.90765L3.43605 9.90725C3.32507 10.024 3.14062 10.0315 3.02048 9.92283L0.0979682 7.2727Z" fill="#515151"/>
                    <path d="M0.0979682 4.41577C-0.0239126 4.30542 -0.0333736 4.11715 0.0768995 3.99527C0.187252 3.87331 0.375519 3.86392 0.49748 3.9742L3.20486 6.42915L9.25509 0.0926969C9.3687 -0.0266397 9.55752 -0.03141 9.67686 0.0822023C9.79628 0.195735 9.80097 0.384559 9.68743 0.503975L3.43645 7.05071L3.43605 7.05032C3.32507 7.16703 3.14062 7.17458 3.02048 7.0659L0.0979682 4.41577Z" fill="#515151"/>
                    </svg></span> At least one lowercase character</li>
                  <li className="flex items-center"><span className="me-3"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M0.0979682 7.2727C-0.0239126 7.16235 -0.0333736 6.97408 0.0768995 6.8522C0.187252 6.73024 0.375519 6.72086 0.49748 6.83113L3.20486 9.28608L9.25509 2.94963C9.3687 2.83029 9.55752 2.82552 9.67686 2.93914C9.79628 3.05267 9.80097 3.24149 9.68743 3.36091L3.43645 9.90765L3.43605 9.90725C3.32507 10.024 3.14062 10.0315 3.02048 9.92283L0.0979682 7.2727Z" fill="#515151"/>
                    <path d="M0.0979682 4.41577C-0.0239126 4.30542 -0.0333736 4.11715 0.0768995 3.99527C0.187252 3.87331 0.375519 3.86392 0.49748 3.9742L3.20486 6.42915L9.25509 0.0926969C9.3687 -0.0266397 9.55752 -0.03141 9.67686 0.0822023C9.79628 0.195735 9.80097 0.384559 9.68743 0.503975L3.43645 7.05071L3.43605 7.05032C3.32507 7.16703 3.14062 7.17458 3.02048 7.0659L0.0979682 4.41577Z" fill="#515151"/>
                    </svg></span> At least one number, symbol, or whitespace character</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-xl mt-8 shadow bg-white my-3 p-5">          
            <h4 class="user-name mb-3">Two-steps verification</h4>
            <p className="font-medium lg:text-md my-3">Two factor authentication is not enabled yet.</p>
            <p className="mb-3">Two-factor authentication adds an additional layer of security to your account byrequiring more than just a password to log in.</p>
            <button class="px-5 bg-primary text-white rounded-full py-2 border border-primary"> Enable 2FA</button>            
          </div>

  </div>;
};

export default Security;
