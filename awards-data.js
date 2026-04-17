/**
 * Awards & Recognition Data — consumed by recognition.html
 * Edit via admin.html → Awards tab.
 */
const AWARDS_DATA = {
  industry: [
    { id: "a-construction-world-2021", year: "2021", issuer: "Construction World Magazine", meta: "Construction World Magazine", icon: "fa-trophy",     title: "Fastest Growing Construction Company", description: "Recognised for rapid expansion and consistent project delivery excellence across residential, commercial, and institutional sectors." },
    { id: "a-governor-2022",          year: "2022", issuer: "Maharashtra Governor's Award", meta: "Maharashtra Governor's Award", icon: "fa-landmark",   title: "Contribution to Urban Development",     description: "Honoured for significant contributions towards modernising urban infrastructure in Mumbai and the Metropolitan Region." },
    { id: "a-times-network-2023",     year: "2023", issuer: "Times Network Award",          meta: "Times Network Award",          icon: "fa-medal",      title: "Excellence in Infrastructure",          description: "Celebrating outstanding achievements in delivering complex infrastructure projects with superior quality and schedule discipline." },
    { id: "a-et-safety-2024",         year: "2024", issuer: "Economic Times Award",         meta: "Economic Times Award",         icon: "fa-shield-alt", title: "Best Safety Practices",                 description: "Awarded for maintaining the highest standards of safety protocols and accident-free operational hours across active project sites." }
  ],
  client: [
    { id: "c-upper-thane-2019",       year: "2019",         issuer: "", icon: "fa-hard-hat",    title: "Upper Thane Recognition", meta: "2019 · Safety Audit",            description: "Certificate of Appreciation for exemplary safety practices and procedures on the Upper Thane project site." },
    { id: "c-mahindra-serenes-2019",  year: "Oct 2019",     issuer: "", icon: "fa-certificate", title: "Serenes MSA Audit",       meta: "Oct 2019 · Mahindra Lifespaces",  description: "Certificate of Appreciation from Mahindra Lifespaces for outstanding performance in the MSA Audit on the Serenes project." }
  ]
};
if (typeof window !== 'undefined') window.AWARDS_DATA = AWARDS_DATA;
