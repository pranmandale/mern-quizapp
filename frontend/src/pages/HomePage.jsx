"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Brain,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Lightbulb,
  Star,
  ChevronDown,
  FilePlus,
  Share2,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react"

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [activeFaq, setActiveFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  // Refs for scroll animations
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const testimonialsRef = useRef(null)
  const faqRef = useRef(null)

  // Add this CSS to the head of the document
  useEffect(() => {
    // Add CSS for animations
    const style = document.createElement("style")
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .animate-on-scroll {
        will-change: opacity, transform;
      }
      
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)

    // Auto-rotate featured questions
    const interval = setInterval(() => {
      setActiveQuestion((prev) => (prev + 1) % featuredQuestions.length)
    }, 5000)

    // Add scroll event listener for navbar background
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Add intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe elements with animation classes
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })

    window.addEventListener("scroll", handleScroll)

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const targetId = this.getAttribute("href")
        if (targetId === "#") return

        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
    })

    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const featuredQuestions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctIndex: 2,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctIndex: 1,
    },
    {
      question: "What is the largest mammal on Earth?",
      options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
      correctIndex: 2,
    },
  ]

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "Smart Quiz Creation",
      description: "Create engaging quizzes with our intuitive interface. Add images, explanations, and more.",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Timed Challenges",
      description: "Set time limits to challenge participants and make quizzes more exciting.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      title: "Detailed Analytics",
      description: "Get comprehensive insights into quiz performance and participant results.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      title: "AI-Powered Quizzes",
      description: "Generate quizzes automatically with our advanced AI technology.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Teacher",
      content:
        "QuizMaster has transformed how I engage with my students. The platform is intuitive and the analytics help me understand where my students need more support.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Michael Chen",
      role: "Corporate Trainer",
      content:
        "I use QuizMaster for all my training assessments. The ability to create timed quizzes with detailed explanations has made our training programs much more effective.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Priya Patel",
      role: "Quiz Enthusiast",
      content:
        "As someone who loves both creating and taking quizzes, this platform offers everything I need. The UI is beautiful and the experience is seamless.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  const faqs = [
    {
      question: "How do I create my first quiz?",
      answer:
        "After signing up, navigate to the Dashboard and click on 'Create Quiz'. Fill in your quiz details, add questions and answers, then publish when you're ready to share.",
    },
    {
      question: "Can I include images in my quizzes?",
      answer:
        "Yes! You can upload images for both questions and answer explanations to make your quizzes more engaging and informative.",
    },
    {
      question: "How do participants join my quiz?",
      answer:
        "Each quiz has a unique link and ID. Share the link directly with participants or they can enter the quiz ID on the 'Join Quiz' page.",
    },
    {
      question: "Are there limits to how many quizzes I can create?",
      answer:
        "The free plan allows you to create up to 5 quizzes. Premium plans offer unlimited quiz creation and additional features.",
    },
    {
      question: "Can I see detailed results of quiz attempts?",
      answer:
        "Yes, you can view comprehensive analytics for each quiz, including individual participant performance, time taken, and question-by-question breakdown.",
    },
  ]

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null)
    } else {
      setActiveFaq(index)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 text-black " : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className={`text-xl font-bold ${scrolled ? "text-blue-600 dark:text-blue-400" : "text-white"}`}>
                  QuizMaster
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-black hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-black hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-black hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-black hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                FAQ
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    scrolled
                      ? "text-black hover:bg-blue-700"
                      : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30"
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                      scrolled
                        ? "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      scrolled
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30"
                    }`}
                  >
                    <span className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${scrolled ? "text-gray-700 dark:text-gray-300" : "text-white"}`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                FAQ
              </a>

              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white pt-16">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-700/90"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="text-center lg:text-left animate-on-scroll opacity-0 transition-all duration-1000 translate-y-8"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                The Ultimate Quiz Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Create, Share & <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
                  Master Knowledge
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                Craft engaging quizzes, challenge friends, and expand your knowledge with our intuitive quiz platform.
                Perfect for educators, trainers, and quiz enthusiasts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 font-medium hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 font-medium hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-colors border border-white/30 transform hover:-translate-y-1 duration-300"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center lg:justify-start mt-8 text-white/70">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 border-2 border-white"
                    ></div>
                  ))}
                </div>
                <div className="ml-3 text-sm">
                  <span className="font-semibold text-white">1,000+</span> users joined this month
                </div>
              </div>
            </div>

            <div
              className="relative animate-on-scroll opacity-0 transition-all duration-1000 translate-y-8"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-400 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <div className="ml-auto text-sm font-medium">Sample Quiz</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="text-lg font-semibold mb-4">
                      Question {activeQuestion + 1} of {featuredQuestions.length}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{featuredQuestions[activeQuestion].question}</h3>

                    <div className="space-y-3">
                      {featuredQuestions[activeQuestion].options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-all ${
                            index === featuredQuestions[activeQuestion].correctIndex
                              ? "border-green-400/30 bg-green-400/10"
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`flex items-center justify-center h-6 w-6 rounded-full border mr-3 ${
                                index === featuredQuestions[activeQuestion].correctIndex
                                  ? "border-green-400 bg-green-400 text-white"
                                  : "border-white/50"
                              }`}
                            >
                              {index === featuredQuestions[activeQuestion].correctIndex ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                String.fromCharCode(65 + index)
                              )}
                            </div>
                            <span>{option}</span>
                            {index === featuredQuestions[activeQuestion].correctIndex && (
                              <CheckCircle className="h-5 w-5 text-green-400 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>00:15</span>
                    </div>
                    <div className="flex space-x-1">
                      {featuredQuestions.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full ${index === activeQuestion ? "bg-white" : "bg-white/30"}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#f8fafc"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10k+", label: "Active Users", color: "text-blue-600 dark:text-blue-400", delay: "0.1s" },
              { value: "50k+", label: "Quizzes Created", color: "text-purple-600 dark:text-purple-400", delay: "0.2s" },
              { value: "1M+", label: "Questions Answered", color: "text-green-600 dark:text-green-400", delay: "0.3s" },
              { value: "100+", label: "Countries", color: "text-amber-600 dark:text-amber-400", delay: "0.4s" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-on-scroll opacity-0 transition-all duration-700 translate-y-4"
                style={{ animationDelay: stat.delay }}
              >
                <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Quiz Creators
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to create engaging quizzes, assess knowledge, and analyze results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-on-scroll opacity-0 translate-y-4 hover:-translate-y-2"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How QuizMaster Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Create, share, and analyze quizzes in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: <FilePlus className="h-16 w-16 text-blue-500" />,
                title: "Create Your Quiz",
                description:
                  "Design your quiz with our easy-to-use editor. Add questions, options, explanations, and media.",
                color: "bg-blue-600",
                delay: "0.1s",
              },
              {
                step: 2,
                icon: <Share2 className="h-16 w-16 text-purple-500" />,
                title: "Share with Participants",
                description:
                  "Distribute your quiz with a unique link or code. Perfect for classrooms, training, or social sharing.",
                color: "bg-purple-600",
                delay: "0.3s",
              },
              {
                step: 3,
                icon: <BarChart3 className="h-16 w-16 text-green-500" />,
                title: "Analyze Results",
                description:
                  "Get detailed insights into participant performance with comprehensive analytics and reports.",
                color: "bg-green-600",
                delay: "0.5s",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative animate-on-scroll opacity-0 transition-all duration-700 translate-y-8"
                style={{ animationDelay: step.delay }}
              >
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-xl z-10`}
                >
                  {step.step}
                </div>
                {/* Line connecting steps (hidden on mobile) */}
                <div className="absolute top-6 left-1/2 w-1/2 h-0.5 bg-blue-200 dark:bg-blue-700 hidden md:block"></div>
                <div className="absolute top-6 right-1/2 w-1/2 h-0.5 bg-blue-200 dark:bg-blue-700 hidden md:block"></div>

                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 pt-10 shadow-md text-center mt-6 transform transition-transform duration-300 hover:scale-105">
                  <div className="h-16 w-16 mx-auto mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied users who are transforming how they create and share quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-gray-700 rounded-xl p-6 shadow-sm animate-on-scroll opacity-0 transition-all duration-700 translate-y-8 hover:shadow-lg"
                style={{ animationDelay: `${0.1 + index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" ref={faqRef} className="py-20 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find answers to common questions about QuizMaster.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-on-scroll opacity-0 transition-all duration-500 translate-y-4"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      activeFaq === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {activeFaq === index && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 animate-in slide-in-from-top duration-300">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll opacity-0 transition-all duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your First Quiz?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of educators, trainers, and quiz enthusiasts who are creating engaging quizzes with
            QuizMaster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Link
                to="/create-quiz"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create a Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all duration-300 border border-white/30 transform hover:-translate-y-1"
                >
                  Learn More
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">QuizMaster</h3>
              <p className="text-gray-400 mb-4">The ultimate platform for creating, sharing, and analyzing quizzes.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-white transition-colors duration-300">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 mr-4">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

