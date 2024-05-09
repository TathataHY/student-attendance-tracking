const { default: axios } = require("axios");

// Grades
const getGrades = () => axios.get("/api/grade");

// Students
const getStudents = () => axios.get("/api/student");
const postStudent = (data) => axios.post("/api/student", data);
const deleteStudent = (id) => axios.delete(`/api/student?id=${id}`);

// Attendance
const getAttendance = ({ grade, month }) =>
  axios.get(`/api/attendance?grade=${grade}&month=${month}`);
const postAttendance = (data) => axios.post("/api/attendance", data);
const deleteAttendance = (id) => axios.delete(`/api/attendance?id=${id}`);

export default {
  // Grades
  getGrades,

  // Students
  getStudents,
  postStudent,
  deleteStudent,

  // Attendance
  getAttendance,
  postAttendance,
  deleteAttendance,
};
