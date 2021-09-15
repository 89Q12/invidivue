import * as yup from 'yup';

const UserRegisterSchema = yup.object({
	username: yup.string().required(),
	password: yup.string().min(8).max(16).required(),
	captcha: yup.string().min(1).max(16).required(),
});

const UserLoginSchema = yup.object({
	username: yup.string().required(),
	password: yup.string().min(8).max(16).required(),
});

const UserChangeNameSchema = yup.object({
	username: yup.string().required(),
});

const UserChangePasswordSchema = yup.object({
	password: yup.string().min(1).max(16).required(),
});

export { UserRegisterSchema, UserLoginSchema, UserChangePasswordSchema, UserChangeNameSchema };
