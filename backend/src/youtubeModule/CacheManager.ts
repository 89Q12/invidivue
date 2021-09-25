import { EntityTarget, Connection, createConnection, Repository, SaveOptions, RemoveOptions, FindOneOptions, getConnection } from 'typeorm';

export class Cache {
	private connection: Connection | Promise<Connection>;
	private expireAfter: Number;
	private setUpFuncs: Array<Promise<Function>>;
    /**
     * 
     * @param seutUpFuncs An array of functions that should run after connecting to the db, every function will have this class as this
     * @param expireAfter Amount of seconds after an entrie should invalidated and deleted
     */
	constructor(seutUpFuncs: Array<Promise<Function>> = undefined, expireAfter: Number = 36000) {
		if (typeof seutUpFuncs != 'undefined') this.setUpFuncs.concat(seutUpFuncs);
		this.expireAfter = expireAfter;
		this.dbConnectionSetUp();
	}
	public async addToCache(target: EntityTarget<any>, entity: any, options?: SaveOptions): Promise<any> {
		return await (await this.get_repo(target)).save(entity, options);
	}
	public async removeFromCache(target: EntityTarget<any>, id: Number): Promise<any> {
		return await (await this.get_repo(target)).remove(id);
	}
    /**
     * 
     * @param target The entity class that should be used to check wether it is in the db or not
     * @param filter Filter options e.g. video id
     * @param options should be an object of typ FindOneOptions<any>
     * @returns The db entry in question or returns false
     */
	public async isInCache(target: EntityTarget<any>, filter: any, options?: FindOneOptions<any>): Promise<any> {
		const repo = await this.get_repo(target);
		const answer = await repo.findOne(filter, options);
		if (answer) {
			if (answer.lastloaded) {
				if (new Date().getTime() - answer.lastloaded.getTime() < this.expireAfter) {
					return answer.cache;
				} else {
					this.removeFromCache(target, answer.id);
					return false;
				}
			}
		}
		return false;
	}
	private async dbConnectionSetUp() {
		try {
			this.connection = getConnection();
		} catch (error) {
			this.connection = createConnection();
		}
		await (await this.connection).synchronize();
	}
	private async get_repo(entity: any): Promise<Repository<any>> {
		const conn = await this.connection;
		return conn.manager.getRepository(entity);
	}
    private async runSetUpFuncs(){
        for await (const func of this.setUpFuncs) {
            func.call(this)
        }
    }
}
