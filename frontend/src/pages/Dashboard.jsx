export default function Dashboard() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Continue Learning</h2>
                  <p className="text-gray-600 dark:text-gray-300">Quantitative Aptitude • Lesson 12 of 25</p>
                </div>
                <button className="btn-primary">Continue</button>
              </div>
              <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-accent-500 rounded-full w-1/2" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {label:'Streak', value:'5 Days', icon:'🔥'},
                {label:'Lessons', value:'12', icon:'📚'},
                {label:'Quizzes', value:'8', icon:'🎯'},
                {label:'Study Time', value:'4h 32m', icon:'⏱️'},
              ].map((m)=> (
                <div key={m.label} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
                  <div className="text-2xl">{m.icon}</div>
                  <div className="text-xl font-semibold">{m.value}</div>
                  <div className="text-gray-600 dark:text-gray-300">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {["Quantitative Apt","Logical Reasoning","Data Interpretation"].map((c)=> (
                <div key={c} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="font-semibold mb-2">{c}</div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-accent-500 rounded-full w-2/3" />
                  </div>
                  <button className="btn-primary btn-sm mt-3">Continue</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-2">Recommendation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">Time to tackle Profit & Loss! You are ready for the next level based on your Percentage mastery.</p>
              <button className="btn-outline">Start Topic</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
