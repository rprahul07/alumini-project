import { ROLES } from "../../constants/user_constants.js";
import { createUser } from "../../services/user_service.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";

export const createFaculty = async (userData) => {
  const { designation, ...baseData } = userData;
  
  return createUser({
    ...baseData,
    designation
  }, ROLES.FACULTY);
};

export const registerFaculty = async (req, res) => {
  try {
    const newFaculty = await createFaculty(req.body);
    generateTokenAndSetCookie(newFaculty.id, ROLES.FACULTY, res);

    res.status(201).json(createResponse(
      true,
      "Faculty registered successfully",
      {
        _id: newFaculty.id,
        fullName: newFaculty.fullName,
        email: newFaculty.email,
        role: ROLES.FACULTY
      }
    ));
  } catch (error) {
    handleError(error, req, res);
  }
}; 