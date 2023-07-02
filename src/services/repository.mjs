import { MongoClient, ObjectId } from "mongodb";

export const COLLECTIONS = {
  REGISTERED_USERS: "registered-users",
  TEST: "test",
  PAYMENTS: "payments",
};

const repository = {
  client: undefined,
  db: undefined,

  async init() {
    const url = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    const options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };

    let client;

    if (!global._mongoClientPromise) {
      client = new MongoClient(url, options);
      global._mongoClientPromise = client.connect();
    }
    repository.clientPromise = global._mongoClientPromise;
    repository.db = (await repository.clientPromise).db(dbName);
  },

  async getDB() {
    await repository.init();
    return repository.db;
  },

  async getClientPromise() {
    await repository.init();
    return repository.clientPromise;
  },

  getObjectId(id = null) {
    return id ? new ObjectId(id) : new ObjectId();
  },

  async saveDoc(collection, data, pushData, actorId = null) {
    const db = await repository.getDB();
    const objectToSave = {
      ...data,
      _id: data._id
        ? repository.getObjectId(data._id).toString()
        : repository.getObjectId().toString(),
    };

    if (data._id) {
      objectToSave.editDate = new Date();
      objectToSave.editBy = actorId;
    } else {
      objectToSave.createDate = new Date();
      objectToSave.createdBy = actorId;
    }

    const setObject = { $set: objectToSave };
    if (pushData) {
      setObject["$push"] = pushData;
    }

    const doc = await db
      .collection(collection)
      .findOneAndUpdate({ _id: objectToSave._id }, setObject, {
        upsert: true,
        returnDocument: "after",
      });

    return doc.value || objectToSave;
  },

  async updateDoc(collection, id, updateData, pushData) {
    const db = await repository.getDB();

    const doc = await db.collection(collection).updateOne(
      { _id: id },
      { $set: { ...updateData }, $push: { ...pushData } }
      // { upsert: true, returnDocument: "after" }
    );

    console.log(">>> saved", doc);
    return doc.value;
  },

  async findOneDoc(collection, filter) {
    const db = await repository.getDB();
    const result = await db.collection(collection).findOne(filter);
    return result;
  },
  async findManyDoc(collection, filter, sort = {}, skip = 0, limit = 1000) {
    const db = await repository.getDB();
    const result = await db
      .collection(collection)
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    return result;
  },

  async aggregateQuery(collection, query) {
    const db = await repository.getDB();

    const aggregated = await db
      .collection(collection)
      .aggregate(query)
      .toArray();
    return aggregated;
  },

  async insertManyDocs(collection, docs) {
    const db = await repository.getDB();
    const result = await db.collection(collection).insertMany(docs);
    return result;
  },

  async deleteOneDoc(collection, filter) {
    const db = await repository.getDB();
    const result = await db.collection(collection).deleteOne(filter);
    return result;
  },

  async bulkWrite(collection, query) {
    const db = await repository.getDB();
    return db.collection(collection).bulkWrite(query);
  },
};

export default repository;
