import './App.css';
import data from './mock-data.json';
import { useState, useEffect, useRef, Fragment } from 'react';
import { nanoid } from 'nanoid';
import ReadOnlyRow from './Components/ReadOnlyRow';
import EditableRow from './Components/EditableRow';

function App() {
  const [details, setDetails] = useState(data);

  const [addFormData, setFormData] = useState({
    name: '',
    length: '',
    width: '',
    code: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    length: '',
    width: '',
    code: ''
  })

  const [editDetailId, setEditDetailId] = useState(null);

  const [isValidated, setIsValidated] = useState(true);

  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  };

  const isInitialMount = useRef(true);
  const codeInput = useRef(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (document.activeElement === codeInput.current) {
        addFormData.code.match("[A-Z]{4}-[0-9]{4}-[A-Z][0-9]$") ? setIsValidated(true) : setIsValidated(false);
      }
    }
  });

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  }


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (isValidated) {
      const newDetail = {
        id: nanoid(),
        name: addFormData.name,
        length: addFormData.length,
        width: addFormData.width,
        code: addFormData.code
      }

      const newDetails = [...details, newDetail];
      setDetails(newDetails);

      setFormData({
        name: '',
        length: '',
        width: '',
        code: ''
      })
    }

  }

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedDetail = {
      id: editDetailId,
      name: editFormData.name,
      length: editFormData.length,
      width: editFormData.width,
      code: editFormData.code
    }

    const newDetails = [...details];

    const index = details.findIndex((detail) => detail.id === editDetailId)
    newDetails[index] = editedDetail;
    setDetails(newDetails);
    setEditDetailId(null);
  }

  const handleEditClick = (event, detail) => {
    event.preventDefault();
    setEditDetailId(detail.id);

    const formValues = {
      name: detail.name,
      length: detail.length,
      width: detail.width,
      code: detail.code
    }

    setEditFormData(formValues);
  }

  const handleCancelClick = () => {
    setEditDetailId(null)
  }

  const handleDeleteClick = (detailId) => {
    const newDetails = [...details];
    const index = details.findIndex((detail) => detail.id === detailId);
    newDetails.splice(index, 1);
    setDetails(newDetails);
  }

  return (
    <div className="app-container">
      <h2>Ship Details</h2>
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Ship Name</th>
              <th>Length (m)</th>
              <th>Width (m)</th>
              <th>Ship Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail) => (
              <Fragment>
                {editDetailId === detail.id ? (
                  <EditableRow editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange} handleCancelClick={handleCancelClick} />
                ) : (
                  <ReadOnlyRow detail={detail}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick} />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>

      <h2>Add a new Ship</h2>
      <form class="add-form" onSubmit={handleFormSubmit}>
        <table>
          <tr>
            <td>Name:</td>
            <td><input type="text" name="name" required="required" size="24" placeholder="Enter name" value={addFormData.name} onChange={handleAddFormChange} /></td>
          </tr>
          <tr>
            <td>Length:</td>
            <td>
              <input type="number" name="length" required="required" size="24" placeholder="Enter length in metres" value={addFormData.length} onChange={handleAddFormChange} />
            </td>
          </tr>
          <tr>
            <td>Width:</td>
            <td>
              <input type="number" name="width" required="required" size="30" placeholder="Enter width in metres" value={addFormData.width} onChange={handleAddFormChange} />
            </td>
          </tr>
          <tr>
            <td>Code:</td>
            <td>
              <input type="text" name="code" required="required" size="24" ref={codeInput} placeholder="Enter code e.g. XXXX-0000-X0" onChange={handleAddFormChange} />
            </td>
          </tr>
        </table>
        {isValidated === false ? <span small="true" style={{ color: "red" }}>The Ship Code is invalid. Please enter in format XXXX-0000-X0. </span> : null}
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
