import { Router } from 'express';
import controller from '../controllers/userController';
import validation from '../middleware/validation';
import passport from 'passport';
import { UserRegisterSchema, UserLoginSchema, UserChangeNameSchema, UserChangePasswordSchema } from '../interfaces/yupValidiationModels';
const router = Router();
// User routes go here
router.post('/register', validation(UserRegisterSchema), controller.register);
router.post('/login', validation(UserLoginSchema), controller.login);
router.post('/refreshtoken', controller.refreshToken);
router.post('/logout', passport.authenticate('jwt', { session: false }), controller.logout);
router.get('/allusers', passport.authenticate('jwt', { session: false }), controller.allUsers);
router.get('/getuser', passport.authenticate('jwt', { session: false }), controller.getUser);
router.post('/changeName/:userId', passport.authenticate('jwt', { session: false }), validation(UserChangeNameSchema), controller.changeName);
router.post(
	'/changePassword/:userId',
	passport.authenticate('jwt', { session: false }),
	validation(UserChangePasswordSchema),
	controller.changePassword,
);
router.get('/getcaptcha',controller.getcaptcha)
export { router };
