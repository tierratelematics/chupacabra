import "isomorphic-fetch";
import IHttpClient from "./IHttpClient";
import {Observable} from "rx";
import HttpResponse from "./HttpResponse";
import Dictionary from "../util/Dictionary";

class HttpClient implements IHttpClient {

    get(url: string, headers?: Dictionary<string>): Observable<HttpResponse> {
        return this.performNetworkCall(url, 'get', undefined, headers);
    }

    private performNetworkCall(url: string, method: string, body?: any, headers?: Dictionary<string>): Observable<HttpResponse> {
        let promise = window.fetch(url, {
            method: method,
            body: body,
            headers: headers
        }).then(response => {
            let headers: Dictionary<string> = {};
            response.headers.forEach((value, name) => {
                headers[name.toString().toLowerCase()] = value;
            });
            return response.text().then(text => {
                let contentType = headers['content-type'] || "";
                let payload = contentType.match("application/json") ? JSON.parse(text) : text;
                let httpResponse = new HttpResponse(payload, response.status, headers);

                if (response.status >= 400)
                    throw httpResponse;
                return httpResponse;
            });
        });
        return Observable.fromPromise(promise);
    }
}

export default HttpClient
