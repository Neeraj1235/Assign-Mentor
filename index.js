const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

let students = [
  {
    id: 1,
    name: "Neeraj Kumar",
    mentorId: 1,
  },
  {
    id: 2,
    name: "Ankit Gupta",
    mentorId: 2,
  },
  {
    id: 3,
    name: "Lokesh Kumar",
    mentorId: 3,
  },
  {
    id: 4,
    name: "Aman Kumar",
  },
];
let mentors = [
  {
    id: 1,
    name: "Raj",
  },
  {
    id: 2,
    name: "Rohit",
  },
  {
    id: 3,
    name: "Virat",
    students: 1,
  },
  {
    id: 4,
    name: "Sachin",
    students: [2, 3],
  },
];

app.get("/", function (req, res) {
  res.json("Server is running");
});

// Get All Students
app.get("/students", function (req, res) {
  res.json(students);
});

// Get All mentors
app.get("/mentors", function (req, res) {
    res.json(mentors);
  });

// Get Student with Mentor Id
app.get("/students/:mentorId", function (req, res) {
  if (req.params.mentorId) {
    let list = [];
    students.forEach((studentId) => {
      if (studentId.mentorId) {
        if (req.params.mentorId == studentId.mentorId) {
          list.push(studentId);
        }
      }
    });
    res.json(list);
  } else {
    res.json(students);
  }
});

// Get Unassigned Students
app.get("/unassignedstudents", function (req, res) {
  let unassignedstudents = students.filter((item) => {
    if (!item.mentorId || item.mentorId == "") {
      return item;
    }
  });
  res.json(unassignedstudents);
});

// Add a Student
app.post("/addStudent", function (req, res) {
  let temp = {
    id: students.length + 1,
    name: req.body.name,
  };
  students.push(temp);
  res.json(students);
});

// Assign Mentor to Student
app.post("/assignMentor", function (req, res) {
  let mentor = req.body.mentor;
  let inpstudents = req.body.students;

  students.forEach((studentId) => {
    if (inpstudents == studentId.id) {
      studentId.mentorId = mentor;
    }
  });

  mentors.forEach((mentorId) => {
    if (mentor == mentorId.id) {
      if (mentorId.students) {
        mentorId.students.push(inpstudents);
      } else {
        mentorId.students = [inpstudents];
      }
    }
  });
  let unassignedstudents = students.filter((item) => {
    if (!item.mentorId || item.mentorId == "") {
      return item;
    }
  });
  res.json(unassignedstudents);
});

// Add Mentor
app.post("/addMentor", function (req, res) {
    let temp = {
      id: mentors.length + 1,
      name: req.body.name,
    };
    mentors.push(temp);
    res.json(mentors);
  });

// Change Mentor
app.put("/changeMentor", function (req, res) {
  let mentorId = req.body.mentorId;
  let studentId = req.body.studentId;
  let previousMentor = "";

  students.forEach((student) => {
    if (studentId == student.id) {
      previousMentor = student.mentorId;
      mentors.forEach((delmentorId) => {
        if (student.mentorId == delmentorId.id) {
          delmentorId.students = delmentorId.students.filter(
            (item) => item != studentId
          );
        }
      });
      student.mentorId = mentorId;
    }
  });
  mentors.forEach((mentorItem) => {
    if (mentorId == mentorItem.id) {
      if (mentorItem.students) {
        mentorItem.students.push(parseInt(studentId));
      } else {
        mentorItem.students = [parseInt(studentId)];
      }
    }
  });
  let list = [];
  students.forEach((studentId) => {
    if (studentId.mentorId) {
      if (previousMentor == studentId.mentorId) {
        list.push(studentId);
      }
    }
  });
  res.json(list);
});

// Get Unassigned Mentors With Student Id
app.get("/unassignedmentors/:studentId", function (req, res) {
  let studentId = req.params.studentId;
  const filtStudent = students.find(({ id }) => id == studentId);
  const filteredMentors = mentors.filter(
    (mentor) => mentor.id != filtStudent.mentorId
  );
  res.json({
    mentors: filteredMentors,
    student: filtStudent,
  });
});

app.listen(port, () => console.log(`Your app is running with ${port}`));
