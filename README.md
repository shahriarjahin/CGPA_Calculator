# GAU CGPA Calculator

A web-based CGPA calculator for Gazipur Agricultural University (GAU) students. This tool helps students calculate their Grade Point Average (GPA) for current terms and Cumulative Grade Point Average (CGPA) across their academic career.

## Features

- **Faculty Selection**: Choose from multiple faculties including Fisheries, Agriculture, Agricultural Economics & Rural Development (AERD), Veterinary Medicine (DVM), Forestry & Environment, and Agricultural Engineering.
- **Dynamic Subject Loading**: Automatically loads subjects based on selected faculty, year, and term from CSV data files.
- **Grade Input**: Easy dropdown selection for grades (A+, A, A-, B+, B, B-, C+, C, D, F).
- **Auto-calculation**: Automatically calculates total credits completed and CGPA based on previous academic performance.
- **Real-time Updates**: GPA and CGPA update instantly as grades are entered.
- **Responsive Design**: Works on desktop and mobile devices.

## How to Use

1. **Select Faculty**: Choose your faculty from the dropdown menu.
2. **Select Year**: Choose your academic year.
3. **Select Term**: Choose your term (Summer, Autumn, Winter).
4. **Enter Previous CGPA** (optional): Input your previous cumulative CGPA and total credits completed.
5. **Input Grades**: For each subject in the current term, select your grade from the dropdown.
6. **View Results**: The calculator will display your Term GPA and updated Cumulative CGPA.

## File Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styling
- `scripts.js` - JavaScript functionality
- `data/` - Directory containing CSV files with subject data for each faculty
  - `fisheries.csv`
  - `agriculture.csv`
  - `aerd.csv`
  - `dvm.csv`
  - `forestry.csv`
  - `ageng.csv`
  - `img/` - University logo

## Setup

1. Clone or download the project files.
2. Open `index.html` in a web browser.
3. No additional setup required - the application runs entirely in the browser.

## Data Files

The calculator uses CSV files stored in the `data/` directory to load subject information. Each faculty has its own CSV file containing:
- Subject codes
- Subject names
- Credit hours
- Year and term information

## Grade Scale

- A+ = 4.00
- A = 3.75
- A- = 3.50
- B+ = 3.25
- B = 3.00
- B- = 2.75
- C+ = 2.50
- C = 2.25
- D = 2.00
- F = 0.00

## Browser Compatibility

Works in all modern web browsers including Chrome, Firefox, Safari, and Edge.

## Contributing

To add support for new faculties or update subject data:
1. Add/update the corresponding CSV file in the `data/` directory
2. Update the faculty dropdown in `index.html` if adding a new faculty
3. Test the changes to ensure proper loading and calculation

## License

This project is open source and available under the MIT License.
