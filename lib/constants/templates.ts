const blankContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{geometry}

\\geometry{a4paper, margin=1in}

\\title{Document Title}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Your introduction goes here.

\\section{Main Content}
Your main content goes here.

\\section{Conclusion}
Your conclusion goes here.

\\end{document}`

const resumeContent = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}
\\usepackage{textcomp}
\\usepackage{amssymb}

\\usepackage[sfdefault]{FiraSans}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\classesList}[4]{
    \\item\\small{
        {#1 #2 #3 #4 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    {\\Huge \\scshape John Doe} \\\\ \\vspace{1pt}
    \\small \\raisebox{-0.1\\height}\\faPhone\\ 555-123-4567 ~ \\href{mailto:johndoe@email.com}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{johndoe@email.com}} ~ 
    \\href{https://www.linkedin.com/in/johndoe}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{linkedin}}  ~
    \\href{https://github.com/johndoe}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{johndoe}}
\\end{center}

\\section{Experience}
  \\resumeSubHeadingListStart
  
\\resumeSubheading
  {TechCorp Solutions}{Jan 2023 -- Current}
  {Software Engineer}{New York, New York}
  \\resumeItemListStart
    \\resumeItem{Led the frontend redesign and development for TechCorp's flagship product, modernizing the user interface and improving user experience.}
    \\resumeItem{Spearheaded the transition from legacy PHP to a modern React and TailwindCSS stack. Authored the initial codebase and was a key contributor in a team of 15.}
    \\resumeItem{Designed over \\textbf{50} screens in Figma, including complex dashboards and authentication flows, which guided the team's UI implementation.}
    \\resumeItem{Developed an AI-powered feature using machine learning models, reducing average query resolution times by \\textbf{3x}.}    
    \\resumeItem{Implemented advanced natural language processing workflows, fine-tuned on custom datasets, and established benchmarks for language model performance.}
    \\resumeItem{Engaged in comprehensive bug fixing, product issue investigation, and provided direct customer support to enhance overall product quality.}
  \\resumeItemListEnd
    
    \\resumeSubheading
      {TechCorp Solutions}{Sept 2022 -- Jan 2023}
      {Software Engineering Intern}{New York, New York}
      \\resumeItemListStart
        \\resumeItem{Designed and implemented a robust undo/redo system for the company's dashboard, handling complex state management across various operations.}
        \\resumeItem{Created a prototype for an intelligent autocomplete feature to enhance the company's log monitoring tool.}
        \\resumeItem{Developed an interactive network visualization tool using D3.js, improving the representation of complex system architectures.}
  \\resumeItemListEnd
    
    \\resumeSubheading
      {Creative Dynamics}{Nov 2021 -- Sep 2022}
      {UX/UI Designer}{San Francisco, California}
      \\resumeItemListStart
        \\resumeItem{Collaborated directly with the Creative Director on high-impact projects for major clients.}
        \\resumeItem{Utilized advanced design tools including Figma, Adobe Creative Suite, and Sketch to create compelling product and marketing designs.}
        \\resumeItem{Produced comprehensive UX deliverables including user flows, wireframes, and interactive prototypes to effectively communicate design concepts.}
        \\resumeItem{Led a series of web development workshops, teaching fundamentals of HTML, CSS, and JavaScript to a group of 25+ aspiring developers.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd
\\vspace{-16pt}

\\section{Projects}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{\\href{https://interactive-chart-demo.vercel.app/}{Interactive Chart}} $|$ \\emph{$\\bigstar$ 300, TypeScript, D3.js }}{July 2024}
          \\resumeItemListStart
            \\resumeItem{Viral project with over 200k impressions on social media, featured by prominent tech influencers.}
            \\resumeItem{A responsive and intuitive charting solution built with modern web technologies and optimized for performance.}
          \\resumeItemListEnd
    \\vspace{-10pt}
    \\resumeProjectHeading
          {\\textbf{\\href{https://ai-search-assistant.vercel.app/}{AI Search Assistant}} $|$ \\emph{TypeScript, React, Redis}}{July 2024}
          \\resumeItemListStart
            \\resumeItem{Developed an AI-powered search tool using cutting-edge technologies including NextJS, Redis for caching, and advanced NLP models.}
            \\resumeItem{Gained significant traction in the developer community with thousands of users and positive feedback.}
          \\resumeItemListEnd
    \\vspace{-10pt}
    \\resumeProjectHeading
          {\\textbf{\\href{https://www.learnsmart.ai/}{LearnSmart}} $|$ \\emph{NextJS, Vercel, Typescript, OpenAI }}{March 2023}
          \\resumeItemListStart
            \\resumeItem{Educational platform that reached 15k active users. Designed engaging UI/UX with Figma and created promotional content using motion graphics.}
            \\resumeItem{Implemented an innovative quiz generation system using AI, creating dynamic and interactive learning experiences.}
            \\resumeItem{Integrated advanced features including LaTeX rendering for mathematical content and code syntax highlighting for programming lessons.}
          \\resumeItemListEnd
        \\vspace{5pt}
    \\resumeSubHeadingListEnd
\\vspace{-15pt}

\\section{Awards}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{National Coding Competition (2021)}{: 15th place nationally, 2x Regional Winner, 2x National Finalist} \\\\
     \\textbf{State Science Olympiad (2020, 2021)}{: 18th place nationally - 7 gold medals (Computer Science, Physics, Chemistry, Biology, Mathematics, Engineering, Robotics)} \\\\
     \\textbf{AP Scholar with Distinction (2020, 2021)}{: Outstanding scores on 10+ AP Exams} \\\\
     \\textbf{Local Community College (2021)}{: STEM Excellence Award, given to top 5 students in the program} \\\\
    }}
 \\end{itemize}
 \\vspace{-16pt}

\\end{document}`

