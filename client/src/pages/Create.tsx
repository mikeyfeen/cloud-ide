import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { FaDice } from "react-icons/fa";
import { generateName } from "../utils/name";
import EditableText from "../components/editabletext";

interface OptionType {
  value: string;
  label: string;
}

const Create = () => {
  const [codebaseName, setcodebaseName] = useState<string | undefined>(
    undefined
  );
  const [selectedOption, setSelectedOption] =
    useState<SingleValue<OptionType>>(null);

  const options: OptionType[] = [
    { value: "javascript", label: "Javascript" },
    { value: "python", label: "Python" },
    { value: "rust", label: "Rust" },
  ];

  //implement asnyc selector eventually that displays option logo

  const handleChange = (newValue: SingleValue<OptionType>) => {
    setSelectedOption(newValue);
  };

  const handleRandomName = () => {
    setcodebaseName(generateName(4));
    //TODO check if name exists before updating
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcodebaseName(e.target.value);
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div>
          <div className="flex">
            <input
              className="p-3"
              value={codebaseName}
              onChange={handleChangeName}
            />
            <button
              className="bg-white hover:bg-gray-200 text-white font-bold py-2 px-4 rounded-sm"
              onClick={handleRandomName}
            >
              <FaDice size={24} color="DarkSlateGray" />
            </button>
          </div>
          <Select
            className="p-3 text-black"
            defaultValue={selectedOption}
            onChange={handleChange}
            options={options}
          />
          <div className="flex justify-center items-center p-5">
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
