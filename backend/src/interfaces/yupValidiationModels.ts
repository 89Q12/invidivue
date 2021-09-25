import {string, object, number} from 'yup';

const UserRegisterSchema = object({
	username: string().required(),
	password: string().min(8).max(16).required(),
	captchatext: string().min(1).max(16).required(),
	captchaid: number().required(),
});

const UserLoginSchema = object({
	username: string().required(),
	password: string().min(8).max(16).required(),
});

const UserChangeNameSchema = object({
	username: string().required(),
});

const UserChangePasswordSchema = object({
	password: string().required(),
});

export { UserRegisterSchema, UserLoginSchema, UserChangePasswordSchema, UserChangeNameSchema };
