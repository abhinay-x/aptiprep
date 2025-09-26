import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PracticeSession() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(765) // 12:45 in seconds
  const [markedQuestions, setMarkedQuestions] = useState(new Set())
  const [answers, setAnswers] = useState({})
  const [showPalette, setShowPalette] = useState(false)

  const sessionData = {
    topic: 'Percentage Practice',
    totalQuestions: 15,
    timeLimit: 900 // 15 minutes
  }

  const questions = [
    {
      id: 1,
      text: "If the price of a shirt increases by 20% and then decreases by 15%, what is the net percentage change?",
      options: [
        "2% increase",
        "2% decrease", 
        "5% increase",
        "5% decrease"
      ],
      correctAnswer: 0,
      explanation: "Initial price = 100. After 20% increase = 120. After 15% decrease = 120 × 0.85 = 102. Net change = 2% increase."
    },
    {
      id: 2,
      text: "A student scored 85% in Math and 78% in Science. If Math has 40% weightage and Science has 60% weightage, what is the overall percentage?",
      options: [
        "80.8%",
        "81.5%",
        "82.2%",
        "83.1%"
      ],
      correctAnswer: 0,
      explanation: "Overall = (85 × 0.4) + (78 × 0.6) = 34 + 46.8 = 80.8%"
    }
  ]

  const currentQ = questions[currentQuestion] || questions[0]

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
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex)
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }))
  }

  const handleMarkForReview = () => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion)
      } else {
        newSet.add(currentQuestion)
      }
      return newSet
    })
  }

  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current'
    if (answers[index] !== undefined) return 'answered'
    if (markedQuestions.has(index)) return 'marked'
    return 'unattempted'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current': return '🔄'
      case 'answered': return '✅'
      case 'marked': return '🔖'
      default: return '⚪'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-accent-500 text-white'
      case 'answered': return 'bg-success-500 text-white'
      case 'marked': return 'bg-error-500 text-white'
      default: return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary">
      {/* Header */}
      <div className="bg-white dark:bg-dark-primary border-b border-primary-200 dark:border-dark-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/practice" className="text-primary-600 dark:text-dark-text-secondary hover:text-primary-900 dark:hover:text-dark-text-primary">
                ← Back to Practice
              </Link>
              <div className="h-6 w-px bg-primary-200 dark:bg-dark-border" />
              <h1 className="font-semibold text-primary-900 dark:text-dark-text-primary">
                📊 {sessionData.topic} • Question {currentQuestion + 1} of {sessionData.totalQuestions}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary-600 dark:text-dark-text-secondary">⏱️</span>
                <span className={`font-mono font-semibold ${timeRemaining < 300 ? 'text-error-500' : 'text-primary-900 dark:text-dark-text-primary'}`}>
                  {formatTime(timeRemaining)} remaining
                </span>
              </div>
              <button 
                onClick={() => setShowPalette(!showPalette)}
                className="btn-outline btn-sm"
              >
                Question Palette
              </button>
              <button className="btn-primary btn-sm">
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border p-8">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-primary-600 dark:text-dark-text-secondary mb-2">
                  <span>Progress</span>
                  <span>{currentQuestion + 1}/{sessionData.totalQuestions} Complete</span>
                </div>
                <div className="h-2 bg-primary-200 dark:bg-dark-border rounded-full">
                  <div 
                    className="h-2 bg-accent-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / sessionData.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-6">
                  Question {currentQuestion + 1}
                </h2>
                <p className="text-lg text-primary-800 dark:text-dark-text-primary leading-relaxed mb-8">
                  {currentQ.text}
                </p>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label 
                      key={index}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAnswer === index
                          ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                          : 'border-primary-200 dark:border-dark-border hover:border-accent-300 hover:bg-primary-50 dark:hover:bg-dark-secondary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => handleAnswerSelect(index)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-accent-500 bg-accent-500'
                          : 'border-primary-300 dark:border-dark-border'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-primary-900 dark:text-dark-text-primary">
                        {String.fromCharCode(65 + index)}) {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleMarkForReview}
                    className={`btn-outline btn-sm ${markedQuestions.has(currentQuestion) ? 'bg-error-100 border-error-300 text-error-700' : ''}`}
                  >
                    🔖 {markedQuestions.has(currentQuestion) ? 'Unmark' : 'Mark for Review'}
                  </button>
                  <button className="btn-outline btn-sm">
                    💡 Hint
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="btn-outline btn-sm disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button className="btn-primary btn-sm">
                    Submit Answer
                  </button>
                  <button 
                    onClick={() => setCurrentQuestion(Math.min(sessionData.totalQuestions - 1, currentQuestion + 1))}
                    disabled={currentQuestion === sessionData.totalQuestions - 1}
                    className="btn-primary btn-sm disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className={`lg:block ${showPalette ? 'block' : 'hidden'}`}>
            <div className="bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border p-6 sticky top-24">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                Question Palette
              </h3>
              
              {/* Legend */}
              <div className="mb-4 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔖</span>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚪</span>
                  <span className="text-primary-600 dark:text-dark-text-secondary">Unattempted</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: sessionData.totalQuestions }, (_, index) => {
                  const status = getQuestionStatus(index)
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${getStatusColor(status)} hover:scale-105`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-4 border-t border-primary-200 dark:border-dark-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-primary-600 dark:text-dark-text-secondary">Answered</div>
                    <div className="font-semibold">{Object.keys(answers).length}</div>
                  </div>
                  <div>
                    <div className="text-primary-600 dark:text-dark-text-secondary">Marked</div>
                    <div className="font-semibold">{markedQuestions.size}</div>
                  </div>
                  <div>
                    <div className="text-primary-600 dark:text-dark-text-secondary">Remaining</div>
                    <div className="font-semibold">{sessionData.totalQuestions - Object.keys(answers).length}</div>
                  </div>
                  <div>
                    <div className="text-primary-600 dark:text-dark-text-secondary">Time Left</div>
                    <div className="font-semibold font-mono">{formatTime(timeRemaining)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
