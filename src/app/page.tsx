"use client";

import { useState, useEffect, KeyboardEvent, useRef} from "react";

type Theme = {
  background: string;
  text: string;
  accent: string;
};

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
  // themes
  const themes: Record<string, Theme> = {
    default: {
      background: "#1C1E25",
      text: "#FFFFFF",
      accent: "#97E0A6",
    },
    rosepine: {
      background: "#191724",
      text: "#E0DEF4",
      accent: "#EA9A97",
    },
    blizzard: {
      background: "#2E3440",
      text: "#ECEFF4",
      accent: "#88C0D0",
    },
    shoom: {
      background: "#1c181dff",
      text: "#FFFFFF",
      accent: "#F2D0D9",
    }
  };

  const [theme, setTheme] = useState<Theme>(themes.default);
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
        expectedArgs: null, // ignore global arg enforcement
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
        expectedArgs: null, 
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
              setTimeout(() => {
                window.open("https://aleckshen.com/", "_blank");
              }, 1000);
              return "Opening Aleck's personal website...";
            case "quick-quiz":
              setTimeout(() => {
                window.open("https://github.com/aleckshen/quick-quiz", "_blank");
              }, 1000);
              return "Opening quick quiz project...";
            case "pylib":
              setTimeout(() => {
                window.open("https://github.com/aleckshen/pylib", "_blank");
              }, 1000);
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
      
      social: {
        description: "Display my social links",
        expectedArgs: null,
        execute: (args: string[]) => {
          if (args.length > 0) {
            return "Error: `social` does not take any arguments";
          }

          return [
            "",
            "Type `open <social-name>` to open social link.",
            "",
            "instagram      - life updates ^_^",
            "linkedin       - professional stuff",
            "github         - all my coding projects",
            "\n",
          ].join("\n");
        },
      },

      themes: {
        description: "View or set terminal themes",
        expectedArgs: null,
        execute: (args: string[]) => {
          if (args.length === 0) {
            return [
              "",
              "Type `themes set <theme-name>` to set a theme.",
              "",
              "Available themes:",
              "default",
              "rosepine",
              "blizzard",
              "shoom",
              "\n",
            ].join("\n");
          }

          if (args[0] === "set") {
            const selected = args[1];
            if (!selected) return "Error: specify a theme (e.g. themes set shoom)";
            if (!(selected in themes)) return `Error: theme '${selected}' not found`;

            const newTheme = themes[selected as keyof typeof themes];

            // update CSS variables globally
            document.documentElement.style.setProperty("--background-color", newTheme.background);
            document.documentElement.style.setProperty("--text-color", newTheme.text);
            document.documentElement.style.setProperty("--highlight-color", newTheme.accent);

            // also update local React state for terminal component (optional, if you style inner div separately)
            setTheme(newTheme);

            return `Theme changed to '${selected}' successfully!`;
          }


          return "Invalid syntax. Try `themes set <theme-name>`";
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

  const highlightBackticks = (text: string) => {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /`([^`]+)`/g,
    '<span style="color:var(--highlight-color)">`$1`</span>'
  );
};



  return (
    <div
      className="font-mono p-4"
      style={{
        color: theme.text,
        transition: "background-color 0.5s, color 0.5s",
      }}
    >
      {history.map((line, i) => (
        <div key={i} className="mb-2">
          {line.showPrompt !== false && (
            <div className="flex items-start">
              <span
                className="mr-2 whitespace-nowrap"
                style={{ color: theme.accent }}
              >
                visitor@alecksterminal.com:~$
              </span>
              <span className="break-words">{line.cmd}</span>
            </div>
          )}

          {line.output && (
            <pre
              className="mb-[15px] break-words whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: highlightBackticks(line.output) }}
            />
          )}
        </div>
      ))}

      <div ref={terminalEndRef} />

      <div className="flex items-start">
        <span
          className="mr-2 whitespace-nowrap"
          style={{ color: theme.accent }}
        >
          visitor@alecksterminal.com:~$
        </span>
        <input
          className="bg-transparent outline-none flex-1"
          style={{ color: theme.text }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}
