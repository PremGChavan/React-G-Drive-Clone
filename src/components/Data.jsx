import { useState, useEffect } from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListIcon from '@mui/icons-material/List';
import AppsIcon from '@mui/icons-material/Apps';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { db } from '../firebase.js'; // assuming firebase is set up in your project

const Data = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [ascending, setAscending] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Fetching data from Firestore
  useEffect(() => {
    const unsubscribe = db.collection('uploadedImages').onSnapshot(snapshot => {
      setFiles(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe; 
  }, []);

  const changeBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file =>
    file?.data?.filename?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const sortFiles = filesArray => {
    return [...filesArray].sort((a, b) => {
      const aVal =
        sortKey === 'name'
          ? a.data.filename
          : sortKey === 'size'
          ? a.data.size
          : a.data.timestamp?.seconds || 0;
      const bVal =
        sortKey === 'name'
          ? b.data.filename
          : sortKey === 'size'
          ? b.data.size
          : b.data.timestamp?.seconds || 0;

      if (sortKey === 'name') {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return ascending ? aVal - bVal : bVal - aVal;
      }
    });
  };

  const sortedFiles = sortFiles(filteredFiles);

  return (
    <>
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <img
            src="/no-files.svg"
            alt="Empty Drive"
            className="w-72 mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome to Drive, the home for all your files
          </h2>
          <p className="text-gray-600 text-base">
            Use the “New” button to upload
          </p>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 pb-4">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
              <span>My Drive</span>
              <ArrowDropDownIcon />
            </div>
            <div className="flex items-center space-x-4">
              <AppsIcon
                className={`cursor-pointer transition-colors ${
                  viewMode === 'grid' ? 'text-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setViewMode('grid')}
              />
              <ListIcon
                className={`cursor-pointer transition-colors ${
                  viewMode === 'list' ? 'text-blue-600' : 'text-gray-500'
                }`}
                onClick={() => setViewMode('list')}
              />
              <InfoOutlinedIcon className="text-gray-500" />
            </div>
          </div>

          {/* Search Input */}
          <div className="w-full mb-4">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedFiles.map(file => (
                <div
                  key={file.id}
                  className="flex flex-col items-center border border-gray-300 rounded-xl p-4 shadow hover:shadow-md transition"
                >
                  <InsertDriveFileIcon className="text-gray-500 text-6xl mb-2" />
                  <a
                    href={file.data.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-700 font-medium truncate w-full text-center"
                  >
                    {file.data.filename}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="w-full">
              <div className="grid grid-cols-3 font-semibold text-gray-600 text-sm border-b border-gray-300 py-2 px-3 bg-gray-100">
                <p
                  onClick={() => {
                    setSortKey('name');
                    setAscending(prev => !prev);
                  }}
                  className="cursor-pointer flex items-center gap-1"
                >
                  Name <ArrowDownwardIcon fontSize="small" />
                </p>
                <p
                  onClick={() => {
                    setSortKey('size');
                    setAscending(prev => !prev);
                  }}
                  className="cursor-pointer"
                >
                  File Size
                </p>
                <p
                  onClick={() => {
                    setSortKey('date');
                    setAscending(prev => !prev);
                  }}
                  className="cursor-pointer"
                >
                  Last Modified
                </p>
              </div>

              {sortedFiles.map(file => (
                <div
                  key={file.id}
                  className="grid grid-cols-3 items-center text-sm text-gray-700 border-b border-gray-200 px-3 py-3 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <InsertDriveFileIcon className="text-gray-500" />
                    <a
                      href={file.data.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:underline"
                    >
                      {file.data.filename}
                    </a>
                  </div>
                  <p>{changeBytes(file.data.size)}</p>
                  <p>{new Date(file.data.timestamp?.seconds * 1000).toUTCString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Data;
