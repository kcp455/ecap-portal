// ─── Simulated MySQL `students` table ──────────────────────────
// In production, replace with: fetch('/api/students') → MySQL backend
export const INITIAL_STUDENTS = [
  { id: "STU001", name: "Aarav Sharma",   email: "aarav@ecap.edu",   password: "pass123", department: "Computer Science",       year: 3, cgpa: 8.7, attendance: 92, feeDue: 12000, qualification: "B.Tech CSE", achievements: ["Dean's List 2024", "Hackathon Winner"], photo: "" },
  { id: "STU002", name: "Priya Patel",    email: "priya@ecap.edu",   password: "pass123", department: "Electronics",            year: 2, cgpa: 9.1, attendance: 95, feeDue: 0,     qualification: "B.Tech ECE", achievements: ["Gold Medal - Physics", "IEEE Paper Published"], photo: "" },
  { id: "STU003", name: "Rohan Gupta",    email: "rohan@ecap.edu",   password: "pass123", department: "Mechanical",             year: 4, cgpa: 7.9, attendance: 88, feeDue: 25000, qualification: "B.Tech ME",  achievements: ["SAE Competition Finalist"], photo: "" },
  { id: "STU004", name: "Sneha Reddy",    email: "sneha@ecap.edu",   password: "pass123", department: "Computer Science",       year: 1, cgpa: 8.3, attendance: 91, feeDue: 5000,  qualification: "B.Tech CSE", achievements: [], photo: "" },
  { id: "STU005", name: "Vikram Singh",   email: "vikram@ecap.edu",  password: "pass123", department: "Civil",                  year: 3, cgpa: 7.5, attendance: 85, feeDue: 18000, qualification: "B.Tech CE",  achievements: ["Best Project Award"], photo: "" },
  { id: "STU006", name: "Ananya Iyer",    email: "ananya@ecap.edu",  password: "pass123", department: "Information Technology",  year: 2, cgpa: 9.4, attendance: 97, feeDue: 0,     qualification: "B.Tech IT",  achievements: ["Google Summer of Code", "ACM ICPC Regionalist"], photo: "" },
  { id: "STU007", name: "Karthik Nair",   email: "karthik@ecap.edu", password: "pass123", department: "Electronics",            year: 4, cgpa: 8.0, attendance: 89, feeDue: 8000,  qualification: "B.Tech ECE", achievements: ["VLSI Design Contest Winner"], photo: "" },
  { id: "STU008", name: "Divya Menon",    email: "divya@ecap.edu",   password: "pass123", department: "Computer Science",       year: 1, cgpa: 8.9, attendance: 93, feeDue: 0,     qualification: "B.Tech CSE", achievements: ["State Level Chess Champion"], photo: "" },
  { id: "STU009", name: "Arjun Das",      email: "arjun@ecap.edu",   password: "pass123", department: "Mechanical",             year: 3, cgpa: 7.2, attendance: 82, feeDue: 30000, qualification: "B.Tech ME",  achievements: [], photo: "" },
  { id: "STU010", name: "Meera Joshi",    email: "meera@ecap.edu",   password: "pass123", department: "Information Technology",  year: 2, cgpa: 8.6, attendance: 90, feeDue: 3000,  qualification: "B.Tech IT",  achievements: ["Web Dev Bootcamp Certificate"], photo: "" },
];

export const ADMIN_USER = {
  email: "admin@ecap.edu",
  password: "admin123",
  role: "admin",
};

// ─── Simulated MySQL `subjects` table ──────────────────────────
export const PUBLIC_SUBJECTS = [
  { code: "CS101", name: "Introduction to Programming",   dept: "Computer Science",       credits: 4, materials: ["Lecture Notes (PDF)", "Lab Manual", "Video Tutorials"],        semester: 1 },
  { code: "CS201", name: "Data Structures & Algorithms",  dept: "Computer Science",       credits: 4, materials: ["Textbook Reference", "Practice Problems", "Coding Exercises"], semester: 3 },
  { code: "CS301", name: "Database Management Systems",   dept: "Computer Science",       credits: 3, materials: ["SQL Workbook", "ER Diagram Templates", "Case Studies"],       semester: 5 },
  { code: "EC101", name: "Basic Electronics",             dept: "Electronics",            credits: 4, materials: ["Circuit Diagrams", "Lab Experiments", "Simulation Files"],     semester: 1 },
  { code: "EC201", name: "Digital Signal Processing",     dept: "Electronics",            credits: 3, materials: ["MATLAB Scripts", "Theory Notes", "Assignment Sets"],          semester: 3 },
  { code: "ME101", name: "Engineering Mechanics",         dept: "Mechanical",             credits: 4, materials: ["Problem Sets", "Reference Handbook", "Video Lectures"],       semester: 1 },
  { code: "ME201", name: "Thermodynamics",                dept: "Mechanical",             credits: 3, materials: ["Formula Sheets", "Solved Examples", "Lab Reports"],           semester: 3 },
  { code: "CE101", name: "Surveying",                     dept: "Civil",                  credits: 3, materials: ["Field Manual", "Instrument Guide", "Project Templates"],      semester: 1 },
  { code: "IT201", name: "Web Technologies",              dept: "Information Technology",  credits: 3, materials: ["HTML/CSS Guide", "JavaScript Exercises", "Project Starters"],semester: 3 },
  { code: "MA101", name: "Engineering Mathematics I",     dept: "General",                credits: 4, materials: ["Formula Reference", "Solved Papers", "Practice Tests"],       semester: 1 },
];
