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


    doc.line(14, 55, 195, 55);

    let y = 65;

    doc.setFontSize(14);
    doc.text('CGPA Summary:', 14, y);
    y += 10;

    doc.setFontSize(12);

    const pointMap = {
        O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5,
        U: 0, AB: 0, W: 0, WH: 0, SA: 0
    };

    let totalPointsAll = 0;
    let totalCreditsAll = 0;

    semesters.forEach((sem, i) => {
        let totalPoints = 0;
        let totalCredits = 0;


        doc.setFontSize(13);
        doc.text(`Semester ${sem.semesterNumber || i + 1}`, 14, y);
        y += 7;


        doc.setFontSize(11);
        doc.text('Subject', 20, y);
        doc.text('Grade', 120, y);
        doc.text('Credit', 150, y);
        y += 6;


        sem.subjects.forEach(subject => {
            const name = subject.name || '-';
            const grade = subject.grade?.toUpperCase() || '-';
            const credit = parseFloat(subject.credit) || 0;

            const gradePoint = pointMap[grade] || 0;
            totalPoints += gradePoint * credit;
            totalCredits += credit;

            doc.text(name, 20, y);
            doc.text(grade, 120, y);
            doc.text(credit.toString(), 150, y);
            y += 6;


            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });


        const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
        doc.setFontSize(11);
        doc.text(`GPA: ${gpa}`, 20, y);
        y += 4;


        doc.line(14, y, 195, y);
        y += 6;

        totalPointsAll += totalPoints;
        totalCreditsAll += totalCredits;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });


    const cgpa = totalCreditsAll === 0
        ? '0.00'
        : (totalPointsAll / totalCreditsAll).toFixed(2);

    doc.line(14, y + 6, 195, y + 6);
    doc.setFontSize(13);
    doc.text(`Final CGPA: ${cgpa}`, 14, y + 12);


    doc.setFontSize(10);
    doc.setTextColor(200);
    doc.text('Made with Gradiator ©', 105, 285, { align: 'center' });


    const filename = `${profile.name.replaceAll(" ", "_")}_CGPA_Report.pdf`;
    doc.save(filename);
};
