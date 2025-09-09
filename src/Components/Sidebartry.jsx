// Sidebar.jsx
export default function Sidebartry({ role }) {
  const menus = {
    student: ["Dashboard", "My Courses", "Grades"],
    teacher: ["Dashboard", "My Classes", "Attendance"],
    admin: ["Dashboard", "Manage Users", "Reports"],
  };

  return (
    <div className="sidebartry">
      <div className="sidebartry">
        <h2>{menus[role][0]}</h2>
        <h2>{menus[role][1]}</h2>
        <h2>{menus[role][2]}</h2>
      </div>
    </div>
  );
}

