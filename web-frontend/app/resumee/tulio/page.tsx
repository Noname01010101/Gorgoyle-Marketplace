"use client";

// Simple SVG icon components
const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);
interface Project {
  name: string;
  repository: string;
  liveUrl?: string;
  techStack: string[];
  isPrivate?: boolean;
}

interface Skill {
  category: string;
  items: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function ResumePage() {
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = "j.8faq14v@gmail.com";

    // Try to open email client
    window.location.href = `mailto:${email}`;

    // Also copy to clipboard as backup
    navigator.clipboard
      .writeText(email)
      .then(() => {
        alert("Email copied to clipboard!");
      })
      .catch(() => {
        // Fallback if clipboard API fails
        alert(`Email: ${email}`);
      });
  };

  const projects: Project[] = [
    {
      name: "Gorgoyle",
      repository: "https://github.com/Noname01010101/Gorgoyle-Marketplace",
      liveUrl: "https://gorgoyle-1.vercel.app",
      techStack: [
        "React",
        "Express",
        "Node.js",
        "tRPC",
        "PostgreSQL",
        "Prisma",
        "TypeScript",
        "Vitest",
      ],
    },
    {
      name: "LightDB",
      repository: "https://github.com/Noname01010101/LightDB",
      techStack: ["SQL"],
    },
    {
      name: "Fusion Screener",
      repository: "(Private)",
      liveUrl: "https://screener-project.vercel.app",
      techStack: [
        "React",
        "Express",
        "Node.js",
        "tRPC",
        "PostgreSQL",
        "Prisma",
        "TypeScript",
        "Vitest",
        "Docker",
        "CI/CD",
      ],
      isPrivate: true,
    },
  ];

  const skills: Skill[] = [
    {
      category: "Web Frontend",
      items: ["React", "HTML/CSS/JS", "Next.js", "tRPC Client", "Tailwind"],
    },
    {
      category: "Web Backend",
      items: [
        "Node.js",
        "Vitest",
        "Docker",
        "Prisma",
        "Express",
        "Apollo Server",
      ],
    },
    {
      category: "General Abilities",
      items: [
        "TypeScript",
        "Github Actions",
        "Vercel Deployment",
        "Render.com",
        "Neon DB",
        "Git & Github Collaboration",
      ],
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What's your expected salary range?",
      answer:
        "I'm currently willing to work for coding experience, so any salary is acceptable (internship).",
    },
    {
      question: "Are you legally allowed to work in our country?",
      answer:
        "I need sponsorship. I do only have a visa for working within Brazilian territory.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Section */}
        <header className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Túlio C. F. Gomes
              </h1>
              <p className="text-xl text-slate-600 mb-4">
                Full Stack Developer
              </p>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="text-blue-600">
                  <MailIcon />
                </div>
                <a
                  href="mailto:j.8faq14v@gmail.com"
                  onClick={handleEmailClick}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  j.8faq14v@gmail.com
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/Noname01010101"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <GithubIcon />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>
        </header>

        {/* Projects Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Projects & Experience
          </h2>
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project.name}
                className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {!project.isPrivate && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm"
                      >
                        <GithubIcon />
                        Repository
                      </a>
                    )}
                    {project.isPrivate && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-500 rounded-md text-sm">
                        <GithubIcon />
                        Private Repo
                      </span>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <ExternalLinkIcon />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Skill Set Highlights
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((skillCategory) => (
              <div
                key={skillCategory.category}
                className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b-2 border-indigo-200">
                  {skillCategory.category}
                </h3>
                <ul className="space-y-2">
                  {skillCategory.items.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 text-slate-700"
                    >
                      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-slate-700 ml-6 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">A:</span>
                  <span>{faq.answer}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
          <p className="text-slate-300 mb-4">
            Thank you for reviewing my resume. I&apos;m eager to contribute to
            innovative projects and grow as a developer.
          </p>
          <a
            href="mailto:j.8faq14v@gmail.com"
            onClick={handleEmailClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold cursor-pointer"
          >
            <MailIcon />
            Get in Touch
          </a>
        </footer>
      </div>
    </div>
  );
}
