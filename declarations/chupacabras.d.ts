import {Observable} from "rx";

export class ModelContext {
    area: string;
    modelId: string;
    parameters?: object;

    constructor(area: string, modelId: string, parameters?: object);
}

export interface IModelRetriever {
    modelFor<T>(context: ModelContext): Observable<T>;
}

export class ModelRetriever implements IModelRetriever {
    modelFor<T>(context: ModelContext): Observable<T>;
}

export interface INotificationManager {
    notificationsFor(context: ModelContext): Observable<Notification>;
}

export class NotificationManager implements INotificationManager {

    constructor(client: SocketIOClient.Socket);

    notificationsFor(context: ModelContext): Observable<Notification>;
}

interface Notification {
    url: string
}

export interface IParametersDeserializer {
    deserialize(context: ModelContext): {};
}