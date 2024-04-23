import React, { useState } from 'react';

const EditableField = ({ text, onChangeHandle }) => {
  const [value, setValue] = useState(text);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    onChangeHandle(e)
  };

  const handleBlur = () => {
    if (value.length > 0) {
        setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.length > 0) {
        setIsEditing(false);
    }
  };


  return (
    <div className="editableField">
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <p onDoubleClick={handleDoubleClick}>{value}</p>
      )}
    </div>
  );
}

export default EditableField;
