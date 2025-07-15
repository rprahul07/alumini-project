import React from 'react';
import StudentCard from './StudentCard';

const StudentGrid = ({ students }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {students.map((student, idx) => (
        <StudentCard key={student.id || idx} student={student} />
      ))}
    </div>
  );
};

export default StudentGrid; 