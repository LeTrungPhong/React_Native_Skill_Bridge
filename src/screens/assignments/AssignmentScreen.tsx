import { AuthContext } from "@/src/context/authContext";
import { useContext } from "react";
import StudentAssignmentScreen from "./StudentAssignmentScreen";
import TeacherAssignmentScreen from "./TeacherAssignmentScreen";

const AssignmentScreen = () => {
  const [state] = useContext(AuthContext);

  return (
    state.info.role === 'TEACHER' ? (
      <TeacherAssignmentScreen />
    ) : (
      <StudentAssignmentScreen />
    )
  );
}

export default AssignmentScreen;