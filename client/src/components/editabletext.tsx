import React, { useState } from "react";

interface EditableTextProps {
  initialText: string;
}

const EditableText: React.FC<EditableTextProps> = ({ initialText }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    if (text.trim() === "") {
      setText(initialText); // Reset to initial text if input is empty
    }
    setIsEditing(false);
    //save text
  };
  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default EditableText;
