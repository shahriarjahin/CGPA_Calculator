// Empty Object to be populated from CSV
let SUBJECTS = {};

// Expanded to 5th year for DVM and other longer programs
const TERM_ORDER = [
  {y: "1st", t: "Summer"}, {y: "1st", t: "Autumn"}, {y: "1st", t: "Winter"},
  {y: "2nd", t: "Summer"}, {y: "2nd", t: "Autumn"}, {y: "2nd", t: "Winter"},
  {y: "3rd", t: "Summer"}, {y: "3rd", t: "Autumn"}, {y: "3rd", t: "Winter"},
  {y: "4th", t: "Summer"}, {y: "4th", t: "Autumn"}, {y: "4th", t: "Winter"},
  {y: "5th", t: "Summer"}, {y: "5th", t: "Autumn"}, {y: "5th", t: "Winter"}
];

const GRADE_OPTS=[
  {label:"— Not Graded —",val:""}, {label:"A+ (4.00)",val:"4.00"},
  {label:"A (3.75)",val:"3.75"}, {label:"A− (3.50)",val:"3.50"},
  {label:"B+ (3.25)",val:"3.25"}, {label:"B (3.00)",val:"3.00"},
  {label:"B− (2.75)",val:"2.75"}, {label:"C+ (2.50)",val:"2.50"},
  {label:"C (2.25)",val:"2.25"}, {label:"D (2.00)",val:"2.00"},
  {label:"F (0.00)",val:"0.00"}
];

const LETTER_MAP=[
  [4.00,"A+","#04342C","#9FE1CB"], [3.75,"A","#085041","#D1FAE5"],
  [3.50,"A−","#0F6E56","#E1F5EE"], [3.25,"B+","#185FA5","#DBEAFE"],
  [3.00,"B","#1E40AF","#EFF6FF"], [2.75,"B−","#3730A3","#EEEDFE"],
  [2.50,"C+","#854F0B","#FEF3C7"], [2.25,"C","#92400E","#FFEDD5"],
  [2.00,"D","#991B1B","#FEE2E2"], [0.00,"F","#7F1D1D","#FECACA"]
];

// Do NOT load data automatically on page load anymore. Just set the UI prompt.
window.onload = function() {
  document.getElementById("yearSel").innerHTML = '<option value="">Select faculty first</option>';
  document.getElementById("yearSel").disabled = true;
};

// Dynamically fetch CSV based on Faculty dropdown
async function loadFacultyData() {
  const faculty = document.getElementById("facultySel").value;
  const yearSel = document.getElementById("yearSel");
  const termSel = document.getElementById("termSel");
  
  // If the user somehow selects the blank option, do nothing and reset
  if (!faculty) {
    yearSel.innerHTML = '<option value="">Select faculty first</option>';
    yearSel.disabled = true;
    termSel.innerHTML = '<option value="">Select term</option>';
    document.querySelector(".badge").textContent = "University Calculator";
    return;
  }
  
  // Reset UI while loading
  yearSel.innerHTML = '<option value="">Loading...</option>';
  yearSel.disabled = true;
  termSel.innerHTML = '<option value="">Select term</option>';
  document.getElementById("subjectCard").style.display = "none";
  document.getElementById("resultCard").style.display = "none";
  document.getElementById("prevCredits").value = "";
  
  // Clear old data
  SUBJECTS = {}; 

  try {
    // GITHUB FIX: Use strict relative pathing with './' so GitHub Pages knows 
    // exactly where to look, even if the site is hosted in a sub-repository.
    const csvPath = `./data/${faculty}.csv`;
    
    // GITHUB FIX: Added a console log so if it breaks on the live site, 
    // you can press F12 and see exactly what path it was trying to find.
    console.log(`Attempting to fetch data from: ${csvPath}`);
    
    const response = await fetch(csvPath);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvData = await response.text();
    
    // Parse the lines
    const lines = csvData.trim().split('\n');
    for(let i = 1; i < lines.length; i++) {
        if(!lines[i].trim()) continue;
        const row = lines[i].split(',');
        if(row.length < 6) continue;

        const year = row[1].trim();
        const term = row[2].trim().charAt(0).toUpperCase() + row[2].trim().slice(1).toLowerCase();
        const courseId = row[3].trim();
        const title = row[4].trim();
        const credit = parseFloat(row[5].trim());

        if(!SUBJECTS[year]) SUBJECTS[year] = {};
        if(!SUBJECTS[year][term]) SUBJECTS[year][term] = [];
        SUBJECTS[year][term].push({ id: courseId, title: title, cr: credit });
    }

    // Populate Year Dropdown based on the newly loaded CSV
    yearSel.innerHTML = '<option value="">Select year</option>';
    Object.keys(SUBJECTS).sort().forEach(y => {
      const o = document.createElement("option"); o.value = y; o.textContent = y; yearSel.appendChild(o);
    });
    yearSel.disabled = false;

    // Update the badge text in the UI to match the faculty
    const facultyDropdown = document.getElementById("facultySel");
    const facultyName = facultyDropdown.options[facultyDropdown.selectedIndex].text;
    document.querySelector(".badge").textContent = facultyName + " Faculty";
    
    console.log("Successfully loaded data for:", facultyName);

  } catch (err) {
    console.error("Fetch failed:", err);
    alert(`Could not load the data file for this faculty. \n\nEnsure that the file exists at ./data/${faculty}.csv and that the spelling and capitalization are exactly correct on GitHub.`);
    yearSel.innerHTML = '<option value="">Failed to load data</option>';
  }
}

