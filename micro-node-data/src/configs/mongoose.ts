import { connect, connection, ConnectionStates } from "mongoose";
import { MONGO_DB, MONGO_URI } from "./Envs";

export function mongooseConnect() {
    return connect(MONGO_URI, {
        dbName: MONGO_DB, authSource: MONGO_DB
    })
}


export function getDbState() {
    return Object.values(ConnectionStates)[connection.readyState] as string;
}
