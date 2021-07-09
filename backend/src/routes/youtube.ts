import { Router } from 'express';
import controller from '../controllers/youtubeController';
import validation from '../middleware/validation';
import * as passport from 'passport';
const router = Router();
// routes for get_video, get_channel etc go here
router.get('watch/:vidID', controller.getVideoById)
export { router };
