import {Observable} from "rx";
import ModelContext from "./ModelContext";

interface IModelRetriever {
    modelFor<T>(context: ModelContext, notificationKey?: string): Observable<T>;
}

export default IModelRetriever