function getLetter(gpa){
  for(const [t,l,tc,bg] of LETTER_MAP) if(gpa>=t) return {label:l,tc,bg};
  return {label:"F",tc:"#7F1D1D",bg:"#FECACA"};
}

function calculatePrevCredits(currentYear, currentTerm) {
  let totalCredits = 0;
  for (const item of TERM_ORDER) {
    // Stop adding credits once we reach the currently selected term
    if (item.y === currentYear && item.t === currentTerm) break;
    
    const subs = SUBJECTS[item.y]?.[item.t] || [];
    subs.forEach(s => { totalCredits += s.cr; });
  }
  return totalCredits;
}

function updateTerms(){
  const yr = document.getElementById("yearSel").value;
  const ts = document.getElementById("termSel");
  ts.innerHTML='<option value="">Select term</option>';
  
  if(yr && SUBJECTS[yr]) {
    Object.keys(SUBJECTS[yr]).forEach(t=>{
      const o=document.createElement("option"); o.value=t; o.textContent=t; ts.appendChild(o);
    });
  }
  
  document.getElementById("subjectCard").style.display="none";
  document.getElementById("resultCard").style.display="none";
}

function loadSubjects(){
  const yr = document.getElementById("yearSel").value;
  const tm = document.getElementById("termSel").value;
  
  if(!yr || !tm){
    document.getElementById("subjectCard").style.display="none";
    return;
  }
  
  const autoCredits = calculatePrevCredits(yr, tm);
  document.getElementById("prevCredits").value = autoCredits;

  const subs = SUBJECTS[yr][tm] || [];
  const list = document.getElementById("subjectList");
  list.innerHTML="";
  
  subs.forEach((s,i)=>{
    const div = document.createElement("div");
    div.className = "subject-row";
    div.dataset.idx = i;
    div.innerHTML = `
      <div class="s-name"><span class="s-code">${s.id}</span>${s.title}</div>
      <input type="number" class="cr-in" id="cr_${i}" value="${s.cr}" min="1" max="12" step="0.5" oninput="updateTotalCr();recalc()">
      <select class="grade-sel" id="gr_${i}" onchange="recalc()">${GRADE_OPTS.map(g=>`<option value="${g.val}">${g.label}</option>`).join("")}</select>
      <button class="rm-btn" title="Remove subject" onclick="this.closest('.subject-row').remove();updateTotalCr();recalc()">×</button>`;
    list.appendChild(div);
  });
  
  document.getElementById("subjectCard").style.display="block";
  document.getElementById("resultCard").style.display="none";
  updateTotalCr();
  recalc(); 
}

function updateTotalCr(){
  let t = 0;
  document.querySelectorAll(".cr-in").forEach(i => t += parseFloat(i.value) || 0);
  document.getElementById("totalCrDisplay").textContent = t + " Credits";
}

function resetGrades(){
  document.querySelectorAll(".grade-sel").forEach(s => s.value = "");
  document.getElementById("resultCard").style.display = "none";
  recalc();
}

