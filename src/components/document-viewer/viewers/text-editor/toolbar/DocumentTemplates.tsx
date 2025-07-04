
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileImage, GraduationCap, Briefcase, Heart, Users, Calendar, Target, BookOpen, FileCheck, Mail, PenTool, Clipboard, Award, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Editor } from '@tiptap/react';
import { useToast } from '@/hooks/use-toast';

interface DocumentTemplatesProps {
  editor: Editor;
}

interface Template {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
  content: string;
}

const templates: Template[] = [
  // Business Templates
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    icon: Users,
    category: 'Business',
    content: `
      <h1>Meeting Notes</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Time:</strong> </p>
      <p><strong>Attendees:</strong> </p>
      <p><strong>Meeting Lead:</strong> </p>
      
      <h2>Agenda</h2>
      <ul>
        <li>Opening remarks</li>
        <li>Review of previous meeting</li>
        <li>Main discussion points</li>
        <li>Action items review</li>
        <li>Next steps</li>
      </ul>
      
      <h2>Discussion Points</h2>
      <p><strong>Topic 1:</strong></p>
      <p>Discussion summary...</p>
      
      <p><strong>Topic 2:</strong></p>
      <p>Discussion summary...</p>
      
      <h2>Decisions Made</h2>
      <ul>
        <li>Decision 1 with rationale</li>
        <li>Decision 2 with rationale</li>
      </ul>
      
      <h2>Action Items</h2>
      <ul>
        <li><strong>Task:</strong> [Description] - [Assignee] - [Due Date]</li>
        <li><strong>Task:</strong> [Description] - [Assignee] - [Due Date]</li>
      </ul>
      
      <h2>Next Meeting</h2>
      <p><strong>Date:</strong> </p>
      <p><strong>Agenda items:</strong> </p>
    `
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    icon: Briefcase,
    category: 'Business',
    content: `
      <h1>Project Proposal</h1>
      <p><strong>Project Title:</strong> </p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Prepared by:</strong> </p>
      <p><strong>Department:</strong> </p>
      
      <h2>Executive Summary</h2>
      <p>Brief overview of the project, key objectives, and expected outcomes...</p>
      
      <h2>Project Background</h2>
      <p>Context and rationale for the project...</p>
      
      <h2>Project Objectives</h2>
      <ul>
        <li><strong>Primary Objective:</strong> </li>
        <li><strong>Secondary Objectives:</strong> </li>
        <li><strong>Success Metrics:</strong> </li>
      </ul>
      
      <h2>Scope of Work</h2>
      <h3>In Scope:</h3>
      <ul>
        <li>Deliverable 1</li>
        <li>Deliverable 2</li>
      </ul>
      
      <h3>Out of Scope:</h3>
      <ul>
        <li>Exclusion 1</li>
        <li>Exclusion 2</li>
      </ul>
      
      <h2>Timeline & Milestones</h2>
      <table>
        <tr><th>Phase</th><th>Duration</th><th>Key Deliverables</th></tr>
        <tr><td>Phase 1</td><td>4 weeks</td><td>Planning & Design</td></tr>
        <tr><td>Phase 2</td><td>8 weeks</td><td>Development</td></tr>
        <tr><td>Phase 3</td><td>2 weeks</td><td>Testing & Launch</td></tr>
      </table>
      
      <h2>Budget Estimate</h2>
      <p><strong>Total Budget:</strong> $</p>
      <ul>
        <li>Personnel: $</li>
        <li>Technology: $</li>
        <li>Other expenses: $</li>
      </ul>
      
      <h2>Risk Assessment</h2>
      <ul>
        <li><strong>Risk 1:</strong> Description and mitigation strategy</li>
        <li><strong>Risk 2:</strong> Description and mitigation strategy</li>
      </ul>
      
      <h2>Conclusion & Next Steps</h2>
      <p>Summary and recommended actions...</p>
    `
  },
  {
    id: 'business-plan',
    name: 'Business Plan',
    icon: TrendingUp,
    category: 'Business',
    content: `
      <h1>Business Plan</h1>
      <p><strong>Company Name:</strong> </p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Version:</strong> 1.0</p>
      
      <h2>Executive Summary</h2>
      <p>Brief overview of your business concept, target market, and financial projections...</p>
      
      <h2>Company Description</h2>
      <p><strong>Mission Statement:</strong> </p>
      <p><strong>Vision:</strong> </p>
      <p><strong>Company History:</strong> </p>
      
      <h2>Market Analysis</h2>
      <h3>Industry Overview</h3>
      <p>Analysis of your industry...</p>
      
      <h3>Target Market</h3>
      <p>Description of your ideal customers...</p>
      
      <h3>Competitive Analysis</h3>
      <p>Analysis of your competitors...</p>
      
      <h2>Products & Services</h2>
      <p>Detailed description of what you're offering...</p>
      
      <h2>Marketing & Sales Strategy</h2>
      <h3>Marketing Mix</h3>
      <ul>
        <li><strong>Product:</strong> </li>
        <li><strong>Price:</strong> </li>
        <li><strong>Place:</strong> </li>
        <li><strong>Promotion:</strong> </li>
      </ul>
      
      <h2>Financial Projections</h2>
      <h3>Revenue Forecast (3 Years)</h3>
      <p>Year 1: $</p>
      <p>Year 2: $</p>
      <p>Year 3: $</p>
      
      <h2>Funding Requirements</h2>
      <p>Amount needed and how it will be used...</p>
    `
  },

  // Academic Templates
  {
    id: 'essay-outline',
    name: 'Essay Outline',
    icon: GraduationCap,
    category: 'Academic',
    content: `
      <h1>Essay Title</h1>
      <p><strong>Subject:</strong> </p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Word Count Target:</strong> </p>
      
      <h2>I. Introduction</h2>
      <ul>
        <li><strong>Hook:</strong> Attention-grabbing opening</li>
        <li><strong>Background:</strong> Context and background information</li>
        <li><strong>Thesis Statement:</strong> Main argument or position</li>
      </ul>
      
      <h2>II. Body Paragraph 1</h2>
      <ul>
        <li><strong>Topic Sentence:</strong> Main idea of paragraph</li>
        <li><strong>Evidence:</strong> Supporting facts, quotes, or examples</li>
        <li><strong>Analysis:</strong> Explanation of how evidence supports thesis</li>
        <li><strong>Transition:</strong> Link to next paragraph</li>
      </ul>
      
      <h2>III. Body Paragraph 2</h2>
      <ul>
        <li><strong>Topic Sentence:</strong> </li>
        <li><strong>Evidence:</strong> </li>
        <li><strong>Analysis:</strong> </li>
        <li><strong>Transition:</strong> </li>
      </ul>
      
      <h2>IV. Body Paragraph 3</h2>
      <ul>
        <li><strong>Topic Sentence:</strong> </li>
        <li><strong>Evidence:</strong> </li>
        <li><strong>Analysis:</strong> </li>
        <li><strong>Transition:</strong> </li>
      </ul>
      
      <h2>V. Counterargument (Optional)</h2>
      <ul>
        <li><strong>Opposing View:</strong> </li>
        <li><strong>Refutation:</strong> </li>
      </ul>
      
      <h2>VI. Conclusion</h2>
      <ul>
        <li><strong>Restate Thesis:</strong> Rephrase main argument</li>
        <li><strong>Summarize Main Points:</strong> Key supporting arguments</li>
        <li><strong>Final Thought:</strong> Broader implications or call to action</li>
      </ul>
      
      <h2>Works Cited</h2>
      <p>(Add your sources here)</p>
    `
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    icon: BookOpen,
    category: 'Academic',
    content: `
      <h1>Research Paper Title</h1>
      <p><strong>Author:</strong> </p>
      <p><strong>Course:</strong> </p>
      <p><strong>Professor:</strong> </p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>Abstract</h2>
      <p>A brief summary of your research, methodology, findings, and conclusions (150-250 words)...</p>
      
      <h2>1. Introduction</h2>
      <h3>1.1 Background</h3>
      <p>Context and background information...</p>
      
      <h3>1.2 Problem Statement</h3>
      <p>The specific problem or question your research addresses...</p>
      
      <h3>1.3 Research Objectives</h3>
      <ul>
        <li>Primary objective</li>
        <li>Secondary objectives</li>
      </ul>
      
      <h3>1.4 Thesis Statement</h3>
      <p>Your main argument or hypothesis...</p>
      
      <h2>2. Literature Review</h2>
      <p>Review of existing research and how your work fits into the broader academic conversation...</p>
      
      <h2>3. Methodology</h2>
      <h3>3.1 Research Design</h3>
      <p>Approach and methods used...</p>
      
      <h3>3.2 Data Collection</h3>
      <p>How data was gathered...</p>
      
      <h3>3.3 Analysis Methods</h3>
      <p>How data was analyzed...</p>
      
      <h2>4. Results</h2>
      <p>Presentation of your findings...</p>
      
      <h2>5. Discussion</h2>
      <h3>5.1 Interpretation of Results</h3>
      <p>What your findings mean...</p>
      
      <h3>5.2 Limitations</h3>
      <p>Acknowledgment of study limitations...</p>
      
      <h2>6. Conclusion</h2>
      <p>Summary of findings and their implications...</p>
      
      <h2>References</h2>
      <p>(Add your academic citations here)</p>
    `
  },
  {
    id: 'lab-report',
    name: 'Lab Report',
    icon: FileCheck,
    category: 'Academic',
    content: `
      <h1>Lab Report: [Experiment Title]</h1>
      <p><strong>Student Name:</strong> </p>
      <p><strong>Lab Partner(s):</strong> </p>
      <p><strong>Course:</strong> </p>
      <p><strong>Date Performed:</strong> </p>
      <p><strong>Date Submitted:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>1. Objective</h2>
      <p>State the purpose of the experiment and what you hoped to learn or prove...</p>
      
      <h2>2. Hypothesis</h2>
      <p>Your prediction about the outcome of the experiment...</p>
      
      <h2>3. Materials and Equipment</h2>
      <ul>
        <li>Material 1</li>
        <li>Material 2</li>
        <li>Equipment 1</li>
        <li>Equipment 2</li>
      </ul>
      
      <h2>4. Procedure</h2>
      <ol>
        <li>Step 1: Detailed description</li>
        <li>Step 2: Detailed description</li>
        <li>Step 3: Detailed description</li>
        <li>Continue with all steps...</li>
      </ol>
      
      <h2>5. Observations and Data</h2>
      <h3>5.1 Qualitative Observations</h3>
      <p>What you observed during the experiment...</p>
      
      <h3>5.2 Quantitative Data</h3>
      <table>
        <tr><th>Trial</th><th>Measurement 1</th><th>Measurement 2</th><th>Result</th></tr>
        <tr><td>1</td><td></td><td></td><td></td></tr>
        <tr><td>2</td><td></td><td></td><td></td></tr>
        <tr><td>3</td><td></td><td></td><td></td></tr>
      </table>
      
      <h2>6. Calculations</h2>
      <p>Show all mathematical work and formulas used...</p>
      
      <h2>7. Results</h2>
      <p>Summary of your findings based on data analysis...</p>
      
      <h2>8. Discussion</h2>
      <h3>8.1 Analysis</h3>
      <p>Interpretation of results...</p>
      
      <h3>8.2 Sources of Error</h3>
      <ul>
        <li>Possible error source 1 and its impact</li>
        <li>Possible error source 2 and its impact</li>
      </ul>
      
      <h2>9. Conclusion</h2>
      <p>Was your hypothesis supported? What did you learn?</p>
      
      <h2>10. References</h2>
      <p>(Lab manual, textbook, or other sources consulted)</p>
    `
  },

  // Personal Templates
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    icon: Heart,
    category: 'Personal',
    content: `
      <h1>Daily Journal Entry</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Weather:</strong> </p>
      <p><strong>Mood:</strong> </p>
      
      <h2>Today's Highlights</h2>
      <ul>
        <li>Best moment of the day</li>
        <li>Something that made me smile</li>
        <li>An accomplishment, big or small</li>
      </ul>
      
      <h2>Reflections & Feelings</h2>
      <p>How I'm feeling today and why...</p>
      
      <h2>Challenges & Learning</h2>
      <p>Difficulties I faced and what I learned from them...</p>
      
      <h2>Gratitude</h2>
      <p>Three things I'm grateful for today:</p>
      <ol>
        <li></li>
        <li></li>
        <li></li>
      </ol>
      
      <h2>Interactions & Relationships</h2>
      <p>Meaningful conversations or interactions with others...</p>
      
      <h2>Personal Growth</h2>
      <p>How I grew or what I discovered about myself today...</p>
      
      <h2>Tomorrow's Intentions</h2>
      <ul>
        <li>Goal for tomorrow</li>
        <li>Something to focus on</li>
        <li>How I want to feel</li>
      </ul>
      
      <h2>Random Thoughts</h2>
      <p>Anything else on my mind...</p>
    `
  },
  {
    id: 'goal-setting',
    name: 'Goal Setting Template',
    icon: Target,
    category: 'Personal',
    content: `
      <h1>Goal Setting Worksheet</h1>
      <p><strong>Date Created:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Review Date:</strong> </p>
      
      <h2>Vision Statement</h2>
      <p>My overall vision for this area of my life...</p>
      
      <h2>SMART Goal Framework</h2>
      <h3>Specific</h3>
      <p>What exactly do I want to accomplish?</p>
      
      <h3>Measurable</h3>
      <p>How will I measure progress and success?</p>
      
      <h3>Achievable</h3>
      <p>Is this goal realistic given my current situation?</p>
      
      <h3>Relevant</h3>
      <p>Why is this goal important to me?</p>
      
      <h3>Time-bound</h3>
      <p>When will I achieve this goal?</p>
      
      <h2>Action Steps</h2>
      <h3>Month 1</h3>
      <ul>
        <li>Action item 1</li>
        <li>Action item 2</li>
        <li>Action item 3</li>
      </ul>
      
      <h3>Month 2</h3>
      <ul>
        <li>Action item 1</li>
        <li>Action item 2</li>
        <li>Action item 3</li>
      </ul>
      
      <h3>Month 3</h3>
      <ul>
        <li>Action item 1</li>
        <li>Action item 2</li>
        <li>Action item 3</li>
      </ul>
      
      <h2>Potential Obstacles</h2>
      <ul>
        <li><strong>Obstacle 1:</strong> Strategy to overcome</li>
        <li><strong>Obstacle 2:</strong> Strategy to overcome</li>
        <li><strong>Obstacle 3:</strong> Strategy to overcome</li>
      </ul>
      
      <h2>Support System</h2>
      <p>People who can help me achieve this goal:</p>
      <ul>
        <li>Person 1 - How they can help</li>
        <li>Person 2 - How they can help</li>
      </ul>
      
      <h2>Resources Needed</h2>
      <ul>
        <li>Resource 1</li>
        <li>Resource 2</li>
        <li>Resource 3</li>
      </ul>
      
      <h2>Milestones & Rewards</h2>
      <ul>
        <li><strong>25% Complete:</strong> Reward</li>
        <li><strong>50% Complete:</strong> Reward</li>
        <li><strong>75% Complete:</strong> Reward</li>
        <li><strong>100% Complete:</strong> Celebration</li>
      </ul>
      
      <h2>Progress Tracking</h2>
      <p>How I will track my progress weekly/monthly...</p>
    `
  },

  // Communication Templates
  {
    id: 'formal-letter',
    name: 'Formal Letter',
    icon: Mail,
    category: 'Communication',
    content: `
      <p style="text-align: right;">[Your Name]<br>
      [Your Address]<br>
      [City, State ZIP Code]<br>
      [Email Address]<br>
      [Phone Number]<br>
      ${new Date().toLocaleDateString()}</p>
      
      <p>[Recipient's Name]<br>
      [Title]<br>
      [Company/Organization]<br>
      [Address]<br>
      [City, State ZIP Code]</p>
      
      <p>Dear [Mr./Ms./Dr.] [Recipient's Last Name],</p>
      
      <p>I am writing to [state your purpose clearly in the opening sentence].</p>
      
      <p>[First body paragraph - Provide context or background information. Explain the situation or reason for writing.]</p>
      
      <p>[Second body paragraph - Present your main points, requests, or arguments. Use specific details and examples to support your position.]</p>
      
      <p>[Third body paragraph - Discuss any next steps, timeline, or call to action. Be clear about what you expect or need from the recipient.]</p>
      
      <p>Thank you for your time and consideration. I look forward to your prompt response.</p>
      
      <p>Sincerely,<br><br>
      [Your Signature]<br>
      [Your Typed Name]<br>
      [Your Title/Position]</p>
      
      <p>Enclosures: [List any documents attached]</p>
    `
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    icon: FileText,
    category: 'Communication',
    content: `
      <p style="text-align: right;">[Your Name]<br>
      [Your Address]<br>
      [City, State ZIP Code]<br>
      [Email Address]<br>
      [Phone Number]<br>
      ${new Date().toLocaleDateString()}</p>
      
      <p>[Hiring Manager's Name]<br>
      [Title]<br>
      [Company Name]<br>
      [Company Address]<br>
      [City, State ZIP Code]</p>
      
      <p>Dear [Hiring Manager's Name / Hiring Manager],</p>
      
      <h3>Opening Paragraph</h3>
      <p>I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my [relevant experience/background], I am excited about the opportunity to contribute to [specific company goal or project].</p>
      
      <h3>Body Paragraph 1 - Skills & Experience</h3>
      <p>In my [previous role/current position] as [job title] at [company], I have developed strong skills in [relevant skills]. For example, [specific achievement or project that demonstrates your abilities]. This experience has prepared me to [relevant responsibility from job posting].</p>
      
      <h3>Body Paragraph 2 - Company Connection</h3>
      <p>What particularly attracts me to [Company Name] is [specific reason - company values, mission, recent news, etc.]. I am impressed by [specific company achievement or initiative], and I would be thrilled to contribute to [relevant company goal].</p>
      
      <h3>Closing Paragraph</h3>
      <p>I would welcome the opportunity to discuss how my background in [relevant field] and passion for [relevant area] can contribute to [Company Name]'s continued success. Thank you for considering my application. I look forward to hearing from you soon.</p>
      
      <p>Sincerely,<br><br>
      [Your Name]</p>
    `
  },

  // Planning Templates
  {
    id: 'event-planning',
    name: 'Event Planning',
    icon: Calendar,
    category: 'Planning',
    content: `
      <h1>Event Planning Checklist</h1>
      <p><strong>Event Name:</strong> </p>
      <p><strong>Date:</strong> </p>
      <p><strong>Time:</strong> </p>
      <p><strong>Venue:</strong> </p>
      <p><strong>Expected Attendees:</strong> </p>
      <p><strong>Budget:</strong> $</p>
      
      <h2>8 Weeks Before Event</h2>
      <h3>Planning & Budgeting</h3>
      <ul>
        <li>☐ Define event objectives and goals</li>
        <li>☐ Set preliminary budget</li>
        <li>☐ Create guest list</li>
        <li>☐ Research and book venue</li>
        <li>☐ Choose event date and time</li>
      </ul>
      
      <h2>6 Weeks Before Event</h2>
      <h3>Vendors & Services</h3>
      <ul>
        <li>☐ Book catering services</li>
        <li>☐ Arrange entertainment/speakers</li>
        <li>☐ Order decorations and supplies</li>
        <li>☐ Arrange transportation if needed</li>
        <li>☐ Set up registration/ticketing system</li>
      </ul>
      
      <h2>4 Weeks Before Event</h2>
      <h3>Marketing & Invitations</h3>
      <ul>
        <li>☐ Send invitations/save the dates</li>
        <li>☐ Create event marketing materials</li>
        <li>☐ Set up event website/social media</li>
        <li>☐ Finalize menu with caterer</li>
        <li>☐ Confirm all vendor bookings</li>
      </ul>
      
      <h2>2 Weeks Before Event</h2>
      <h3>Final Preparations</h3>
      <ul>
        <li>☐ Confirm final headcount</li>
        <li>☐ Prepare event timeline/schedule</li>
        <li>☐ Brief all staff and volunteers</li>
        <li>☐ Prepare welcome packets/materials</li>
        <li>☐ Confirm setup and breakdown plans</li>
      </ul>
      
      <h2>1 Week Before Event</h2>
      <h3>Last-Minute Details</h3>
      <ul>
        <li>☐ Final headcount to caterer</li>
        <li>☐ Prepare seating arrangements</li>
        <li>☐ Pack emergency kit</li>
        <li>☐ Confirm all logistics with venue</li>
        <li>☐ Send final reminders to attendees</li>
      </ul>
      
      <h2>Day of Event</h2>
      <h3>Execution</h3>
      <ul>
        <li>☐ Arrive early for setup</li>
        <li>☐ Coordinate with all vendors</li>
        <li>☐ Brief staff on final details</li>
        <li>☐ Set up registration/check-in</li>
        <li>☐ Conduct final venue walkthrough</li>
      </ul>
      
      <h2>After Event</h2>
      <h3>Follow-up</h3>
      <ul>
        <li>☐ Send thank you notes</li>
        <li>☐ Process feedback surveys</li>
        <li>☐ Pay final vendor invoices</li>
        <li>☐ Document lessons learned</li>
        <li>☐ Archive event materials</li>
      </ul>
      
      <h2>Budget Breakdown</h2>
      <table>
        <tr><th>Category</th><th>Budgeted</th><th>Actual</th><th>Notes</th></tr>
        <tr><td>Venue</td><td>$</td><td>$</td><td></td></tr>
        <tr><td>Catering</td><td>$</td><td>$</td><td></td></tr>
        <tr><td>Entertainment</td><td>$</td><td>$</td><td></td></tr>
        <tr><td>Decorations</td><td>$</td><td>$</td><td></td></tr>
        <tr><td>Marketing</td><td>$</td><td>$</td><td></td></tr>
        <tr><td>Other</td><td>$</td><td>$</td><td></td></tr>
        <tr><td><strong>Total</strong></td><td><strong>$</strong></td><td><strong>$</strong></td><td></td></tr>
      </table>
      
      <h2>Contact Information</h2>
      <ul>
        <li><strong>Venue Contact:</strong> </li>
        <li><strong>Caterer:</strong> </li>
        <li><strong>Entertainment:</strong> </li>
        <li><strong>Decorator:</strong> </li>
      </ul>
    `
  },
  {
    id: 'project-charter',
    name: 'Project Charter',
    icon: Clipboard,
    category: 'Planning',
    content: `
      <h1>Project Charter</h1>
      <p><strong>Project Name:</strong> </p>
      <p><strong>Project Manager:</strong> </p>
      <p><strong>Date Created:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Sponsor:</strong> </p>
      
      <h2>1. Project Overview</h2>
      <h3>1.1 Project Purpose</h3>
      <p>Why is this project being undertaken?</p>
      
      <h3>1.2 Project Description</h3>
      <p>Brief description of what the project will accomplish...</p>
      
      <h3>1.3 Project Justification</h3>
      <p>Business case for why this project is necessary...</p>
      
      <h2>2. Project Objectives</h2>
      <h3>2.1 Primary Objectives</h3>
      <ul>
        <li>Objective 1 with success criteria</li>
        <li>Objective 2 with success criteria</li>
        <li>Objective 3 with success criteria</li>
      </ul>
      
      <h3>2.2 Success Criteria</h3>
      <p>How will project success be measured?</p>
      
      <h2>3. Project Scope</h2>
      <h3>3.1 In Scope</h3>
      <ul>
        <li>What is included in the project</li>
        <li>Key deliverables</li>
        <li>Boundaries of the project</li>
      </ul>
      
      <h3>3.2 Out of Scope</h3>
      <ul>
        <li>What is explicitly excluded</li>
        <li>Items for future consideration</li>
      </ul>
      
      <h2>4. Stakeholders</h2>
      <table>
        <tr><th>Stakeholder</th><th>Role</th><th>Expectations</th><th>Influence</th></tr>
        <tr><td>Project Sponsor</td><td></td><td></td><td>High</td></tr>
        <tr><td>Project Manager</td><td></td><td></td><td>High</td></tr>
        <tr><td>End Users</td><td></td><td></td><td>Medium</td></tr>
      </table>
      
      <h2>5. High-Level Timeline</h2>
      <table>
        <tr><th>Milestone</th><th>Target Date</th><th>Description</th></tr>
        <tr><td>Project Initiation</td><td></td><td>Project charter approved</td></tr>
        <tr><td>Phase 1 Complete</td><td></td><td>Planning phase finished</td></tr>
        <tr><td>Phase 2 Complete</td><td></td><td>Execution phase finished</td></tr>
        <tr><td>Project Closure</td><td></td><td>Final deliverables accepted</td></tr>
      </table>
      
      <h2>6. Budget Estimate</h2>
      <p><strong>Total Project Budget:</strong> $</p>
      <ul>
        <li>Personnel costs: $</li>
        <li>Technology/Equipment: $</li>
        <li>Training: $</li>
        <li>Contingency (10%): $</li>
      </ul>
      
      <h2>7. Key Risks</h2>
      <table>
        <tr><th>Risk</th><th>Probability</th><th>Impact</th><th>Mitigation Strategy</th></tr>
        <tr><td>Risk 1</td><td>Medium</td><td>High</td><td>Mitigation approach</td></tr>
        <tr><td>Risk 2</td><td>Low</td><td>Medium</td><td>Mitigation approach</td></tr>
      </table>
      
      <h2>8. Assumptions</h2>
      <ul>
        <li>Assumption 1 about resources</li>
        <li>Assumption 2 about timeline</li>
        <li>Assumption 3 about external factors</li>
      </ul>
      
      <h2>9. Constraints</h2>
      <ul>
        <li>Time constraints</li>
        <li>Budget constraints</li>
        <li>Resource constraints</li>
        <li>Technical constraints</li>
      </ul>
      
      <h2>10. Authority and Approval</h2>
      <p><strong>Project Manager Authority:</strong></p>
      <ul>
        <li>Budget authority up to: $</li>
        <li>Resource allocation decisions</li>
        <li>Scope change approval limits</li>
      </ul>
      
      <h3>Approvals</h3>
      <p><strong>Project Sponsor:</strong> _________________ Date: _______</p>
      <p><strong>Project Manager:</strong> _________________ Date: _______</p>
    `
  },

  // Creative Templates
  {
    id: 'creative-brief',
    name: 'Creative Brief',
    icon: PenTool,
    category: 'Creative',
    content: `
      <h1>Creative Brief</h1>
      <p><strong>Project Name:</strong> </p>
      <p><strong>Client/Brand:</strong> </p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Creative Director:</strong> </p>
      
      <h2>1. Project Overview</h2>
      <p><strong>What are we creating?</strong></p>
      <p>Brief description of the creative project...</p>
      
      <p><strong>Why are we creating it?</strong></p>
      <p>Purpose and business objective...</p>
      
      <h2>2. Target Audience</h2>
      <h3>Primary Audience</h3>
      <ul>
        <li><strong>Demographics:</strong> Age, gender, income, location</li>
        <li><strong>Psychographics:</strong> Interests, values, lifestyle</li>
        <li><strong>Behavior:</strong> How they interact with the brand</li>
      </ul>
      
      <h3>Secondary Audience</h3>
      <p>Additional audience segments to consider...</p>
      
      <h2>3. Key Message</h2>
      <p><strong>Primary Message:</strong></p>
      <p>The single most important thing we want to communicate...</p>
      
      <p><strong>Supporting Messages:</strong></p>
      <ul>
        <li>Supporting point 1</li>
        <li>Supporting point 2</li>
        <li>Supporting point 3</li>
      </ul>
      
      <h2>4. Tone of Voice</h2>
      <p>How should the brand sound?</p>
      <ul>
        <li><strong>Personality traits:</strong> Professional, friendly, innovative, etc.</li>
        <li><strong>Communication style:</strong> Formal, casual, technical, etc.</li>
        <li><strong>Emotional tone:</strong> Inspiring, reassuring, exciting, etc.</li>
      </ul>
      
      <h2>5. Visual Direction</h2>
      <h3>Brand Guidelines</h3>
      <ul>
        <li><strong>Colors:</strong> Primary and secondary color palette</li>
        <li><strong>Typography:</strong> Font families and hierarchy</li>
        <li><strong>Imagery style:</strong> Photography, illustration, graphics</li>
        <li><strong>Logo usage:</strong> Placement and sizing guidelines</li>
      </ul>
      
      <h3>Creative Direction</h3>
      <p>Overall visual approach and aesthetic...</p>
      
      <h2>6. Deliverables</h2>
      <table>
        <tr><th>Deliverable</th><th>Specifications</th><th>Due Date</th></tr>
        <tr><td>Concept 1</td><td>Format, size, requirements</td><td></td></tr>
        <tr><td>Concept 2</td><td>Format, size, requirements</td><td></td></tr>
        <tr><td>Final artwork</td><td>Format, size, requirements</td><td></td></tr>
      </table>
      
      <h2>7. Success Metrics</h2>
      <p>How will we measure the success of this creative work?</p>
      <ul>
        <li>Metric 1 with target</li>
        <li>Metric 2 with target</li>
        <li>Metric 3 with target</li>
      </ul>
      
      <h2>8. Timeline</h2>
      <table>
        <tr><th>Milestone</th><th>Date</th><th>Deliverable</th></tr>
        <tr><td>Concept development</td><td></td><td>Initial concepts</td></tr>
        <tr><td>Client review</td><td></td><td>Feedback and revisions</td></tr>
        <tr><td>Final approval</td><td></td><td>Approved final artwork</td></tr>
        <tr><td>Production</td><td></td><td>Print-ready/final files</td></tr>
      </table>
      
      <h2>9. Budget</h2>
      <p><strong>Total Budget:</strong> $</p>
      <ul>
        <li>Creative development: $</li>
        <li>Production: $</li>
        <li>Revisions (up to X rounds): $</li>
      </ul>
      
      <h2>10. Mandatory Elements</h2>
      <ul>
        <li>Logo placement requirements</li>
        <li>Legal disclaimers</li>
        <li>Contact information</li>
        <li>Other required elements</li>
      </ul>
      
      <h2>11. Do's and Don'ts</h2>
      <h3>Do's</h3>
      <ul>
        <li>Follow brand guidelines</li>
        <li>Keep message clear and simple</li>
        <li>Consider accessibility requirements</li>
      </ul>
      
      <h3>Don'ts</h3>
      <ul>
        <li>Use competitors' colors or styles</li>
        <li>Include too much information</li>
        <li>Ignore the target audience</li>
      </ul>
    `
  },

  // General Templates
  {
    id: 'blank-document',
    name: 'Blank Document',
    icon: FileImage,
    category: 'General',
    content: `
      <h1>Untitled Document</h1>
      <p>Start writing here...</p>
    `
  },
  {
    id: 'simple-outline',
    name: 'Simple Outline',
    icon: FileText,
    category: 'General',
    content: `
      <h1>Document Title</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>I. Introduction</h2>
      <ul>
        <li>Main point A</li>
        <li>Main point B</li>
        <li>Main point C</li>
      </ul>
      
      <h2>II. Body</h2>
      <h3>A. First Section</h3>
      <ul>
        <li>Supporting detail 1</li>
        <li>Supporting detail 2</li>
      </ul>
      
      <h3>B. Second Section</h3>
      <ul>
        <li>Supporting detail 1</li>
        <li>Supporting detail 2</li>
      </ul>
      
      <h3>C. Third Section</h3>
      <ul>
        <li>Supporting detail 1</li>
        <li>Supporting detail 2</li>
      </ul>
      
      <h2>III. Conclusion</h2>
      <ul>
        <li>Summary point 1</li>
        <li>Summary point 2</li>
        <li>Final thought</li>
      </ul>
    `
  }
];

const categories = ['Business', 'Academic', 'Personal', 'Communication', 'Planning', 'Creative', 'General'];

export const DocumentTemplates: React.FC<DocumentTemplatesProps> = ({ editor }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const applyTemplate = (template: Template) => {
    if (editor) {
      editor.commands.setContent(template.content);
      toast({
        title: "Template Applied",
        description: `${template.name} template has been loaded`,
      });
      setIsOpen(false);
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          aria-label="Document Templates"
        >
          <FileText className="h-4 w-4 mr-1" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 max-h-96 overflow-y-auto">
        {categories.map((category, categoryIndex) => {
          const categoryTemplates = groupedTemplates[category] || [];
          if (categoryTemplates.length === 0) return null;
          
          return (
            <div key={category}>
              {categoryIndex > 0 && <DropdownMenuSeparator />}
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                {category}
              </div>
              {categoryTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="cursor-pointer"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {template.name}
                  </DropdownMenuItem>
                );
              })}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
