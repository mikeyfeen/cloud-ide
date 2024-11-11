import React, { useEffect, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import * as icons from "../utils/icons";

import "./tree.css";
import { Socket } from "socket.io-client";
import EditableText from "./editabletext";
import { FaFileAlt } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";

const Tree = ({
  socket,
  setCurrentFile,
}: {
  socket: Socket;
  setCurrentFile: (file: string) => void;
}) => {
  const [folder, setFolder] = useState({ name: "root", children: [] });
  const [previousFolder, setPreviousFolder] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newNode, setNewNode] = useState(null);

  const treeData2filepath = (treeData, cur = data[treeData.id]) => {
    //parent is a number so must lookup name
    let path = "";

    while (cur && cur.parent !== null) {
      // while parent is not 0
      path = cur.name + "/" + path;

      cur = data[cur.parent];
    }
    return path;
  };

  const updateTree = () => {
    socket?.emit("fetchDir", "", (treeDat) => {
      const correctedData = {
        name: "",
        children: treeDat,
      };
      setFolder(correctedData);
    });
    if (previousFolder)
      setNewNode(findNewNode(flattenTree(previousFolder), flattenTree(folder)));
    console.log("newNode", newNode);
  };

  const findNewNode = (oldData, newData) => {
    if (!oldData) return null;
    const oldIds = new Set(oldData.map((node) => node.id));
    return newData.find((node) => !oldIds.has(node.id));
  };

  useEffect(() => {
    //socket is fetchDir
    updateTree();
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

  // useEffect(() => {}, [selectedNode]);

  const data = flattenTree(folder);
  const handleSelect = async (treeState) => {
    //if file does not have children then it is a file
    //convert the treedata to path
    //stor
    setSelectedNode(treeState);
    console.log(selectedNode);
    if (!treeState.isBranch) {
      const peen = await treeData2filepath(treeState.element);
      setCurrentFile(peen);

      setSelectedBranch(treeState.element.parent);
    } else {
      setSelectedBranch(treeState.element.id);
    }
  };

  const handleDeleteNode = () => {
    // socket delete file remotely
    // refetch directory
  };

  const handleCreateFile = async () => {
    if (selectedNode) {
      if (selectedNode.isBranch) {
        const peen = treeData2filepath(selectedNode.element);

        socket.emit("updateContent", {
          path: peen + "unnamed file/",
          content: "aaaa",
        });
      } else {
        const peen = treeData2filepath(
          selectedNode.element,
          selectedNode.element.parent
        );
        socket.emit("updateContent", {
          path: peen + "unnamed file/",
          content: "aaaa",
        });
      }
    }
    updateTree();
    //created a file on refresh named "unnamed file wherever the parent is located"
  };

  const handleCreateFolder = () => {};

  return (
    <>
      <div className="flex justify-center">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={handleCreateFile}
        >
          <FaFileAlt />
        </button>
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={handleCreateFolder}
        >
          <FaFolder />
        </button>
      </div>
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
              backgroundColor:
                selectedNode && selectedNode.element.id === element.id
                  ? "darkgray"
                  : "inherit",
            }}
          >
            <>
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
                <EditableText initialText={element.name} />
              </span>
            </>
            {/* Delete icon should only apear if it is the current selected file */}
            {/* <span className="align-end" onClick={handleDeleteNode}>
              {!isBranch && <icons.FaTrashAlt size={10} color="red" />}
            </span> */}
          </div>
        )}
      />
    </>
  );
};

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? (
    <icons.FaRegFolderOpen className="icon" />
  ) : (
    <icons.FaRegFolder className="icon" />
  );
};

const FileIcon = ({ filename }: { filename: String }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <icons.DiJavascript color="yellow" className="icon" />;
    case "css":
      return <icons.DiCss3 color="turquoise" className="icon" />;
    case "json":
      return <icons.FaList color="white" className="icon" />;
    case "npmignore":
      return <icons.DiNpm color="red" className="icon" />;
    case "py":
      return <icons.FaPython color="DeepSkyBlue" className="icon" />;
    case "md":
      return <icons.FaList color="white" className="icon" />;
    case "cs":
      return <icons.TbBrandCSharp color="DeepSkyBlue" className="icon" />;
    case "cpp":
      return <icons.TbBrandCpp color="DeepSkyBlue" className="icon" />;
    default:
      return null;
  }
};

export default Tree;
