import React, { useState, useRef, useEffect } from "react";
import {
  FaEllipsisV,
  FaEdit,
  FaLink,
  FaRegCopy,
  FaCopy,
  FaTrashAlt,
} from "react-icons/fa";
import "../components/styles/FilesMenu.css";

function FilesMenu() {
  const [lessons, setLessons] = useState([
    { id: 1, name: "Lesson 1: Introduction", files: [] },
    { id: 2, name: "Lesson 2: Advanced Topics", files: [] },
  ]);

  const [activeLesson, setActiveLesson] = useState(null);
  const [fileInput, setFileInput] = useState({
    lessonId: null,
    type: "",
    name: "",
  });
  const [newLessonName, setNewLessonName] = useState("");
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [activeFileMenu, setActiveFileMenu] = useState(null); 
  const [editingFileId, setEditingFileId] = useState(null); 
  const [notification, setNotification] = useState(""); 

  const fileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
        setActiveFileMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = (lessonId) => {
    setActiveLesson((prev) => (prev === lessonId ? null : lessonId));
    setFileInput({ lessonId: null, type: "", name: "" }); 
  };

  const handleAddFile = (lessonId, type) => {
    setFileInput({ lessonId, type, name: "" });
    setActiveLesson(null); 
  };

  const saveFile = () => {
    if (!fileInput.name.trim()) return; 
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === fileInput.lessonId
          ? {
              ...lesson,
              files: [
                ...lesson.files,
                { id: Date.now(), type: fileInput.type, name: fileInput.name },
              ],
            }
          : lesson
      )
    );
    setFileInput({ lessonId: null, type: "", name: "" }); 
  };

  const handleRename = (lessonId, fileId) => {
    setEditingFileId(fileId); 
  };

  const handleRenameSave = (lessonId, fileId, newName) => {
    if (newName.trim()) {
      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson.id === lessonId
            ? {
                ...lesson,
                files: lesson.files.map((file) =>
                  file.id === fileId ? { ...file, name: newName } : file
                ),
              }
            : lesson
        )
      );
    }
    setEditingFileId(null); 
  };

  const handleCopyLink = (lessonId, fileId) => {
    setNotification("Link copied!"); 
    setTimeout(() => setNotification(""), 2000); 
    setActiveFileMenu(null); 
  };

  const handleCopyPath = (lessonId, fileId) => {
    setNotification("Path copied!"); 
    setTimeout(() => setNotification(""), 2000); 
    setActiveFileMenu(null); 
  };

  const handleDuplicate = (lessonId, fileId) => {
    const fileToDuplicate = lessons
      .find((lesson) => lesson.id === lessonId)
      .files.find((file) => file.id === fileId);

    if (fileToDuplicate) {
      const newFile = {
        ...fileToDuplicate,
        id: Date.now(),
        name: `Copy of ${fileToDuplicate.name}`, 
      };

      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, files: [...lesson.files, newFile] }
            : lesson
        )
      );

      setNotification("Copied!"); 
      setTimeout(() => setNotification(""), 2000);
    }

    setActiveFileMenu(null); 
  };

  const handleDelete = (lessonId, fileId) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              files: lesson.files.filter((file) => file.id !== fileId),
            }
          : lesson
      )
    );
    setActiveFileMenu(null); 
  };

  const addLesson = () => {
    if (newLessonName.trim()) {
      const newLesson = { id: Date.now(), name: newLessonName, files: [] };
      setLessons([...lessons, newLesson]); 
      setNewLessonName(""); 
      setIsAddingLesson(false); 
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="course">
          <div className="course-header">
            <span>Python Basics</span>
          </div>

          <div className="lesson-list">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-item">
                <div className="lesson-header">
                  <span>{lesson.name}</span>
                  <span
                    className="plus-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePopup(lesson.id);
                    }}
                  >
                    +
                  </span>
                </div>

                <div className="file-list">
                  {lesson.files.map((file) => (
                    <div key={file.id} className="file-item">
                      {editingFileId === file.id ? (
                        <input
                          type="text"
                          value={file.name}
                          onChange={(e) =>
                            setLessons((prevLessons) =>
                              prevLessons.map((lesson) =>
                                lesson.id === lesson.id
                                  ? {
                                      ...lesson,
                                      files: lesson.files.map((f) =>
                                        f.id === file.id
                                          ? { ...f, name: e.target.value }
                                          : f
                                      ),
                                    }
                                  : lesson
                              )
                            )
                          }
                          onBlur={() =>
                            handleRenameSave(lesson.id, file.id, file.name)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleRenameSave(lesson.id, file.id, file.name);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span>{file.name}</span>
                      )}
                      <span
                        className="dots-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFileMenu((prev) =>
                            prev === file.id ? null : file.id
                          );
                        }}
                      >
                        <FaEllipsisV />
                      </span>

                      {activeFileMenu === file.id && (
                        <div className="file-actions" ref={fileMenuRef}>
                          <div className="file-actions-menu">
                            <div
                              className="menu-item"
                              onClick={() => handleRename(lesson.id, file.id)}
                            >
                              <FaEdit className="icon" /> Rename
                            </div>
                            <div
                              className="menu-item"
                              onClick={() => handleCopyLink(lesson.id, file.id)}
                            >
                              <FaLink className="icon" /> Copy Link
                            </div>
                            <div
                              className="menu-item"
                              onClick={() => handleCopyPath(lesson.id, file.id)}
                            >
                              <FaRegCopy className="icon" /> Copy Path
                            </div>
                            <div
                              className="menu-item"
                              onClick={() =>
                                handleDuplicate(lesson.id, file.id)
                              }
                            >
                              <FaCopy className="icon" /> Duplicate
                            </div>
                            <div
                              className="menu-item"
                              onClick={() => handleDelete(lesson.id, file.id)}
                            >
                              <FaTrashAlt className="icon delete-icon" />{" "}
                              <span className="delete-text">Delete</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {fileInput.lessonId === lesson.id && (
                  <div className="file-input">
                    <input
                      type="text"
                      value={fileInput.name}
                      placeholder={`Enter ${fileInput.type} file name`}
                      onChange={(e) =>
                        setFileInput({ ...fileInput, name: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveFile();
                      }}
                      onBlur={saveFile}
                      autoFocus
                    />
                  </div>
                )}

                {activeLesson === lesson.id && (
                  <div className="popup-menu">
                    <div
                      className="popup-item"
                      onClick={() => handleAddFile(lesson.id, "text")}
                    >
                      📄 Add Text File
                    </div>
                    <div
                      className="popup-item"
                      onClick={() => handleAddFile(lesson.id, "code")}
                    >
                      🐍 Add Code File
                    </div>
                  </div>
                )}
              </div>
            ))}
            {notification && <div className="notification">{notification}</div>}
            {isAddingLesson ? (
              <div className="lesson-item">
                <input
                  type="text"
                  value={newLessonName}
                  onChange={(e) => setNewLessonName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addLesson();
                  }}
                  onBlur={addLesson}
                  placeholder="Enter new lesson name"
                  autoFocus
                  className="lesson-input"
                />
              </div>
            ) : (
              <div className="add-lesson">
                <button onClick={() => setIsAddingLesson(true)}>
                  + Add Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilesMenu;

