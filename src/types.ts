export type APIResponse = {
  statusCode: number
  body: string
  headers?: {
    [header: string]: boolean | number | string
  }
}
