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
      // If nothing entered, still add a blank entry to history
      setHistory((h) => [...h, { cmd: "", output: "" }]);
      setInput("");
      return;
    }
    let output = "";
    const parts = cmd.split(" ").filter(Boolean);
    const root = getCurrentNode();

    
    const commands: Record<
    string,
    {
      description: string;
      execute: (args: string[]) => string | void;
    }
    > = {
      ls: {
        description: "List directory contents",
        execute: () => {
          const root = getCurrentNode();
          if (typeof root === "object") {
            return Object.keys(root).join("  ");
          }
          return "";
        },
      },
      cd: {
        description: "Change directory",
        execute: (args) => {
          const root = getCurrentNode();
          if (args.length < 1) return "cd: missing argument";
          const dir = args[0];
          if (
            root &&
            typeof root === "object" &&
            dir in root &&
            typeof root[dir] === "object"
          ) {
            setPathStack((prev) => [...prev, dir]);
            return "";
          }
          return `cd: no such directory: ${dir}`;
        },
      },
      cat: {
        description: "View file contents",
        execute: (args) => {
          const root = getCurrentNode();
          if (args.length < 1) return "cat: missing argument";
          const file = args[0];
          if (
            root &&
            typeof root === "object" &&
            file in root &&
            typeof root[file] === "string"
          ) {
            return root[file];
          }
          return `cat: no such file: ${file}`;
        },
      },
      help: {
        description: "Show available commands",
        execute: () => {
          return Object.entries(commands)
            .map(([name, cmd]) => `${name} - ${cmd.description}`)
            .join("\n");
        },
      },
      clear: {
        description: "Clear the screen",
        execute: () => {
          setHistory([]);
          setInput("");
        },
      },
    };

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
