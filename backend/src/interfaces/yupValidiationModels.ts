import * as yup from 'yup';

const UserRegisterSchema = yup.object({
	username: yup.string().required(),
	password: yup.string().min(8).max(16).required(),
	captchatext: yup.string().min(1).max(16).required(),
	captchaid: yup.number().required(),
});

const UserLoginSchema = yup.object({
	username: yup.string().required(),
	password: yup.string().min(8).max(16).required(),
});

const UserChangeNameSchema = yup.object({
	username: yup.string().required(),
});

const UserChangePasswordSchema = yup.object({
	password: yup.string().required(),
});

export { UserRegisterSchema, UserLoginSchema, UserChangePasswordSchema, UserChangeNameSchema };
