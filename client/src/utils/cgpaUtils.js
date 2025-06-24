export const gradeToPoint = (grade) => {
    const map = {
        'O': 10,
        'A+': 9,
        'A': 8,
        'B+': 7,
        'B': 6,
        'C': 5,
        'U': 0,
        'AB': 0,
        'W': 0,
        'WH': 0,
        'SA': 0,
    };
    return map[grade] ?? 0;
};

export const calculateSGPA = (subjects) => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(({ grade, credit }) => {
        const point = gradeToPoint(grade);
        totalPoints += point * credit;
        totalCredits += credit;
    });

    return totalCredits ? (totalPoints / totalCredits).toFixed(3) : 0;
};

export const calculateCGPA = (semesters) => {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(({ subjects }) => {
        subjects.forEach(({ grade, credit }) => {
            const point = gradeToPoint(grade);
            totalPoints += point * credit;
            totalCredits += credit;
        });
    });

    return totalCredits ? (totalPoints / totalCredits).toFixed(3) : 0;
};
