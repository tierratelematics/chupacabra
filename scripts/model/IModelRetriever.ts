import {Observable} from "rx";
import ModelContext from "./ModelContext";

interface IModelRetriever {
    modelFor<T>(context: ModelContext): Observable<T>;
}

export default IModelRetriever