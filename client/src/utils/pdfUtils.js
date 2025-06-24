import jsPDF from 'jspdf';

export const generateCGPAPdf = (profile, semesters) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Academic Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${profile.name}`, 14, 30);
    doc.text(`Department: ${profile.department}`, 14, 37);
    doc.text(`Year of Passing: ${profile.yearOfPassing}`, 14, 44);
    doc.text(`College: ${profile.college}`, 14, 51);

    let y = 65;
    doc.setFontSize(14);
    doc.text('CGPA Summary:', 14, y);
    y += 10;


    doc.setFontSize(12);
    doc.text('Sem', 14, y);
    doc.text('Subject', 34, y);
    doc.text('Grade', 124, y);
    doc.text('Credit', 154, y);
    y += 7;

    semesters.forEach((sem, i) => {
        sem.subjects.forEach((subject) => {
            doc.text(`S${i + 1}`, 14, y);
            doc.text(subject.name, 34, y);
            doc.text(subject.grade?.toString() || '-', 124, y);
            doc.text(subject.credit?.toString() || '-', 154, y);
            y += 7;
        });
    });

    const finalCGPA = semesters.reduce((acc, sem) => {
        let totalPoints = 0, totalCredits = 0;
        sem.subjects.forEach(sub => {
            const pointMap = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, U: 0, AB: 0, W: 0, WH: 0, SA: 0 };
            const gradePoint = pointMap[sub.grade?.toUpperCase()] || 0;
            const credit = parseFloat(sub.credit) || 0;
            totalPoints += gradePoint * credit;
            totalCredits += credit;
        });
        if (totalCredits > 0) acc.totalPoints += totalPoints;
        acc.totalCredits += totalCredits;
        return acc;
    }, { totalPoints: 0, totalCredits: 0 });

    const cgpa = finalCGPA.totalCredits === 0 ? 0 : (finalCGPA.totalPoints / finalCGPA.totalCredits).toFixed(2);
    doc.text(`Final CGPA: ${cgpa}`, 14, y + 10);

    doc.save(`${profile.name.replaceAll(" ", "_")}_CGPA_Report.pdf`);
};
