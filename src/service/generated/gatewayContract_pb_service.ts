// package: gatewayContract
// file: gatewayContract.proto

import * as gatewayContract_pb from "./gatewayContract_pb";
export class Greeter {
  static serviceName = "gatewayContract.Greeter";
}
export namespace Greeter {
  export class SayHello {
    static readonly methodName = "SayHello";
    static readonly service = Greeter;
    static readonly requestStream = false;
    static readonly responseStream = true;
    static readonly requestType = gatewayContract_pb.HelloRequest;
    static readonly responseType = gatewayContract_pb.HelloReply;
  }
}
