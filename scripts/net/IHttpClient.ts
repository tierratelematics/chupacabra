import {Observable} from "rx";
import HttpResponse from "./HttpResponse";
import Dictionary from "../util/Dictionary";

interface IHttpClient {
    get(url: string, headers?: Dictionary<string>): Observable<HttpResponse>
}

export default IHttpClient
