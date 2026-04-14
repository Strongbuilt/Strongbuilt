/**
 * Active / Currently Building — consumed by index.html "Currently Building" strip
 * Edit via admin.html → Active Projects tab.
 */
const ACTIVE_PROJECTS_DATA = [
  { id: "ap-splendora-ii",     name: "Splendora Phase II", location: "Pune · Mixed Use",     progress: 78, eta: "Q3 2026" },
  { id: "ap-lodha-highrise",   name: "Lodha Highrise",     location: "Thane · Residential",   progress: 54, eta: "Q1 2027" },
  { id: "ap-mahindra-serenes", name: "Mahindra Serenes",   location: "Alibaug · Premium",     progress: 42, eta: "Q4 2027" },
  { id: "ap-hiranandani-c",    name: "Hiranandani Block C", location: "Powai · Residential",  progress: 31, eta: "Q2 2027" }
];
if (typeof window !== 'undefined') window.ACTIVE_PROJECTS_DATA = ACTIVE_PROJECTS_DATA;
