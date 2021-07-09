import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

const validation =
	(schema: yup.BaseSchema) =>
	async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
		try {
			await schema.validate(req.body);
			next();
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error });
		}
	};
export default validation;
