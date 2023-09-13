import React,{ useState }  from 'react'

const NewFolderDialog  = ({ onClose, onCreate}) => {
    const [folderName, setFolderName] = useState('New Folder');
    const handleCreateFolder = () => {
        // Perform folder creation logic here
        onCreate(folderName);
        onClose();
      };
  return (
    <div>
    <div className="backdrop">
    <div className="fixed unsplash-model bg-black lg:px-5 md:px-5 sm:px-3 xs:px-2 py-7 rounded-2xl">
    <div className="dialog text-white">
   
    <h2>Create New Folder</h2>
   
    <button onClick={onClose}>Cancel</button>
  </div>
  </div>
  </div>
    </div>
  )
}

export default NewFolderDialog 
