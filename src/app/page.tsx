"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  Calendar,
  AlertCircle,
  Tag,
  Search,
  Filter,
  Sun,
  Moon,
  CheckCircle,
  TrendingUp,
  Clock,
  Sparkles,
  User,
  CheckSquare,
  ArrowUpDown,
  RotateCcw,
  X,
  Save,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { id: "Pribadi", label: "🏠 Pribadi", color: "pink" },
  { id: "Kerja", label: "💼 Kerja", color: "green" },
  { id: "Belanja", label: "🛍️ Belanja", color: "pink" },
  { id: "Kesehatan", label: "🥦 Kesehatan", color: "green" },
  { id: "Self-Care", label: "💖 Self-Care", color: "pink" },
];

const MOTIVATIONAL_QUOTES = [
  "Setiap langkah kecil membawamu lebih dekat ke impianmu, Tia! ✨",
  "Fokus pada proses, bukan hanya kesempurnaan. Kamu luar biasa! 🌸",
  "Satu demi satu, hari ini akan menjadi hari yang produktif! 🌿",
  "Jangan lupa untuk beristirahat dan menyayangi dirimu sendiri hari ini. 💕",
  "Semangat! Setiap tugas yang selesai adalah satu kemenangan kecil. 🏆",
  "Hal-hal hebat membutuhkan waktu. Tetap konsisten ya! 🌱",
];

