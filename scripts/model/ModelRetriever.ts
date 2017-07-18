import IModelRetriever from "./IModelRetriever";
import {Observable} from "rx";
import INotificationManager from "../notifications/INotificationManager";
import {IParametersDeserializer, NullParametersDeserializer} from "./ParametersDeserializer";
import {stringify} from "qs";
import ModelContext from "./ModelContext";
import IHttpClient from "../net/IHttpClient";

class ModelRetriever implements IModelRetriever {

    constructor(private httpClient: IHttpClient,
                private notificationManager: INotificationManager,
                private parametersDeserializer: IParametersDeserializer = new NullParametersDeserializer()) {

    }

    modelFor<T>(context: ModelContext): Observable<T> {
        return this.notificationManager.notificationsFor(context)
            .selectMany(notification => this.httpClient.get(notification.url + this.buildQueryForContext(context, notification.notificationKey)))
            .map(response => <T>response.response);
    }

    private buildQueryForContext(context: ModelContext, notificationKey: string): string {
        let parameters: any = this.parametersDeserializer.deserialize(context) || {};
        parameters.modelKey = notificationKey;
        return `?${stringify(parameters)}`;
    }
}

export default ModelRetriever
