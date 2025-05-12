import styled from 'styled-components';
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // your firebase config file
import {
  getDocs,
  addDoc,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import axios from "axios";


import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import DevicesIcon from "@mui/icons-material/Devices";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloudQueueOutlinedIcon from "@mui/icons-material/CloudQueueOutlined";


const SidebarContainer = styled.div`
    margin-top: 10px;
`
const SidebarBtn = styled.div`
    button {
        background: transparent;
        border: 1px solid lightgray;
        display: flex;
        align-items: center;
        border-radius: 40px;
        padding:5px 10px;
        box-shadow:2px 2px 2px #ccc;
        margin-left: 20px;
        span {
            font-size: 16px;
            margin-right: 20px;
            margin-left: 10px;
        }
    }
`
const SidebarOptions = styled.div`
    margin-top: 10px;
    .progress_bar {
        padding: 0px 20px;
    }
    .progress_bar span {
        display: block;
        color:#333;
        font-size: 13px;
    }
`

const SidebarOption = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    &:hover{
        background: whitesmoke;
        cursor: pointer;
    }
    svg.MuiSvgIcon-root {
        color:rgb(78, 78, 78);
    }
    span {
        margin-left: 15px;
        font-size: 13px;
        font-weight: 500;
        color:rgb(78, 78, 78)
    }
`
const ModalPopup = styled.div`
    top: 50%;
    background-color: #fff;
    width: 500px;
    margin: 0px auto;
    position: relative;
    transform: translateY(-50%);
    padding: 10px;
    border-radius: 10px;
`

const ModalHeading = styled.div`
    text-align: center;
    border-bottom: 1px solid lightgray;
    height: 40px;
`

const ModalBody = styled.div`
    input.modal__submit {
        width: 100%;
        background: darkmagenta;
        padding: 10px 20px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 5px;
        font-size: 16px;
        border: 0;
        outline: 0;
        border-radius: 5px;
        cursor: pointer;
        margin-top:20px
    }
    input.modal__file {
        background: whitesmoke;
        padding: 20px;
        color: #000;
        display: block;
        margin-top:20px
    }
`

const UploadingPara = styled.p`
    background: green;
    color: #fff;
    margin: 20px;
    text-align: center;
    padding: 10px;
    letter-spacing: 1px;
`


export default function UserFileUploadViewer() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) fetchUserFiles();
  }, [user]);

  const fetchUserFiles = async () => {
    const q = query(collection(db, "files"), where("uploadedBy", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const fileData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFiles(fileData);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dixcl4uxd/auto/upload",
        formData
      );

      const fileUrl = res.data.secure_url;
      const fileName = file.name;

      await addDoc(collection(db, "files"), {
        fileName,
        fileUrl,
        uploadedBy: user.uid,
        uploadedAt: serverTimestamp(),
      });

      setFile(null);
      setOpen(false);
      fetchUserFiles();
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalPopup>
          <form onSubmit={handleUpload}>
            <ModalHeading>
              <h3>Select file you want to upload</h3>
            </ModalHeading>
            <ModalBody>
              {uploading ? (
                <UploadingPara>Uploading...</UploadingPara>
              ) : (
                <>
                  <input
                    type="file"
                    className="modal__file"
                    onChange={handleFile}
                  />
                  <input type="submit" className="modal__submit" />
                </>
              )}
            </ModalBody>
          </form>
        </ModalPopup>
      </Modal>

      <SidebarContainer>
        <SidebarBtn>
          <button onClick={() => setOpen(true)}>
            <img
              src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E"
              alt="new"
            />
            <span>New</span>
          </button>
        </SidebarBtn>

        <SidebarOptions>
          <SidebarOption>
            <MobileScreenShareIcon />
            <span>My Drive</span>
          </SidebarOption>
          <SidebarOption>
            <DevicesIcon />
            <span>Computers</span>
          </SidebarOption>
          <SidebarOption>
            <PeopleOutlineOutlinedIcon />
            <span>Shared with me</span>
          </SidebarOption>
          <SidebarOption>
            <QueryBuilderOutlinedIcon />
            <span>Recent</span>
          </SidebarOption>
          <SidebarOption>
            <StarBorderOutlinedIcon />
            <span>Starred</span>
          </SidebarOption>
          <SidebarOption>
            <DeleteOutlineOutlinedIcon />
            <span>Trash</span>
          </SidebarOption>
        </SidebarOptions>

        <hr />

        <SidebarOptions>
          <SidebarOption>
            <CloudQueueOutlinedIcon />
            <span>Storage</span>
          </SidebarOption>
          <div className="progress_bar">
            <progress size="tiny" value="50" max="100" />
            <span>105 GB of 200 GB used</span>
          </div>
        </SidebarOptions>
      </SidebarContainer>

      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Drive</h1>
        <ul className="mt-6 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="p-3 bg-gray-100 rounded-xl flex justify-between items-center"
            >
              <span>{f.fileName}</span>
              <a
                href={f.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
