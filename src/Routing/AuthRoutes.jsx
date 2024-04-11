import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import ForgotPassword from "../Pages/ForgotPassword";
import EmailVerified from "../Pages/EmailVerified";
import TermsConditions from "../Pages/TermsConditions";
import PlanIntegration from "../Components/PlanIntegration";

const LoginContainer = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route>
            {/* <Route path="/dashboard" element={<Navigate to="/" />} /> */}
            <Route path="/screens" element={<Navigate to="/" />} />
            <Route path="/edituser" element={<Navigate to="/" />} />
            <Route path="/userprofile" element={<Navigate to="/" />} />
            <Route path="/mergescreen" element={<Navigate to="/" />} />
            <Route path="/add-mergescreen" element={<Navigate to="/" />} />
            <Route path="/newscreengroup" element={<Navigate to="/" />} />
            <Route path="/screensplayer" element={<Navigate to="/" />} />
            <Route path="/newscreendetail" element={<Navigate to="/" />} />
            <Route path="/fileupload" element={<Navigate to="/" />} />
            <Route path="/assets" element={<Navigate to="/" />} />
            <Route path="/assets-grid" element={<Navigate to="/" />} />
            <Route path="/apps" element={<Navigate to="/" />} />
            <Route path="/youtube" element={<Navigate to="/" />} />
            <Route path="/youtubedetail" element={<Navigate to="/" />} />
            <Route path="/youtubedetail/:id" element={<Navigate to="/" />} />
            <Route path="/weather" element={<Navigate to="/" />} />
            <Route path="/weatherdetail" element={<Navigate to="/" />} />
            <Route path="/weatherdetail/:id" element={<Navigate to="/" />} />
            <Route path="/text-scroll" element={<Navigate to="/" />} />
            <Route path="/textscrolldetail" element={<Navigate to="/" />} />
            <Route path="/textscrolldetail/:id" element={<Navigate to="/" />} />
            <Route path="/composition" element={<Navigate to="/" />} />
            <Route path="/addcomposition" element={<Navigate to="/" />} />
            <Route path="/addcomposition/:id" element={<Navigate to="/" />} />
            <Route path="/editcomposition/:id/:layoutId" element={<Navigate to="/" />} />
            <Route path="/selectedlayout" element={<Navigate to="/" />} />
            <Route path="/disploystudio" element={<Navigate to="/" />} />
            <Route path="/reports" element={<Navigate to="/" />} />
            <Route path="/reports/:report/:daily/:date" element={<Navigate to="/" />} />
            <Route path="/uptimereport" element={<Navigate to="/" />} />
            <Route path="/auditlogreport" element={<Navigate to="/" />} />
            <Route path="/salesreport" element={<Navigate to="/" />} />
            <Route path="/cancelreport" element={<Navigate to="/" />} />
            <Route path="/mediareport" element={<Navigate to="/" />} />
            <Route path="/myschedule" element={<Navigate to="/" />} />
            <Route path="/weatherschedule" element={<Navigate to="/" />} />
            <Route path="/addschedule" element={<Navigate to="/" />} />
            <Route path="/addweatherschedule" element={<Navigate to="/" />} />
            <Route path="/saveassignscreenmodal" element={<Navigate to="/" />}/>
            <Route path="/approval" element={<Navigate to="/" />} />
            <Route path="/settings" element={<Navigate to="/" />} />
            <Route path="/userrole" element={<Navigate to="/" />} />
            <Route path="/eventedit" element={<Navigate to="/" />} />
            <Route path="/NewFolderDialog/:folderId" element={<Navigate to="/" />}/>
            <Route path="/trash" element={<Navigate to="/" />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            <Route
              path="/forgotpassword"
              element={
                <ForgotPassword
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
            path="/PaymentIntegration/:planId"
            element={
              <PlanIntegration
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
            <Route
            path="/email-verified"
            element={
              <EmailVerified
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
            <Route
              path="/termsconditions"
              element={
                <TermsConditions
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default LoginContainer;
