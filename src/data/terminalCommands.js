// ASCII art for various commands
const asciiArt = {
  cole: `
   ██████╗ ██████╗ ██╗     ███████╗
  ██╔════╝██╔═══██╗██║     ██╔════╝
  ██║     ██║   ██║██║     █████╗
  ██║     ██║   ██║██║     ██╔══╝
  ╚██████╗╚██████╔╝███████╗███████╗
   ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
       Software Engineer
  `,
  cow: (msg) => `
     ${'_'.repeat(msg.length + 2)}
    < ${msg} >
     ${'-'.repeat(msg.length + 2)}
            \\   ^__^
             \\  (oo)\\_______
                (__)\\       )\\/\\
                    ||----w |
                    ||     ||
  `,
  neofetch: `
         .:'                    cole@portfolio
     __ :'__                    ---------------
  .'\`__\`-'__\`\`.                 OS: Developer 2.0
 :__________.-'                 Host: Indianapolis, IN
 :_________:                    Kernel: CS @ UIndy '26
  :_________\`-;                 Uptime: 21 years
   \`.__.-.__.'                  Shell: JavaScript/Python/Java
                                Resolution: Always learning
   Cole Snipes                  DE: VS Code + Terminal
   Software Engineer            WM: React + Three.js
                                Theme: Tokyo Night
                                CPU: Caffeine-Powered
                                Memory: Full of algorithms
                                GPU: Creative problem solving
`
}

