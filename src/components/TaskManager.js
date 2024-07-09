"use client"
import { useState, useEffect, useRef } from 'react';

const TaskManager = () => {
  const [taskData, setTaskData] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const [isTaskFormVisible, setTaskFormVisible] = useState(false);
  const [isConfirmCloseDialogVisible, setConfirmCloseDialogVisible] = useState(false);
  const descriptionInputRef = useRef(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('data')) || [];
    setTaskData(storedData);
  }, []);

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(taskData));
  }, [taskData]);

  const reset = () => {
    setCurrentTask({});
    setTaskFormVisible(false);
  };

  const addOrUpdateTask = () => {
    const taskObj = {
      id: `${currentTask.title ? currentTask.title.toLowerCase().split(' ').join('-') : ''}-${Date.now()}`,
      title: currentTask.title,
      date: currentTask.date,
      description: currentTask.description,
    };

    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

    if (dataArrIndex === -1) {
      setTaskData([taskObj, ...taskData]);
    } else {
      const newTaskData = [...taskData];
      newTaskData[dataArrIndex] = taskObj;
      setTaskData(newTaskData);
    }

    reset();
  };

  const deleteTask = (id) => {
    const newTaskData = taskData.filter((item) => item.id !== id);
    setTaskData(newTaskData);
  };

  const editTask = (task) => {
    setCurrentTask(task);
    setTaskFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addOrUpdateTask();
  };

  const handleFormClose = () => {
    if (
      (currentTask.title || currentTask.date || currentTask.description) &&
      (currentTask.title !== titleInput.value || currentTask.date !== dateInput.value || currentTask.description !== descriptionInput.value)
    ) {
      setConfirmCloseDialogVisible(true);
    } else {
      reset();
    }
  };

  return (
    <div className="todo-app">
      <button id="open-task-form-btn" className="btn large-btn" onClick={() => setTaskFormVisible(true)}>
        Add New Task
      </button>

      {isTaskFormVisible && (
        <form className="task-form" id="task-form" onSubmit={handleFormSubmit}>
          <div className="task-form-header">
            <button id="close-task-form-btn" className="close-task-form-btn" type="button" aria-label="close" onClick={handleFormClose}>
              <svg className="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
                <path fill="#F44336" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)" />
                <path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)" />
              </svg>
            </button>
          </div>
          <div className="task-form-body p-2">
            <label className="task-form-label" htmlFor="title-input">Title</label>
            <input required type="text" className="form-control rounded-md border-2 border-black" id="title-input" value={currentTask.title || ''} onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })} />
            <label className="task-form-label" htmlFor="date-input">Date</label>
            <input type="date" className="form-control rounded-md border-2 border-black" id="date-input" value={currentTask.date || ''} onChange={(e) => setCurrentTask({ ...currentTask, date: e.target.value })} />
            <label className="task-form-label" htmlFor="description-input">Description</label>
            <textarea
              className="form-control rounded-md border-2 border-black"
              id="description-input"
              cols="30"
              rows="5"
              value={currentTask.description || ''}
              onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              ref={descriptionInputRef}
              onInput={() => {
                if (descriptionInputRef.current) {
                  descriptionInputRef.current.style.height = 'auto';
                  descriptionInputRef.current.style.height = `${descriptionInputRef.current.scrollHeight}px`;
                }
              }}
            ></textarea>
          </div>
          <div className="task-form-footer">
            <button id="add-or-update-task-btn" className="btn large-btn" type="submit">
              {currentTask.id ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      )}

      {isConfirmCloseDialogVisible && (
        <dialog id="confirm-close-dialog" open>
          <form method="dialog">
            <p className="discard-message-text">Discard unsaved changes?</p>
            <div className="confirm-close-dialog-btn-container">
              <button id="cancel-btn" className="btn" onClick={() => setConfirmCloseDialogVisible(false)}>Cancel</button>
              <button id="discard-btn" className="btn" onClick={reset}>Discard</button>
            </div>
          </form>
        </dialog>
      )}

      <div id="tasks-container" className='place-content-start '>
        {taskData.map((task) => (
          <div key={task.id} className="task" id={task.id}>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Date:</strong> {task.date}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <button type="button" className="btn" onClick={() => editTask(task)}>Edit</button>
            <button type="button" className="btn" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
