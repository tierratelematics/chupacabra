import Dictionary from "../util/Dictionary";

class HttpResponse<T> {
    response: T;
    status: number;
    headers: Dictionary<string>;

    constructor(response: T, status: number, headers?: Dictionary<string>) {
        this.response = response;
        this.status = status;
        this.headers = headers;
    }
}

export default HttpResponse