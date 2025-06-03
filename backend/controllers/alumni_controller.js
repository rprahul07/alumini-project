import { ROLES } from "../constants/user_constants.js";
import { createUser } from "../services/user_service.js";
import { createResponse, handleError } from "../utils/response.utils.js";
import generateTokenAndSetCookie from "../utils/generateTocken.js";

export const createAlumni = async (userData) => {
  const { graduationYear, course, currentJobTitle, companyName, ...baseData } = userData;
  
  return createUser({
    ...baseData,
    graduationYear: parseInt(graduationYear),
    course,
    currentJobTitle,
    companyName
  }, ROLES.ALUMNI);
};

export const registerAlumni = async (req, res) => {
  try {
    const newAlumni = await createAlumni(req.body);
    generateTokenAndSetCookie(newAlumni.id, ROLES.ALUMNI, res);

    res.status(201).json(createResponse(
      true,
      "Alumni registered successfully",
      {
        _id: newAlumni.id,
        fullName: newAlumni.fullName,
        email: newAlumni.email,
        role: ROLES.ALUMNI
      }
    ));
  } catch (error) {
    handleError(error, req, res);
  }
}; 