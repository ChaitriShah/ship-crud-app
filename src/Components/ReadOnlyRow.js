import React from "react";

const ReadOnlyRow = ({detail, handleEditClick, handleDeleteClick}) => {
    return (
        <tr>
              <td>{detail.name}</td>
              <td>{detail.length}</td>
              <td>{detail.width}</td>
              <td>{detail.code}</td>
              <td>
                  <button type="button" onClick={(event) => handleEditClick(event,detail)}>Edit</button>
                  <button type="buton" onClick={() => handleDeleteClick(detail.id)} >Delete</button>
              </td>
          </tr>
    )
}

export default ReadOnlyRow