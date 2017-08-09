import {Observable} from "rx";

export class ModelContext {
    area: string;
    modelId: string;
    parameters?: object;

    constructor(area: string, modelId: string, parameters?: object);
}

export interface IModelRetriever {
    modelFor<T>(context: ModelContext, notificationKey?: string): Observable<T>;
}

export class ModelRetriever implements IModelRetriever {

    constructor(httpClient: IHttpClient, notificationManager: INotificationManager);

    modelFor<T>(context: ModelContext, notificationKey?: string): Observable<T>;
}

export interface INotificationManager {
    notificationsFor(context: ModelContext, notificationKey?: string): Observable<Notification>;
}

export class NotificationManager implements INotificationManager {

    constructor(client: SocketIOClient.Socket);

    notificationsFor(context: ModelContext, notificationKey?: string): Observable<Notification>;
}

interface Notification {
    url: string;
    notificationKey: string;
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

export class ContextOperations {
    static keyFor(context: ModelContext, notificationKey?: string): string;
}
