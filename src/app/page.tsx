"use client";

import { useState, useEffect, KeyboardEvent, useRef} from "react";

type HistoryEntry = {
  cmd: string;
  output: string;
  showPrompt?: boolean; // default true
};

// good ascii art fonts: Terrace, ANSI shadow
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
        description: "Pretty intuitive right xd",
        expectedArgs: null, // we'll ignore global arg enforcement
        execute: (args: string[]) => {
          if (args.length > 0) {
            return "Error: `help` does not take any arguments";
          }

          return [
            "",
            "Available commands:",
            "",
            "about          - brief description about me",
            "projects       - view my coding projects",
            "social         - view my social links",
            "email          - view my email address",
            "themes         - view available themes",
            "welcome        - displays hero banner",
            "clear          - clear terminal history",
            "help           - pretty self explanatory xd",
            "\n",
          ].join("\n");
        },
      },


      clear: {
        description: "Clears all terminal history",
        expectedArgs: 0,
        execute: () => {
          setHistory([]);
          setInput("");
        },
      },

      about: {
        description: "Brief description about me",
        expectedArgs: null, // let command handle validation
        execute: (args: string[]) => {
          if (args.length > 0) {
            return "Error: `about` does not take any arguments";
          }

          return [
            "",
            "Hello! My name is Aleck :)",
            "I'm a second year computer science major studying at the University of Auckland",
            "I'm passionate about web development and love creating interactive and user-friendly applications.",
            "\n",
          ].join("\n");
        },
      },

      projects: {
        description: "View my coding projects",
        expectedArgs: null,
        execute: (args: string[]) => {
          if (args.length > 0) {
            return "Error: `projects` does not take any arguments";
          }

          return [
            "",
            "Type `open <project-name>` to view a project.",
            "",
            "aleck          - personal-website",
            "quick-quiz     - web-based quiz application",
            "pylib          - cli tool that picks auckland libraries at random",
            "\n",
          ].join("\n");
        },
      },

      open: {
        description: "Navigate to a project or page",
        expectedArgs: 1, 
        execute: (args: string[]) => {
          if (args.length < 1) {
            return "Error: `open` requires a second parameter (e.g. open aleck)";
          }

          const target = args[0];

          switch (target) {
            case "aleck":
              window.open("https://aleckshen.com/", "_blank");
              return "Opening Aleck's personal website...";
            case "quick-quiz":
              window.open("https://github.com/aleckshen/quick-quiz", "_blank");
              return "Opening quick quiz project...";
            case "pylib":
              window.open("https://github.com/aleckshen/pylib", "_blank");
              return "Opening pylib project...";
            default:
              return `Unknown target: ${target}`;
          }
        },
      },


      email: {
        description: "View my email address",
        expectedArgs: null,
        execute: (args: string[]) => {
          if (args.length > 0) {
            return "Error: `email` does not take any arguments";
          }

          return [
            "",
            "aleckshn@gmail.com             - personal email",
            "shae628@aucklanduni.ac.nz      - university email",
            "\n",
          ].join("\n");
        },
      },

      welcome: {
        description: "Displays the welcome banner",
        expectedArgs: null,
        execute: (args: string[]) => {
          if (args.length > 0) {
            return "Error: `welcome` does not take any arguments";
          }

          return "\n" + "Welcome to Aleck's Terminal portfolio :D" + 
          "\n" + asciiArt + "Type `help` for a list of available commands.";
        },
      },


    };

    let output = "";

    if (commands[commandName]) {
      const cmdConfig = commands[commandName];
      // lets commands handle their own arg errors
      const result = cmdConfig.execute(args);
      output = result || "";
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
