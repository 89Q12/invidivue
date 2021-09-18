import { Any, createConnection, EntitySchema, EntityTarget, FindConditions, In, Repository } from 'typeorm';

const connection = createConnection();

async function findOne(entity: any, filter: any) {
	const conn = await get_repo(entity);
	try {
		return conn.findOne(filter);
	} catch (error) {
		return error;
	}
}
async function findOneDelete(entity: any, filter: any) {
	const conn = await get_repo(entity);
	try {
		const obj = await conn.findOne(filter);
		await conn.delete(obj);
	} catch (error) {
		return error;
	}
}
async function save(entity: any, updatedEntity: any) {
	return (await get_repo(entity)).save(updatedEntity).catch((err: any) => {
		return err;
	});
}

async function get_repo(entity: any): Promise<Repository<any>> {
    const conn = await connection;
    return conn.manager.getRepository(entity);
}

export default {
	findOne,
	findOneDelete,
	save,
    get_repo,
};
