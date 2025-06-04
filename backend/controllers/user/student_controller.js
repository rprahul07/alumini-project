import { ROLES } from "../../constants/user_constants.js";
import { createUser } from "../../services/user_service.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";

export const createStudent = async (userData) => {
  const { currentSemester, rollNumber, ...baseData } = userData;
  
  return createUser({
    ...baseData,
    currentSemester,
    rollNumber
  }, ROLES.STUDENT);
};

export const registerStudent = async (req, res) => {
  try {
    const newStudent = await createStudent(req.body);
    generateTokenAndSetCookie(newStudent.id, ROLES.STUDENT, res);

    res.status(201).json(createResponse(
      true,
      "Student registered successfully",
      {
        _id: newStudent.id,
        fullName: newStudent.fullName,
        email: newStudent.email,
        role: ROLES.STUDENT
      }
    ));
  } catch (error) {
    handleError(error, req, res);
  }
}; 