export default function TodoApp() {
  // State for hydration check
  const [mounted, setMounted] = useState(false);

  // Core App States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState("Tia");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("Tia");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [quote, setQuote] = useState("");

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pribadi");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");

  // Edit Task States
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("Pribadi");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">("medium");
  const [editDueDate, setEditDueDate] = useState("");

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "created">("created");

  // Animations/Interaction states
  const [checkedAnimationId, setCheckedAnimationId] = useState<string | null>(null);

  // Initialize and Load Data
  useEffect(() => {
    setMounted(true);
    
    // Load tasks
    const savedTasks = localStorage.getItem("tia_tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    } else {
      // Default placeholder tasks for premium look on first load
      const defaultTasks: Task[] = [
        {
          id: "default-1",
          title: "Rencanakan agenda mingguan 📅",
          description: "Tulis prioritas utama untuk minggu ini agar terstruktur.",
          category: "Kerja",
          priority: "high",
          dueDate: new Date().toISOString().split("T")[0],
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      setTasks(defaultTasks);
      localStorage.setItem("tia_tasks", JSON.stringify(defaultTasks));
    }

    // Load User Name
    const savedName = localStorage.getItem("tia_username");
    if (savedName) {
      setUserName(savedName);
      setTempName(savedName);
    }

    // Load Theme Preference
    const savedTheme = localStorage.getItem("tia_theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }

    // Randomize quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("tia_tasks", JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("tia_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setDescription("");
    setCategory("Pribadi");
    setPriority("medium");
    setDueDate("");
  };

  // Delete Task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingTaskId === id) {
      setEditingTaskId(null);
    }
  };

  // Toggle Completed Task with animation
  const handleToggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      setCheckedAnimationId(id);
      setTimeout(() => setCheckedAnimationId(null), 300);
    }

    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          return { ...t, completed: !t.completed };
        }
        return t;
      })
    );
  };

  // Set Task to Edit Mode
  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate);
  };

  // Save Edited Task
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setTasks(
      tasks.map((t) => {
        if (t.id === editingTaskId) {
          return {
            ...t,
            title: editTitle.trim(),
            description: editDescription.trim(),
            category: editCategory,
            priority: editPriority,
            dueDate: editDueDate,
          };
        }
        return t;
      })
    );
    setEditingTaskId(null);
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  // Save User Name
  const saveUserName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem("tia_username", tempName.trim());
    }
    setIsEditingName(false);
  };

  // Reset all tasks to default placeholders (Clear Data helper)
  const resetToDefault = () => {
    if (window.confirm("Apakah kamu ingin mengembalikan tugas ke pengaturan awal?")) {
      localStorage.removeItem("tia_tasks");
      window.location.reload();
    }
  };

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter & Sort Logic
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? task.completed
          : !task.completed;

      const matchesCategory = categoryFilter === "all" ? true : task.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "priority") {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      // default: created date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Date Formatting for display
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("id-ID", options);
  };

  if (!mounted) {
    // Elegant loading shell to prevent hydration flashing
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-stone-600 dark:bg-stone-950 dark:text-stone-300">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-brand-pink-100 dark:border-brand-pink-900"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-pink-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium animate-pulse">Menyiapkan Lembar Tugas Tia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 md:py-6 flex flex-col gap-4 h-auto md:h-screen md:max-h-screen overflow-hidden">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 pb-3 border-b border-border-color flex-shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-pink-100 text-brand-pink-500 dark:bg-brand-pink-100 dark:text-brand-pink-500 shadow-sm animate-bounce">
              <CheckSquare className="w-7 h-7" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                To Do List
              </h1>
              {isEditingName ? (
                <div className="flex items-center gap-1 bg-card-bg border border-border-color rounded-xl px-2 py-1 shadow-inner">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveUserName()}
                    className="bg-transparent font-extrabold text-2xl md:text-3xl text-brand-pink-500 focus:outline-none w-28 text-center"
                    maxLength={15}
                    autoFocus
                  />
                  <button
                    onClick={saveUserName}
                    className="p-1 text-brand-green-500 hover:bg-brand-green-50 dark:hover:bg-brand-green-950/40 rounded-lg transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(false);
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="text-2xl md:text-3xl font-black text-brand-pink-500">
                    {userName}
                  </span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-all"
                    title="Ubah nama"
                  >
                    <Edit3 className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-text-secondary flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-brand-green-500" />
            {getFormattedDate()}
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            onClick={resetToDefault}
            className="p-2.5 rounded-xl border border-border-color hover:bg-stone-100 dark:hover:bg-stone-800 text-text-secondary transition-all hover:scale-105 active:scale-95"
            title="Reset Data ke Default"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-border-color bg-card-bg hover:bg-stone-100 dark:hover:bg-stone-800 text-brand-pink-500 dark:text-brand-green-500 transition-all hover:scale-105 active:scale-95 shadow-sm"
            title={theme === "light" ? "Mode Gelap" : "Mode Terang"}
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Quote Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-brand-pink-50 to-brand-green-50 dark:from-brand-pink-100/5 dark:to-brand-green-100/5 border border-brand-pink-100/50 dark:border-brand-pink-900/20 flex gap-2 items-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-brand-pink-500 shrink-0" />
        <p className="text-xs md:text-sm font-medium italic text-stone-700 dark:text-stone-300">
          {quote}
        </p>
      </div>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
        {/* Total Card */}
        <div className="p-4 rounded-xl bg-card-bg border border-border-color shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Tugas Aktif</span>
            <h3 className="text-2xl font-extrabold text-brand-pink-500">{activeTasks}</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-brand-pink-50 dark:bg-brand-pink-100/10 text-brand-pink-500">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Completed Card */}
        <div className="p-4 rounded-xl bg-card-bg border border-border-color shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Selesai</span>
            <h3 className="text-2xl font-extrabold text-brand-green-500">{completedTasks}</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-brand-green-50 dark:bg-brand-green-100/10 text-brand-green-500">
            <CheckCircle className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Progress Card */}
        <div className="p-4 rounded-xl bg-card-bg border border-border-color shadow-sm flex flex-col justify-between transition-all hover:shadow-md gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Progres Belajar & Tugas</span>
            <span className="text-xs md:text-sm font-extrabold text-brand-green-600 dark:text-brand-green-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-pink-500 to-brand-green-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Main Layout Area */}
      <div className="flex-1 md:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 md:overflow-hidden mb-2">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-4 flex flex-col md:min-h-0 md:max-h-full md:overflow-y-auto">
          <div className="p-5 rounded-2xl bg-card-bg border border-border-color shadow-sm">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-brand-pink-500" />
              Tulis Tugas Baru
            </h2>
            
            <form onSubmit={handleAddTask} className="space-y-3">
              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary" htmlFor="task-title">
                  Judul Tugas <span className="text-brand-pink-500">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Misal: Selesaikan tugas resep..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-transparent focus:ring-2 focus:ring-brand-pink-500/25 focus:border-brand-pink-500 focus:outline-none transition-all placeholder:text-stone-400"
                  maxLength={80}
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary" htmlFor="task-desc">
                  Detail / Catatan (Opsional)
                </label>
                <textarea
                  id="task-desc"
                  placeholder="Detail tugas atau bahan tambahan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-transparent focus:ring-2 focus:ring-brand-pink-500/25 focus:border-brand-pink-500 focus:outline-none transition-all placeholder:text-stone-400 min-h-[80px] resize-none"
                  maxLength={200}
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary" htmlFor="task-cat">
                  Kategori
                </label>
                <select
                  id="task-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-transparent focus:ring-2 focus:ring-brand-pink-500/25 focus:border-brand-pink-500 focus:outline-none transition-all text-text-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary" htmlFor="task-priority">
                    Prioritas
                  </label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-transparent focus:ring-2 focus:ring-brand-pink-500/25 focus:border-brand-pink-500 focus:outline-none transition-all text-text-primary text-sm"
                  >
                    <option value="low">🟢 Rendah</option>
                    <option value="medium">🟡 Sedang</option>
                    <option value="high">🔴 Tinggi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary" htmlFor="task-date">
                    Tenggat Waktu
                  </label>
                  <input
                    id="task-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-color bg-transparent focus:ring-2 focus:ring-brand-pink-500/25 focus:border-brand-pink-500 focus:outline-none transition-all text-text-primary text-sm h-[42px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-brand-pink-500 hover:bg-brand-pink-600 text-white dark:text-white font-extrabold transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tambah Tugas
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Tasks list, filters, search */}
        <div className="lg:col-span-8 flex flex-col md:min-h-0 md:h-full md:overflow-hidden gap-4">
          
          {/* Filters, Search bar */}
          <div className="p-3.5 rounded-2xl bg-card-bg border border-border-color shadow-sm space-y-3 flex-shrink-0">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari tugas Tia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-color bg-transparent focus:ring-2 focus:ring-brand-green-500/25 focus:border-brand-green-500 focus:outline-none transition-all text-sm placeholder:text-stone-400"
                />
              </div>

              {/* Sorting and category filter dropdown */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center border border-border-color rounded-xl px-3 bg-transparent">
                  <Filter className="w-4 h-4 text-stone-400 mr-2" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-2.5 pr-2 bg-transparent text-sm focus:outline-none text-text-primary w-24 md:w-auto"
                  >
                    <option value="all">Semua Kategori</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative flex items-center border border-border-color rounded-xl px-3 bg-transparent">
                  <ArrowUpDown className="w-4 h-4 text-stone-400 mr-2" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="py-2.5 pr-2 bg-transparent text-sm focus:outline-none text-text-primary w-24 md:w-auto"
                  >
                    <option value="created">Terbaru dibuat</option>
                    <option value="date">Jatuh Tempo</option>
                    <option value="priority">Prioritas Utama</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Tabs (All, Active, Completed) */}
            <div className="flex border-b border-border-color pb-1">
              {[
                { id: "all", label: "Semua Tugas", count: totalTasks },
                { id: "active", label: "Belum Selesai", count: activeTasks },
                { id: "completed", label: "Telah Selesai", count: completedTasks },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`flex-1 py-2 text-center text-xs md:text-sm font-bold border-b-2 transition-all relative ${
                    statusFilter === tab.id
                      ? "border-brand-pink-500 text-brand-pink-500 dark:text-brand-pink-400"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    {tab.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      statusFilter === tab.id
                        ? "bg-brand-pink-100 text-brand-pink-500 dark:bg-brand-pink-500/20 dark:text-brand-pink-500"
                        : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                    }`}>
                      {tab.count}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tasks Container */}
          <div className="flex-1 md:min-h-0 md:overflow-y-auto space-y-4 pr-1">
            
            {/* Editing Card Mode Overlay/Inline */}
            {editingTaskId && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-pink-50/70 to-brand-green-50/70 dark:from-brand-pink-900/10 dark:to-brand-green-900/10 border-2 border-brand-pink-500/30 dark:border-brand-pink-500/20 shadow-md transition-all animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-md flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-brand-pink-500" />
                    Edit Tugas
                  </h3>
                  <button
                    onClick={cancelEdit}
                    className="p-1 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-card-bg focus:ring-2 focus:ring-brand-pink-500/25 focus:outline-none text-sm"
                      placeholder="Judul tugas..."
                      maxLength={80}
                      required
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-card-bg focus:ring-2 focus:ring-brand-pink-500/25 focus:outline-none text-sm min-h-[60px] resize-none"
                      placeholder="Detail..."
                      maxLength={200}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border-color bg-card-bg focus:ring-2 focus:ring-brand-pink-500/25 focus:outline-none text-sm text-text-primary"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-border-color bg-card-bg focus:ring-2 focus:ring-brand-pink-500/25 focus:outline-none text-sm text-text-primary"
                    >
                      <option value="low">🟢 Rendah</option>
                      <option value="medium">🟡 Sedang</option>
                      <option value="high">🔴 Tinggi</option>
                    </select>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border-color bg-card-bg focus:ring-2 focus:ring-brand-pink-500/25 focus:outline-none text-sm text-text-primary"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 text-sm font-bold border border-border-color rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-bold bg-brand-green-500 hover:bg-brand-green-600 text-white dark:text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Simpan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Empty State */}
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-card-bg border border-border-color shadow-sm space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 bg-brand-pink-50 dark:bg-brand-pink-900/10 rounded-full animate-ping opacity-25"></div>
                  <div className="relative w-20 h-20 bg-brand-pink-100 dark:bg-brand-pink-900/40 rounded-full flex items-center justify-center text-brand-pink-500 dark:text-brand-pink-300">
                    <CheckSquare className="w-10 h-10" />
                  </div>
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-extrabold text-lg text-text-primary">
                    {searchQuery ? "Tidak Menemukan Hasil" : "Semua Bersih! ✨"}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {searchQuery
                      ? "Cobalah mengetik kata kunci lain atau bersihkan kotak pencarian."
                      : "Wah hebat! Tia tidak memiliki tugas tertunda di tab ini. Yuk, buat catatan baru atau nikmati harimu! 🌱"}
                  </p>
                </div>
              </div>
            ) : (
              /* Tasks List Render */
              <div className="space-y-3.5">
                {filteredTasks.map((task) => {
                  const isCompleted = task.completed;
                  const isBeingChecked = checkedAnimationId === task.id;

                  // Get priority badge styling
                  const getPriorityBadge = (p: string) => {
                    switch (p) {
                      case "high":
                        return "bg-brand-pink-50 text-brand-pink-600 dark:bg-brand-pink-950/40 dark:text-brand-pink-400 border border-brand-pink-200/50 dark:border-brand-pink-900/20";
                      case "medium":
                        return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/20";
                      default:
                        return "bg-brand-green-50 text-brand-green-600 dark:bg-brand-green-950/40 dark:text-brand-green-400 border border-brand-green-200/50 dark:border-brand-green-900/20";
                    }
                  };

                  const getPriorityLabel = (p: string) => {
                    if (p === "high") return "Tinggi";
                    if (p === "medium") return "Sedang";
                    return "Rendah";
                  };

                  const catData = CATEGORIES.find((c) => c.id === task.category);
                  const displayCat = catData ? catData.label : `🏷️ ${task.category}`;

                  return (
                    <div
                      key={task.id}
                      className={`group p-4.5 rounded-2xl bg-card-bg border transition-all flex items-start gap-4 hover:translate-y-[-1px] ${
                        isCompleted
                          ? "border-brand-green-200/60 dark:border-brand-green-950/40 opacity-70 bg-gradient-to-r from-transparent to-brand-green-50/10"
                          : "border-border-color shadow-sm hover:shadow-md"
                      } ${isBeingChecked ? "scale-98 translate-y-0 opacity-80" : ""}`}
                    >
                      {/* Custom styled checkbox with animation */}
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={`mt-1 flex items-center justify-center w-6 h-6 rounded-lg border-2 shrink-0 transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-brand-green-500 border-brand-green-500 text-white animate-check"
                            : "border-stone-300 dark:border-stone-600 hover:border-brand-pink-500 focus:outline-none"
                        }`}
                        title={isCompleted ? "Tandai Belum Selesai" : "Tandai Selesai"}
                      >
                        {isCompleted && <Check className="w-4 h-4 stroke-[3px]" />}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="space-y-1">
                          <h4
                            className={`font-bold text-md text-text-primary leading-tight transition-all break-words ${
                              isCompleted ? "line-through text-stone-400 dark:text-stone-500" : ""
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p
                              className={`text-sm text-text-secondary leading-relaxed transition-all break-words whitespace-pre-line ${
                                isCompleted ? "line-through text-stone-400/80 dark:text-stone-500/80" : ""
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Task Metadata Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {/* Category */}
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/30 dark:border-stone-700/30">
                            {displayCat}
                          </span>

                          {/* Priority */}
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg ${getPriorityBadge(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>

                          {/* Due Date */}
                          {task.dueDate && (
                            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(task.dueDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons (Edit, Delete) */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditTask(task)}
                          className="p-2 text-stone-400 hover:text-brand-pink-500 hover:bg-brand-pink-50 dark:hover:bg-brand-pink-950/30 rounded-xl transition-all hover:scale-105 active:scale-95"
                          title="Edit Tugas"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all hover:scale-105 active:scale-95"
                          title="Hapus Tugas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-3 border-t border-border-color flex flex-col md:flex-row items-center justify-between text-xs text-text-secondary gap-2 font-semibold flex-shrink-0">
        <p>Made with 💖 • To Do List Website</p>
        <p className="flex items-center gap-1">
          Powered by Next.js & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
