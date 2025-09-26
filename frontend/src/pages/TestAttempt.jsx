import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function TestAttempt() {
  const { id } = useParams()
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(10800) // 3 hours in seconds
  const [answers, setAnswers] = useState({})
  const [markedQuestions, setMarkedQuestions] = useState(new Set())
  const [isFullScreen, setIsFullScreen] = useState(false)

  const testData = {
    title: 'CAT Mock Test #1',
    sections: [
      { name: 'QA', fullName: 'Quantitative Ability', questions: 22, timeLimit: 40 },
      { name: 'DILR', fullName: 'Data Interpretation & Logical Reasoning', questions: 22, timeLimit: 40 },
      { name: 'VARC', fullName: 'Verbal Ability & Reading Comprehension', questions: 22, timeLimit: 40 }
    ]
  }

  const sampleQuestion = {
    id: 1,
    text: "A train travels from Station A to Station B at a speed of 60 km/h and returns at a speed of 40 km/h. If the total journey time is 5 hours, what is the distance between the two stations?",
    options: [
      "120 km",
      "150 km", 
      "180 km",
      "200 km"
    ],
    type: "MCQ"
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSection}-${currentQuestion}`]: optionIndex
    }))
  }

  const toggleMark = () => {
    const questionKey = `${currentSection}-${currentQuestion}`
    setMarkedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionKey)) {
        newSet.delete(questionKey)
      } else {
        newSet.add(questionKey)
      }
      return newSet
    })
  }

  const getQuestionStatus = (sectionIndex, questionIndex) => {
    const key = `${sectionIndex}-${questionIndex}`
    if (sectionIndex === currentSection && questionIndex === currentQuestion) return 'current'
    if (answers[key] !== undefined) return 'answered'
    if (markedQuestions.has(key)) return 'marked'
    return 'unattempted'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-accent-500 text-white'
      case 'answered': return 'bg-success-500 text-white'
      case 'marked': return 'bg-error-500 text-white'
      default: return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
    }
  }

  const currentSectionData = testData.sections[currentSection]
  const totalQuestions = testData.sections.reduce((sum, section) => sum + section.questions, 0)

  return (
    <div className={`min-h-screen bg-white dark:bg-dark-primary ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-primary-50 dark:bg-dark-secondary border-b border-primary-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold text-primary-900 dark:text-dark-text-primary">
                {testData.title}
              </h1>
              <div className="text-sm text-primary-600 dark:text-dark-text-secondary">
                Section: {currentSectionData.name} • Question {currentQuestion + 1} of {currentSectionData.questions}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`font-mono font-semibold ${timeRemaining < 1800 ? 'text-error-500' : 'text-primary-900 dark:text-dark-text-primary'}`}>
                ⏱️ {formatTime(timeRemaining)} remaining
              </div>
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="btn-outline btn-sm"
              >
                {isFullScreen ? '🗗' : '📺'} {isFullScreen ? 'Exit' : 'Full Screen'}
              </button>
              <button className="btn-primary btn-sm">
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-0 h-full">
        {/* Question Area */}
        <div className="lg:col-span-3 p-8">
          <div className="max-w-4xl">
            {/* Section Tabs */}
            <div className="flex space-x-1 mb-6">
              {testData.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSection(index)
                    setCurrentQuestion(0)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentSection === index
                      ? 'bg-accent-500 text-white'
                      : 'bg-primary-100 dark:bg-dark-secondary text-primary-700 dark:text-dark-text-secondary hover:bg-primary-200 dark:hover:bg-dark-card'
                  }`}
                >
                  Section {index + 1}: {section.name}
                </button>
              ))}
            </div>

            {/* Question */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-lg border border-primary-200 dark:border-dark-border">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                  Question {currentQuestion + 1}
                </h2>
                <p className="text-lg text-primary-800 dark:text-dark-text-primary leading-relaxed">
                  {sampleQuestion.text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {sampleQuestion.options.map((option, index) => (
                  <label 
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[`${currentSection}-${currentQuestion}`] === index
                        ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                        : 'border-primary-200 dark:border-dark-border hover:border-accent-300 hover:bg-primary-50 dark:hover:bg-dark-secondary'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={answers[`${currentSection}-${currentQuestion}`] === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[`${currentSection}-${currentQuestion}`] === index
                        ? 'border-accent-500 bg-accent-500'
                        : 'border-primary-300 dark:border-dark-border'
                    }`}>
                      {answers[`${currentSection}-${currentQuestion}`] === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-primary-900 dark:text-dark-text-primary">
                      {String.fromCharCode(65 + index)}) {option}
                    </span>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleMark}
                    className={`btn-outline btn-sm ${markedQuestions.has(`${currentSection}-${currentQuestion}`) ? 'bg-error-100 border-error-300 text-error-700' : ''}`}
                  >
                    🔖 {markedQuestions.has(`${currentSection}-${currentQuestion}`) ? 'Unmark' : 'Mark'}
                  </button>
                  <button 
                    onClick={() => setAnswers(prev => ({ ...prev, [`${currentSection}-${currentQuestion}`]: undefined }))}
                    className="btn-outline btn-sm"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn-primary btn-sm">
                    Save & Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Panel */}
        <div className="bg-primary-50 dark:bg-dark-secondary border-l border-primary-200 dark:border-dark-border p-4">
          <div className="sticky top-4">
            <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
              Question Navigation
            </h3>

            {/* Section Navigation */}
            <div className="space-y-4">
              {testData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div className={`text-sm font-medium mb-2 ${sectionIndex === currentSection ? 'text-accent-600 dark:text-accent-400' : 'text-primary-600 dark:text-dark-text-secondary'}`}>
                    {section.name}
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: section.questions }, (_, questionIndex) => {
                      const status = getQuestionStatus(sectionIndex, questionIndex)
                      return (
                        <button
                          key={questionIndex}
                          onClick={() => {
                            setCurrentSection(sectionIndex)
                            setCurrentQuestion(questionIndex)
                          }}
                          className={`w-8 h-8 rounded text-xs font-medium transition-all ${getStatusColor(status)} hover:scale-105`}
                        >
                          {questionIndex + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-primary-200 dark:border-dark-border">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success-500 rounded"></div>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-error-500 rounded"></div>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent-500 rounded"></div>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Unattempted</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <button className="btn-outline w-full text-sm">
                Review Marked
              </button>
              <button className="btn-outline w-full text-sm">
                Submit Section
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
