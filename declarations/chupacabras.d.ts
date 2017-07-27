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

    constructor(httpClient: IHttpClient, notificationManager: INotificationManager,
                parametersDeserializer: IParametersDeserializer);

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
    url: string;
    notificationKey: string;
}

export interface IParametersDeserializer {
    deserialize(context: ModelContext): object;
}

export interface IHttpClient {
    get(url: string, headers?: Dictionary<string>): Observable<HttpResponse>
}

export class HttpClient implements IHttpClient {

    get(url: string, headers?: Dictionary<string>): Observable<HttpResponse>;
}

export class HttpResponse<T> {
    response: T;
    status: number;
    headers: Dictionary<string>;
}

interface Dictionary<T> {
    [index: string]: T;
}
