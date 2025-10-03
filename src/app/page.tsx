"use client";

import { useState, useEffect, KeyboardEvent, useRef} from "react";

type HistoryEntry = {
  cmd: string;
  output: string;
  showPrompt?: boolean; // default true
};

const fileSystem = {
  about: "Hello! I'm me, and this is my about text.",
  projects: {
    "my-app": "Description of my-app",
    "cli-portfolio": "This CLI website you’re building",
  },
  contact: "aleckshn@gmail.com",
};

const asciiArt = `
 █████╗ ██╗     ███████╗ ██████╗██╗  ██╗    ███████╗██╗  ██╗███████╗███╗   ██╗
██╔══██╗██║     ██╔════╝██╔════╝██║ ██╔╝    ██╔════╝██║  ██║██╔════╝████╗  ██║
███████║██║     █████╗  ██║     █████╔╝     ███████╗███████║█████╗  ██╔██╗ ██║
██╔══██║██║     ██╔══╝  ██║     ██╔═██╗     ╚════██║██╔══██║██╔══╝  ██║╚██╗██║
██║  ██║███████╗███████╗╚██████╗██║  ██╗    ███████║██║  ██║███████╗██║ ╚████║
╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
                                                                              
`

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { cmd: "Welcome!!", output: "" },
    { cmd: "", output: "Welcome to Aleck's Terminal portfolio :D", showPrompt: false },
    { cmd: "", output: asciiArt, showPrompt: false },
    { cmd: "", output: "Type `help` for a list of available commands.", showPrompt: false },
  ]);

  const [input, setInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    if (!cmd) {
      setHistory((h) => [...h, { cmd: "", output: "" }]);
      setInput("");
      return;
    }

    const parts = cmd.split(" ").filter(Boolean);
    const commandName = parts[0];
    const args = parts.slice(1);

    const commands: Record<
      string,
      {
        description: string;
        expectedArgs: number | null; // null = flexible args
        execute: (args: string[]) => string | void;
      }
    > = {
      help: {
        description: "Show available commands",
        expectedArgs: 0,
        execute: () =>
          "Available commands: ls, cd <dir>, cat <file>, clear, help",
      },
      ls: {
        description: "List files in current directory",
        expectedArgs: 0,
        execute: () => "about  projects  contact",
      },
      cd: {
        description: "Change directory",
        expectedArgs: 1,
        execute: (args: string[]) => `changing directory to ${args[0]}`,
      },
      clear: {
        description: "Clear the screen",
        expectedArgs: 0,
        execute: () => {
          setHistory([]);
          setInput("");
        },
      },
    };

    let output = "";

    if (commands[commandName]) {
      const cmdConfig = commands[commandName];
      // If argument count doesn't match, treat as unknown command
      if (cmdConfig.expectedArgs !== null && args.length !== cmdConfig.expectedArgs) {
        output = `command not found: ${cmd}`; // Use the full input here
      } else {
        const result = cmdConfig.execute(args);
        output = result || "";
      }
    } else {
      // command doesn't exist at all
      output = `command not found: ${cmd}`; // Full input again
    }

    // only add to history if not clear
    if (commandName !== "clear") {
      setHistory((h) => [...h, { cmd, output }]);
    }

    setInput("");
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input.trim());
    }
    // TODO: handle up/down arrow history, tab autocomplete etc. do this stuff later ceebs rn
  };

  return (
    <div className="font-mono">
      {history.map((line, i) => (
        <div key={i} className="mb-2">
          {/* Only render prompt if showPrompt !== false */}
          {line.showPrompt !== false && (
            <div className="flex items-start">
              <span className="text-[#97E0A6] mr-2">
                visitor@alecksterminal.com:~$
              </span>
              <span className="text-white break-words">{line.cmd}</span>
            </div>
          )}

          {/* Always render output if it exists */}
          {line.output && (
            <div className="mb-[15px] text-white break-words">
              <pre>{line.output}</pre>
            </div>
          )}
        </div>
      ))}


      <div ref={terminalEndRef} />

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
