import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    createBookmarkForAlumni,
    getBookmarksForUser,
    deleteBookmarkForAlumni,
    getAllBookmarks
} from "../controllers/bookmark/bookmark_controller.js";

   
const router = express.Router();
router.use(protect);
router.post("/bookmark/create/:alumniId", createBookmarkForAlumni);
router.get("/bookmark/get", getBookmarksForUser);
router.delete("/bookmark/delete/:alumniId", deleteBookmarkForAlumni);
router.get("/bookmark/all", getAllBookmarks);
export default router;