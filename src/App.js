import React, { useEffect, useState } from "react";
import RouterApp from "./Config/RouterApp/Router";
import { Provider } from "react-redux";
import store from "./Store/store";
import "react-toastify/dist/ReactToastify.css";
import { PrimeReactProvider } from "primereact/api";
import GlobalBulkUploadProgress from "./Component/GlobalBulkUploadProgress";
import BulkUploadLogModal from "./Component/BulkUploadLogModal";
// import ReloadWarningModal from "./Component/ReloadWarningModal";
import { useSelector } from "react-redux";


const AppContent = () => {
  const showBulkProgress = useSelector(state => state.bulkUpload.showBulkProgress);
  // const [showReloadModal, setShowReloadModal] = useState(false);
  // const [pendingEvent, setPendingEvent] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (showBulkProgress) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showBulkProgress]);


  // Removed custom reload modal logic

  return (
    <>
      <RouterApp />
      <GlobalBulkUploadProgress />
      <BulkUploadLogModal />
      {/* <ReloadWarningModal open={showReloadModal} onConfirm={handleConfirmReload} onCancel={handleCancelReload} /> */}
    </>
  );
};

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <PrimeReactProvider>
          <AppContent />
        </PrimeReactProvider>
      </Provider>
    </div>
  );
};

export default App;