function recalc(){
  const rows = document.querySelectorAll(".subject-row");
  let pts = 0, cr = 0;
  
  rows.forEach(r => {
    const c = parseFloat(r.querySelector(".cr-in").value) || 0;
    const gv = r.querySelector(".grade-sel").value;
    if(gv !== ""){ pts += c * parseFloat(gv); cr += c; }
  });
  
  const prevCgpa = parseFloat(document.getElementById("prevCgpa").value);
  const prevCr = parseFloat(document.getElementById("prevCredits").value) || 0;
  
  // Abort if no current term subjects filled AND no past CGPA available
  if (cr === 0 && (isNaN(prevCgpa) || prevCr === 0)) { 
    document.getElementById("resultCard").style.display="none"; 
    return; 
  }
  
  let tGpa = cr > 0 ? pts / cr : 0;
  let cgpa = tGpa, cgpaSub = "Based on current term only";
  
  if(!isNaN(prevCgpa) && prevCr > 0){
    if(cr > 0) {
      cgpa = ((prevCgpa * prevCr) + pts) / (prevCr + cr);
      cgpaSub = `Over ${(prevCr + cr).toFixed(0)} total credits`;
    } else {
      cgpa = prevCgpa;
      cgpaSub = `Based on past ${prevCr} credits only`;
    }
  }

  const info = getLetter(cgpa);
  const status = cgpa >= 3.5 ? "Excellent Standing" : cgpa >= 3.0 ? "Good Standing" : cgpa >= 2.0 ? "Satisfactory" : "Below Minimum";

  document.getElementById("termGpa").textContent = cr > 0 ? tGpa.toFixed(2) : "—";
  document.getElementById("termCredits").textContent = cr > 0 ? `${cr} credits this term` : "No grades entered yet";
  document.getElementById("cgpaVal").textContent = cgpa.toFixed(2);
  document.getElementById("cgpaSub").textContent = cgpaSub;
  document.getElementById("letterGrade").innerHTML = `<span style="background:${info.bg};color:${info.tc};padding:4px 18px;border-radius:24px;font-size:22px;font-weight:600;">${info.label}</span>`;
  document.getElementById("gradeStatus").textContent = status;
  
  document.getElementById("progBar").style.width = ((cgpa / 4) * 100).toFixed(1) + "%";
  const pcolor = cgpa >= 3.5 ? "var(--color-accent)" : cgpa >= 3.0 ? "#2563eb" : cgpa >= 2.0 ? "#d97706" : "var(--color-danger)";
  document.getElementById("progBar").style.background = pcolor;

  let bk = `<div style="border-top:1px solid var(--color-border-tertiary); padding-top:20px;">
    <div style="font-size:14px; font-weight:600; color:var(--color-text-secondary); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.03em;">Subject-wise Breakdown</div>`;
    
  rows.forEach(r => {
    const nameEl = r.querySelector(".s-name");
    const code = nameEl.querySelector(".s-code").textContent;
    const name = nameEl.childNodes[nameEl.childNodes.length-1].textContent.trim();
    const c = parseFloat(r.querySelector(".cr-in").value) || 0;
    const gv = r.querySelector(".grade-sel").value;
    const gLabel = gv === "" ? "—" : GRADE_OPTS.find(g => g.val === gv)?.label.split(" ")[0] || "—";
    const ptsCalculated = gv === "" ? "—" : (parseFloat(gv) * c).toFixed(2);
    const graded = gv !== "";
    
    bk += `<div class="bk-row">
      <span style="color:var(--color-text-primary); font-weight:500; flex:1;">
        <span style="color:var(--color-text-tertiary); font-size:12px; margin-right:8px; font-weight:600;">${code}</span>${name}
      </span>
      <span style="color:var(--color-text-secondary); margin:0 16px; white-space:nowrap; font-weight:500;">${c} cr</span>
      <span style="color:${graded ? "var(--color-text-primary)" : "var(--color-text-tertiary)"}; width:60px; text-align:right; font-weight:600;">${gLabel}</span>
      <span style="color:var(--color-text-secondary); font-weight:600; width:70px; text-align:right;">${ptsCalculated === "—" ? "" : ptsCalculated + " pts"}</span>
    </div>`;
  });
  
  bk += '</div>';
  
  // Hide breakdown if no grades inputted for current term
  if (cr === 0) bk = ""; 

  document.getElementById("subjectBreakdown").innerHTML = bk;
  document.getElementById("resultCard").style.display = "block";
}
