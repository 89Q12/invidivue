import {Any, createConnection, EntitySchema, EntityTarget, FindConditions, In, Repository} from "typeorm";


const connection = createConnection();

async function findOne(entity:EntitySchema, filter: any) {
    return (await get_conn(entity)).findOne(filter).catch((err: any) => {return err})
}
async function findOneDelete(entity:EntitySchema, filter: any) {
    const conn = await get_conn(entity);
    try {
        const obj = await conn.findOne(filter);
        await conn.delete(obj)
    } catch (error) {
        return error;
    }
}







async function get_conn(entity:EntitySchema): Promise<Repository<any>> {
    return (await connection).manager.getRepository(entity)
}


export default{
    findOne,
    findOneDelete,
    get_conn,
}