const reportContent = `\\documentclass[12pt,a4paper]{report}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{booktabs}
\\usepackage{hyperref}

\\title{Your Report Title}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle
\\tableofcontents

\\chapter{Introduction}
This is the introduction to your report.

\\chapter{Methodology}
Describe your methodology here.

\\chapter{Results}
Present your results in this chapter.

\\chapter{Discussion}
Discuss your findings here.

\\chapter{Conclusion}
Summarize your report and provide conclusions.

\\appendix
\\chapter{Additional Data}
Include any additional data or information here.

\\bibliographystyle{plain}
\\bibliography{references}

\\end{document}`

const letterContent = `\\documentclass{letter}
\\usepackage{hyperref}
\\usepackage{graphicx}
\\usepackage{color}
\\usepackage{geometry}
\\usepackage{fancyhdr}

\\geometry{
  a4paper,
  left=25mm,
  right=25mm,
  top=30mm,
  bottom=30mm
}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\fancyfoot[C]{\\thepage}

\\signature{John Doe}
\\address{123 Main Street\\\\
Anytown, State 12345\\\\
Phone: (555) 123-4567\\\\
Email: johndoe@email.com}

\\date{\\today}

\\begin{document}

\\begin{letter}{Jane Smith\\\\
456 Oak Avenue\\\\
Othertown, State 67890}

\\opening{Dear Ms. Smith,}

\\noindent I hope this letter finds you well. I am writing to discuss the following important matters:

\\begin{enumerate}
    \\item \\textbf{Project Update:} Our team has made significant progress on the XYZ project. We are currently ahead of schedule and expect to complete the first phase by the end of next month.
    
    \\item \\textbf{Budget Considerations:} Due to recent market changes, we may need to adjust our budget allocation. I've attached a detailed report for your review.
    
    \\item \\textbf{Upcoming Meeting:} I would like to schedule a meeting next week to discuss these points in detail. Please let me know your availability.
\\end{enumerate}

\\noindent Additionally, I wanted to bring your attention to the graph below, which illustrates our project's progress over the past quarter:

\\noindent If you have any questions or concerns, please don't hesitate to reach out. I look forward to our continued collaboration on this project.

\\closing{Best regards,}

\\ps{P.S. Don't forget about the team building event next Friday. It would be great to see you there!}

\\encl{
    Project Progress Report\\\\
    Budget Adjustment Proposal\\\\
    Team Building Event Invitation
}

\\end{letter}

\\end{document}`

const proposalContent = `\\documentclass[12pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}

\\title{Project Proposal}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Executive Summary}
% Provide a brief overview of your proposal

\\section{Problem Statement}
% Clearly define the problem you are addressing

\\section{Proposed Solution}
% Describe your proposed solution in detail

\\section{Methodology}
% Outline the steps you will take to implement your solution

\\section{Timeline}
\\begin{enumerate}[label=\\arabic*.]
    \\item Phase 1: Planning and Research
    \\item Phase 2: Development
    \\item Phase 3: Testing and Refinement
    \\item Phase 4: Implementation
    \\item Phase 5: Evaluation
\\end{enumerate}

\\section{Budget}
% Provide a detailed breakdown of the project costs

\\section{Expected Outcomes}
% Describe the anticipated results and benefits of your project

\\section{Conclusion}
% Summarize the key points of your proposal

\\end{document}`

export const templateContent = {
  article: blankContent,
  report: reportContent,
  resume: resumeContent,
  letter: letterContent,
  proposal: proposalContent,
  blank: blankContent,
}
