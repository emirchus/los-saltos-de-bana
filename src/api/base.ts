import { Axios } from 'axios';

export interface BaseResponse {}

export default class BaseResource {
  constructor(public client: Axios) {}
}
