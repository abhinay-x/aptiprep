const founder = {
  name: 'K.Seshagiri Rao',
  role: 'Founder, Trainer & Mentor',
  avatar: '/team/seshagiri-rao.jpg',
  bio:
    'Founder, Trainer & Mentor with 15,000+ hours of experience in shaping careers. Master in Quantitative Aptitude & Logical Reasoning, dedicated to helping students crack placements, competitive exams, and land their dream jobs.',
  links: {
    linkedin: '#',
    github: '#',
    email: 'mailto:you@example.com',
  },
}

const team = [
  {
    name: 'R.Abhinay Chary',
    role: 'Full Stack developer',
    avatar: null,
    bio:
      " Hi, I'm Raghipani Abhinay Chary - a Final year B.Tech student passionate about building scalable, production-grade solutions. With hands-on expertise in full-stack development (MERN), DevOps, and cloud-native systems, I've developed applications serving 500+ active users, optimized performance using advanced DSA implementations, and deployed solutions with CI/CD pipelines and Docker. Certified in Java, Python, DevOps, and Azure, I enjoy solving complex problems, and driving innovation through technology.",
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-teal-50 to-teal-100 dark:from-gray-900 dark:via-slate-800 dark:to-teal-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section with Modern Design */}
      <section className="relative bg-gradient-to-r from-teal-600/10 via-emerald-600/10 to-cyan-600/10 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
              <img src="/logo-1.png" alt="Aptiprep Logo" className="w-12 h-12 rounded-lg object-cover" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent tracking-tight mb-4">
              About Aptiprep
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transforming careers through expert guidance and innovative learning solutions
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">15,000+ Training Hours</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">120+ Colleges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section with Enhanced Design */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Story</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full"></div>
            </div>
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg">
                This platform was founded by <span className="font-bold text-gray-900 dark:text-white bg-gradient-to-r from-teal-500/10 to-emerald-500/10 px-2 py-1 rounded">K.Seshagiri Rao</span>, an experienced trainer, content creator, and mentor with a passion for transforming students' careers.
              </p>
              <p>
                With training experience across 120+ colleges and more than 15,000 hours of impactful sessions, he has guided thousands of students towards achieving their goals.
              </p>
              <p>
                A master in Quantitative Aptitude and Logical Reasoning, he specializes in company-specific training modules, placement-focused programs, and customized content tailored to industry-relevant requirements.
              </p>
              <p>
                What sets him apart is his student-centric approach, which blends conceptual clarity with real-time application, ensuring that learners don't just study but truly understand and perform.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-600/20 rounded-3xl transform rotate-6"></div>
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  15K+
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hours of Excellence</h3>
                <p className="text-gray-600 dark:text-gray-400">Dedicated to student success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight - Enhanced */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500"></div>
          <div className="p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {founder.avatar ? (
                <div className="relative mx-auto sm:mx-0">
                  <img
                    src={founder.avatar}
                    alt={founder.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg">
                  {initials(founder.name)}
                </div>
              )}
              <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{founder.name}</h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium rounded-full">
                    Founder
                  </span>
                </div>
                <p className="text-teal-600 dark:text-teal-400 font-medium mb-4">{founder.role}</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{founder.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Card Redesign */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate professionals dedicated to your success
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                      {initials(member.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">{member.role}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">
                  {member.bio}
                </p>

                <div className="flex items-center gap-3">
                  {member.links.linkedin && (
                    <a
                      href={member.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-[#0A66C2] transform hover:scale-110"
                      title="LinkedIn"
                    >
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
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 transform hover:scale-110"
                    >
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
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-red-600 transform hover:scale-110"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5zm2.5-.5a.5.5 0 0 0-.5.5v.217l8 4.8 8-4.8V6.5a.5.5 0 0 0-.5-.5zM20 9.483l-7.65 4.593a1 1 0 0 1-1.03 0L3.999 9.483V17.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="relative bg-gradient-to-r from-teal-600/90 to-emerald-600/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Want to contribute?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-6">
              Have ideas, found a bug, or want to collaborate? Reach out to us on LinkedIn or send us an email. We love hearing from the community.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors transform hover:scale-105 shadow-lg">
                Get in Touch
              </button>
              <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
