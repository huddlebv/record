import { AxiosResponse } from "axios";

export default interface ApiResponse<T> {
    response: AxiosResponse;
    instances: T[];
}