export const commands = {
  help: {
    description: 'List all available commands',
    execute: () => ({
      output: `
Available commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Navigation
  ──────────
    ls              List directories
    cd <dir>        Navigate (about, projects, skills, contact)
    cat <file>      Read file contents

  Information
  ───────────
    whoami          Display current user
    neofetch        System information
    about           About Cole Snipes
    skills          Technical skills
    projects        List projects
    contact         Contact information

  Fun
  ───
    cowsay <msg>    Make a cow say something
    matrix          Enter the Matrix (briefly)
    hack            "Hack" the mainframe
    coffee          Get some fuel

  Special
  ───────
    hire cole       Why you should hire me
    sudo <cmd>      Try it... I dare you
    clear           Clear the terminal
    exit            Return to portfolio

Type any command to get started!
`,
      type: 'help'
    })
  },

  ls: {
    description: 'List directories',
    execute: () => ({
      output: `
drwxr-xr-x  cole  about/
drwxr-xr-x  cole  projects/
drwxr-xr-x  cole  skills/
drwxr-xr-x  cole  contact/
-rw-r--r--  cole  README.md
-rw-r--r--  cole  resume.pdf
`,
      type: 'list'
    })
  },

  cd: {
    description: 'Change directory',
    execute: (args) => {
      const dir = args[0]?.toLowerCase()
      const validDirs = ['about', 'projects', 'skills', 'contact', 'home', '~', '..']

      if (!dir) {
        return { output: 'Usage: cd <directory>\\nTry: cd about', type: 'error' }
      }

      if (validDirs.includes(dir)) {
        const route = dir === '~' || dir === '..' || dir === 'home' ? '/' : `/${dir === 'contact' ? '' : dir}`
        return {
          output: `Navigating to ${dir}...`,
          type: 'navigate',
          route: route === '/contact' ? '/#contact' : route
        }
      }

      return { output: `cd: ${dir}: No such directory`, type: 'error' }
    }
  },

  cat: {
    description: 'Read file contents',
    execute: (args) => {
      const file = args[0]?.toLowerCase()

      const files = {
        'readme.md': `
# Cole Snipes - Portfolio

Welcome to my interactive terminal portfolio!

## Quick Start
- Type 'help' for available commands
- Type 'about' to learn about me
- Type 'projects' to see my work

## Easter Eggs
There might be some hidden commands...
Try: cowsay, matrix, hack

Happy exploring!
`,
        'about.txt': `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${asciiArt.cole}

Computer Science student at University of Indianapolis
Expected graduation: 2026

Passionate about building software that makes a difference.
When I'm not coding, I'm watching the Pacers/Colts or gaming.

"Talk is cheap. Show me the code." - Linus Torvalds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
        'resume.pdf': `
[Binary file - cannot display in terminal]

Download at: /assets/Cole_Snipes_Resume.pdf
Or run: open resume.pdf
`
      }

      if (!file) {
        return { output: 'Usage: cat <filename>\\nTry: cat README.md', type: 'error' }
      }

      const content = files[file] || files[file.replace('.txt', '.md')]
      if (content) {
        return { output: content, type: 'file' }
      }

      return { output: `cat: ${file}: No such file or directory`, type: 'error' }
    }
  },

  whoami: {
    description: 'Display current user',
    execute: () => ({
      output: 'guest@cole-portfolio',
      type: 'info'
    })
  },

  neofetch: {
    description: 'Display system information',
    execute: () => ({
      output: asciiArt.neofetch,
      type: 'neofetch'
    })
  },

  about: {
    description: 'About Cole Snipes',
    execute: () => ({
      output: `
${asciiArt.cole}

Hey! I'm Cole Snipes, a Computer Science student from Indianapolis.

Education:    University of Indianapolis, Class of 2026
Major:        Computer Science
Focus Areas:  Software Engineering, Data Science

I build things that solve real problems. From web apps to data pipelines,
I enjoy the entire process of turning ideas into working software.

Currently seeking: Full-time opportunities, internships, and interesting
collaborations. The CS job market is tough, but I'm tougher.

Type 'skills' to see what I work with, or 'projects' to see what I've built.
`,
      type: 'about'
    })
  },

  skills: {
    description: 'Display technical skills',
    execute: () => ({
      output: `
Technical Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Languages
  ─────────
    ████████████████████  Python
    ██████████████████░░  Java
    ████████████████░░░░  JavaScript
    ████████████░░░░░░░░  C/C++
    ██████████░░░░░░░░░░  Rust
    ████████████████░░░░  SQL

  Frameworks & Tools
  ──────────────────
    ████████████████████  Git
    ██████████████████░░  React
    ████████████████░░░░  Spring Boot
    ████████████████░░░░  Django
    ██████████████░░░░░░  Docker

  Concepts
  ────────
    ████████████████████  Data Structures
    ██████████████████░░  Algorithms
    ████████████████░░░░  System Design
    ████████████████░░░░  REST APIs
    ██████████████░░░░░░  Machine Learning

Type 'cd skills' to see more details on the Skills page.
`,
      type: 'skills'
    })
  },

  projects: {
    description: 'List projects',
    execute: () => ({
      output: `
Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [1]  Portfolio Website
       React, Three.js, Framer Motion
       This very site you're exploring!

  [2]  Data Analysis Projects
       Python, Pandas, Jupyter
       Various data science explorations

  [3]  Course Projects
       Java, Python, C++
       Academic projects and assignments

Type 'cd projects' to see all projects with details.
Or visit: https://github.com/c4snipes
`,
      type: 'projects'
    })
  },

  contact: {
    description: 'Display contact information',
    execute: () => ({
      output: `
Contact Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Email      Cole.Snipes@icloud.com
  LinkedIn   linkedin.com/in/cole-snipes
  GitHub     github.com/c4snipes
  Xbox       SilverCloud595

I'm actively looking for opportunities!
Don't hesitate to reach out.

Type 'hire cole' to see why you should hire me!
`,
      type: 'contact'
    })
  },

  'hire': {
    description: 'Why you should hire Cole',
    execute: (args) => {
      if (args[0]?.toLowerCase() === 'cole') {
        return {
          output: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           WHY HIRE COLE SNIPES?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. PASSION FOR LEARNING
     └─ Constantly exploring new technologies
     └─ Self-driven learner

  2. PROBLEM SOLVER
     └─ Analytical mindset
     └─ Creative solutions to complex problems

  3. TEAM PLAYER
     └─ Strong communication skills
     └─ Collaborative approach

  4. RESULTS-ORIENTED
     └─ Ship working software
     └─ Focus on user impact

  5. DIVERSE SKILL SET
     └─ Full-stack capabilities
     └─ Data science background

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to discuss opportunities?
Email: Cole.Snipes@icloud.com

`,
          type: 'hire'
        }
      }
      return { output: 'Usage: hire cole', type: 'error' }
    }
  },

  cowsay: {
    description: 'Make a cow say something',
    execute: (args) => {
      const message = args.join(' ') || 'Moo!'
      return {
        output: asciiArt.cow(message.substring(0, 40)),
        type: 'fun'
      }
    }
  },

  matrix: {
    description: 'Enter the Matrix',
    execute: () => ({
      output: 'MATRIX_EFFECT',
      type: 'matrix'
    })
  },

  hack: {
    description: 'Hack the mainframe',
    execute: () => ({
      output: `
[*] Initializing hack sequence...
[*] Bypassing firewall... ████████████████ 100%
[*] Accessing mainframe... ████████████████ 100%
[*] Downloading secrets... ████████████████ 100%
[*] Just kidding! This is a portfolio, not a movie.

But seriously, if you want to see some real code:
  GitHub: https://github.com/c4snipes

`,
      type: 'fun'
    })
  },

  coffee: {
    description: 'Get some fuel',
    execute: () => ({
      output: `
    ( (
     ) )
  ........
  |      |]
  \\      /
   \`----'

Here's a virtual coffee!

Fun fact: This portfolio was built on approximately
47 cups of coffee (and counting).

`,
      type: 'fun'
    })
  },

  sudo: {
    description: 'Superuser command',
    execute: (args) => {
      const cmd = args.join(' ')
      if (cmd === 'hire cole') {
        return {
          output: `
[sudo] password for guest: ********
Access granted!

Just kidding about the password, but I appreciate
your enthusiasm for hiring me!

Email: Cole.Snipes@icloud.com

`,
          type: 'sudo'
        }
      }
      if (cmd === 'rm -rf /') {
        return {
          output: `
Nice try!

This portfolio is protected by:
  - React
  - Good humor
  - Backups

Try something more constructive, like: sudo hire cole

`,
          type: 'fun'
        }
      }
      return {
        output: `[sudo] password for guest: ********\\nSorry, user guest is not in the sudoers file.\\n\\nThis incident will be reported... to no one.`,
        type: 'error'
      }
    }
  },

  clear: {
    description: 'Clear the terminal',
    execute: () => ({
      output: 'CLEAR',
      type: 'clear'
    })
  },

  exit: {
    description: 'Exit terminal',
    execute: () => ({
      output: 'EXIT',
      type: 'exit',
      route: '/'
    })
  },

  echo: {
    description: 'Print text',
    execute: (args) => ({
      output: args.join(' ') || '',
      type: 'info'
    })
  },

  pwd: {
    description: 'Print working directory',
    execute: () => ({
      output: '/home/guest/cole-portfolio',
      type: 'info'
    })
  },

  date: {
    description: 'Display current date',
    execute: () => ({
      output: new Date().toString(),
      type: 'info'
    })
  },

  open: {
    description: 'Open a file or URL',
    execute: (args) => {
      const target = args[0]?.toLowerCase()
      if (target === 'resume.pdf') {
        return {
          output: 'Opening resume...',
          type: 'open',
          url: '/assets/Cole_Snipes_Resume.pdf'
        }
      }
      return { output: `open: ${target || 'nothing'}: command not found`, type: 'error' }
    }
  }
}

// Handle unknown commands
export const handleUnknown = (cmd) => ({
  output: `Command not found: ${cmd}\\nType 'help' for available commands.`,
  type: 'error'
})
