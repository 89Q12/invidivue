import { Router } from 'express';
import controller from '../controllers/youtubeController';
import validation from '../middleware/validation';
import * as passport from 'passport';
const router = Router();
// routes for get_video, get_channel etc go here
router.get('/watch', controller.getVideoById)
router.get('/w', controller.getVideoById)
router.get('/results', controller.getResults)
router.get('/r', controller.getResults)
router.get('/channel/:cId', controller.getChannel)
router.get('/c/:cId', controller.getChannel)
router.get('/subscribe', controller.subscribe)

export { router };
