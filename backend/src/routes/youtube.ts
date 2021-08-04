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
router.get('/channel/:cid', controller.getChannel)
router.get('/c/:cid', controller.getChannel)

router.get('/subscribe', passport.authenticate('jwt', { session: false }),controller.subscribe)
router.get('/unsubscribe', passport.authenticate('jwt', { session: false }),controller.unsubscribe)
router.get('/subscriptions', passport.authenticate('jwt', { session: false }),controller.getSubscriptions)
router.post('/uploadnewpipesubs', passport.authenticate('jwt', { session: false }),controller.uploadnewpipesubs)
router.get('/feed', passport.authenticate('jwt', { session: false }),controller.getFeed)

export { router };
