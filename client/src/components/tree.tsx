import React, { useEffect, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import {
  FaList,
  FaRegFolder,
  FaRegFolderOpen,
  FaPython,
  FA,
} from "react-icons/fa";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { TbBrandCSharp, TbBrandCpp } from "react-icons/tb";

import "./tree.css";
import { Socket } from "socket.io-client";

const Tree = ({
  socket,
  setCurrentFile,
}: { 
  socket: Socket;
  setCurrentFile: (file: string) => void;
}) => {
  const [folder, setFolder] = useState({ name: "root", children: [] });
  const [selectedBranch, setSelectedBranch] = useState(null);

  const treeData2filepath = (treeData) => {
    //parent is a number so must lookup name
    let path = "";
    let cur = data[treeData.id];

    while (cur && cur.parent !== null) {
      // while parent is not 0
      path = cur.name + "/" + path;

      cur = data[cur.parent];
    }
    return path;
  };

  useEffect(() => {
    //socket is fetchDir
    socket?.emit("fetchDir", "", (treeDat) => {
      const correctedData = {
        name: "",
        children: treeDat,
      };
      setFolder(correctedData);
    });

    //BUG: updateTree is not being emitted
    // socket.on("updateTree", (treeDat) => {
    //   console.log("here");
    //   const correctedData = {
    //     name: "",
    //     children: treeDat,
    //   };
    //   setFolder(correctedData);
    // });

    // return () => {
    //   //socket.off("updateTree");
    // };
  }, [socket]);

  const data = flattenTree(folder);
  const handleSelect = async (treeState) => {
    //if file does not have children then it is a file
    //convert the treedata to path
    //store the branch of the last selected file or branch

    if (!treeState.isBranch) {
      const peen = await treeData2filepath(treeState.element);
      setCurrentFile(peen);

      setSelectedBranch(treeState.element.parent);
    } else {
      setSelectedBranch(treeState.element.id);
    }
  };

  return (
    <>
      <TreeView
        className="ide"
        data={data}
        togglableSelect
        multiSelect
        onSelect={handleSelect}
        nodeRenderer={({
          element,
          isBranch,
          isExpanded,
          getNodeProps,
          level,
          handleSelect,
          isHalfSelected,
          isSelected,
        }) => (
          <div
            {...getNodeProps()}
            style={{
              paddingLeft: 20 * (level - 1),
              display: "flex",
              alignItems: "center",
            }}
          >
            {isBranch ? (
              <FolderIcon isOpen={isExpanded} />
            ) : (
              <FileIcon filename={element.name} />
            )}
            <span
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {element.name}
            </span>
          </div>
        )}
      />
    </>
  );
};

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? (
    <FaRegFolderOpen className="icon" />
  ) : (
    <FaRegFolder className="icon" />
  );
};

const FileIcon = ({ filename }: { filename: String }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <DiJavascript color="yellow" className="icon" />;
    case "css":
      return <DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <FaList color="white" className="icon" />;
    case "npmignore":
      return <DiNpm color="red" className="icon" />;
    case "py":
      return <FaPython color="DeepSkyBlue" className="icon" />;
    case "md":
      return <FaList color="white" className="icon" />;
    case "cs":
      return <TbBrandCSharp color="DeepSkyBlue" className="icon" />;
    case "cpp":
      return <TbBrandCpp color="DeepSkyBlue" className="icon" />;
    default:
      return null;
  }
};

export default Tree;
