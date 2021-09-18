import { hash } from 'bcrypt';
import {createConnection, Repository } from 'typeorm';
import {Group} from '../entity/Group'
import { User } from '../entity/User';
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
async function setUp(){
	const group_admin = await creategroupifnotexists("admin");
	const group_user = await creategroupifnotexists("user");
	const username = process.env.SERVER_ADMIN_NAME;
	const name = await findOne(User, {name:username});
	if(name){
        return;
	}else{
		console.log("adding admin");
		const user = new User();
		user.name=process.env.SERVER_ADMIN_NAME;
		user.password= await hash(process.env.SERVER_ADMIN_PASSWORD,1);
		user.groups=[group_admin,group_user];
		user.token="";
		await save(User,user);
	}
}
async function creategroupifnotexists(groupname:string):Promise<Group> {
    const admingroup = await findOne(Group,{name:groupname});
    if(admingroup){
        return admingroup;
    }else{
        const group = new Group();
        group.name=groupname;
        save(Group,group);
        return group;
    }
};
export default {
	findOne,
	findOneDelete,
	save,
    get_repo,
    setUp,
};
