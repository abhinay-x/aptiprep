import { Link } from 'react-router-dom'

const team = [
  {
    name: 'Prof.Seshagiri Rao',
    role: 'Founder and Aptitute Trainer',
    avatar: null, // place an image in public/team/yourname.jpg and set to '/team/yourname.jpg'
    bio:
      'Aptitude Trainer at Vignan Institute of Technology and science',
    links: {
      linkedin: '#',
      github: '#',
      email: 'mailto:you@example.com',
    },
  },
  {
    name: 'R.Abhinay Chary',
    role: 'Full Stack developer',
    avatar: null,
    bio:
      ' Hi, I’m Raghipani Abhinay Chary — a Software Engineer passionate about building scalable, production-grade solutions. With hands-on expertise in full-stack development (MERN), DevOps, and cloud-native systems, I’ve developed applications serving 500+ active users, optimized performance using advanced DSA implementations, and deployed solutions with CI/CD pipelines and Docker. Certified in Java, Python, DevOps, and Azure, I enjoy solving complex problems, mentoring peers, and driving innovation through technology.',
    links: {
      linkedin: 'https://linkedin.com/in/abhinay-chary',
      github: 'https://github.com/abhinay-x',
      email: 'mailto:r.abhinaychary@gmail.com',
    },
  },
]

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-dark-primary">
      {/* Hero / Intro */}
      <section className="bg-gradient-to-br from-accent-500/10 to-primary-500/10 dark:from-accent-500/10 dark:to-accent-500/5 border-b border-primary-100/60 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <img src="/logo-1.png" alt="Aptiprep Logo" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 dark:text-white tracking-tight">
                Meet the Developers
              </h1>
              <p className="mt-1 text-primary-600 dark:text-dark-text-secondary">
                We are a small team focused on building a delightful learning experience with modern web technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="group rounded-2xl border border-primary-100 dark:border-dark-border bg-white/70 dark:bg-dark-secondary/60 backdrop-blur-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 text-white flex items-center justify-center text-lg font-semibold ring-2 ring-accent-300/40">
                    {initials(member.name)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-primary-600 dark:text-dark-text-secondary">{member.role}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-primary-700 dark:text-dark-text-secondary">
                {member.bio}
              </p>

              <div className="mt-5 flex items-center gap-3">
                {member.links.linkedin && (
                  <a
                    href={member.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors text-[#0A66C2]"
                    title="LinkedIn"
                  >
                    {/* LinkedIn icon inline so it inherits currentColor */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452H17.21v-5.569c0-1.329-.027-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.942v5.666H9.085V9h3.105v1.561h.045c.433-.82 1.492-1.686 3.07-1.686 3.285 0 3.89 2.161 3.89 4.972v6.605zM5.337 7.433a1.802 1.802 0 1 1 0-3.604 1.802 1.802 0 0 1 0 3.604zM6.997 20.452H3.675V9h3.322v11.452zM21.75 0H2.25C1.008 0 0 1.008 0 2.25v19.5C0 22.992 1.008 24 2.25 24h19.5c1.242 0 2.25-1.008 2.25-2.25V2.25C24 1.008 22.992 0 21.75 0z"/>
                    </svg>
                  </a>
                )}
                {member.links.github && (
                  <a
                    href={member.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    {/* GitHub mark inline to avoid extra files */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 .5a11.5 11.5 0 0 0-3.636 22.41c.575.107.786-.25.786-.558 0-.275-.01-1.005-.016-1.974-3.198.695-3.873-1.542-3.873-1.542-.523-1.329-1.279-1.684-1.279-1.684-1.045-.715.08-.7.08-.7 1.156.081 1.765 1.187 1.765 1.187 1.028 1.762 2.695 1.253 3.35.958.104-.75.403-1.253.733-1.542-2.554-.29-5.24-1.278-5.24-5.686 0-1.256.45-2.284 1.187-3.09-.12-.29-.515-1.463.112-3.05 0 0 .965-.309 3.163 1.181a10.95 10.95 0 0 1 5.757 0c2.197-1.49 3.161-1.18 3.161-1.18.628 1.586.233 2.759.114 3.049.74.807 1.185 1.835 1.185 3.09 0 4.42-2.69 5.392-5.254 5.676.415.357.785 1.063.785 2.144 0 1.548-.014 2.795-.014 3.175 0 .31.208.67.792.557A11.5 11.5 0 0 0 12 .5Z"
                      />
                    </svg>
                  </a>
                )}
                {member.links.email && (
                  <a
                    href={member.links.email}
                    aria-label="Email"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5zm2.5-.5a.5.5 0 0 0-.5.5v.217l8 4.8 8-4.8V6.5a.5.5 0 0 0-.5-.5zM20 9.483l-7.65 4.593a1 1 0 0 1-1.03 0L3.999 9.483V17.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5z" />
                    </svg>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Contribute / Contact section */}
        <div className="mt-10 rounded-2xl border border-primary-100 dark:border-dark-border bg-primary-50/60 dark:bg-dark-secondary/60 p-6">
          <h2 className="text-lg font-semibold text-primary-900 dark:text-white">Want to contribute?</h2>
          <p className="mt-1 text-sm text-primary-700 dark:text-dark-text-secondary">
            Have ideas, found a bug, or want to collaborate? Reach out to us on LinkedIn or send us an email. We love
            hearing from the community.
          </p>
        </div>
      </section>
    </div>
  )
}
