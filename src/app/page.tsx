"use client";

import { useState, KeyboardEvent } from "react";

type HistoryEntry = {
  cmd: string;
  output: string;
};

const fileSystem = {
  about: "Hello! I'm me, and this is my about text.",
  projects: {
    "my-app": "Description of my-app",
    "cli-portfolio": "This CLI website you’re building",
  },
  contact: "aleckshn@gmail.com",
};

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [pathStack, setPathStack] = useState<string[]>([]); 
  
  const getCurrentNode = () => {
    let node: any = fileSystem;
    for (const seg of pathStack) {
      node = node[seg];
    }
    return node;
  };

  const handleCommand = (cmd: string) => {
    if (!cmd) {
      // skip empty
      return;
    }
    let output = "";
    const parts = cmd.split(" ").filter(Boolean);
    const root = getCurrentNode();


    /* change to js object e.g const commands = {"ls": {length: x, description: xxx}}
    function defaultExecute(obj) {
      print(obj.output);
    }

    function complicatedCmdExecute(obj) {
      defaultExecute(obj);
      navigate();
    }

    commands = {
      ls: {
        length: 1,
        description: "whatever",
        output: "whatever you wanna output",
        execute: defaultExecute,
      },
      complicatedCmd: {
        length: 1,
        description: "whatever",
        output: "whatever you wanna output 2",
        execute: complicatedCmdExecute,
      },
    };

    // check commands[arg] exists;
    commands[arg].execute();
    */

    switch (parts[0]) {
      case "ls":
        if (typeof root === "object") {
          output = Object.keys(root).join("  ");
        } else {
          output = "";
        }
        break;
      case "cd":
        if (parts.length < 2) {
          output = "cd: missing argument";
        } else {
          const dir = parts[1];
          if (
            root &&
            typeof root === "object" &&
            dir in root &&
            typeof root[dir] === "object"
          ) {
            setPathStack((prev) => [...prev, dir]);
            output = "";
          } else {
            output = `cd: no such directory: ${dir}`;
          }
        }
        break;
      case "cat":
        if (parts.length < 2) {
          output = "cat: missing argument";
        } else {
          const file = parts[1];
          if (root && typeof root === "object" && file in root && typeof root[file] === "string") {
            output = root[file];
          } else {
            output = `cat: no such file: ${file}`;
          }
        }
        break;
      case "help":
        output = "Available commands: ls, cd <dir>, cat <file>, clear, help";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        output = `command not found: ${parts[0]}`;
    }

    setHistory((h) => [...h, { cmd, output }]);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input.trim());
    }
    // TODO: handle up/down arrow history, tab autocomplete etc. do this stuff later ceebs rn
  };

  const cwd = pathStack.length > 0 ? `~/${pathStack.join("/")}` : "~";

  return (
    <div className="min-h-screen font-mono">
      {history.map((line, i) => (
        <div key={i} className="mb-2"> 
          <div className="flex items-start">
            <span className="text-[#97E0A6] mr-2">
              visitor@alecksterminal.com:~$
            </span>
            <span className="text-white break-words">{line.cmd}</span>
          </div>
          {line.output && (
            <div className="mb-[15px] text-white break-words">{line.output}</div>
          )}
        </div>
      ))}

      <div className="flex items-start">
        <span className="text-[#97E0A6] mr-2 whitespace-nowrap">
          visitor@alecksterminal.com:~$
        </span>
        <input
          className="bg-transparent text-white outline-none flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}
