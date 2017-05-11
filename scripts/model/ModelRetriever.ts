import IModelRetriever from "./IModelRetriever";
import * as Rx from "rx";
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

    modelFor<T>(context: ModelContext): Rx.Observable<ModelState<T>> {
        let query = this.buildQueryForContext(context);
        return this.notificationManager.notificationsFor(context)
            .selectMany(notification => this.httpClient.get(notification.url + query))
            .map(response => ModelState.Ready(<T>response.response))
            .catch(error => Rx.Observable.just(ModelState.Failed(error)))
            .startWith(<ModelState<T>>ModelState.Loading());
    }

    private buildQueryForContext(context: ViewModelContext): string {
        let parameters = this.parametersDeserializer.deserialize(context);
        let query = "";
        if (parameters) {
            query += `?${stringify(parameters)}`;
        }
        return query;
    }
}

export default ModelRetriever