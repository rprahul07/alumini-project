import express from "express";
import {
  getAllEvents,
  searchEvents,
  getRegisteredEventsController,
} from "../controllers/event/event.controller.js";

const router = express.Router();

router.get("/event/all", getAllEvents);
router.get("/event/search", searchEvents);


export default router;
