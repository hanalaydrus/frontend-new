/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import {grpc} from "grpc-web-client";
import {Greeter} from "./generated/gatewayContract_pb_service";
import {HelloRequest, HelloReply} from "./generated/gatewayContract_pb";

const host = "http://35.240.195.59:8080";
// const host = "http://localhost:8080";

export function helloGRPC(input_type: string, input_camera_id: number, log: Function, concurrent: number, iteration: number) {

  console.log("id: ", input_camera_id, " cc: ", concurrent, " iter: ", iteration);

  var id_mod = input_camera_id % 10;
  var id_camera = id_mod.toString();
  var i = 0;
  var time_prev = 0;
  var data = new Array();

  const helloRequest = new HelloRequest();
  helloRequest.setType(input_type);
  helloRequest.setId(id_mod);
  
  const client = grpc.invoke(Greeter.SayHello, {
    // debug: false,// optional - enable to output events to console.log
    request: helloRequest,
    host: host,
    onHeaders: (headers: grpc.Metadata) => {
      console.log("got headers: ", headers);
    },
    onMessage: (message: HelloReply) => {
      i++;
      if (i <= 1000) {
        var reply = message.toObject();
        //console.log(reply.response);
        if (i != 1){
          var lag_length = Date.now() - time_prev;
          data.push([input_camera_id, lag_length, iteration]);
        }
        time_prev = Date.now();
        
        if (i === 1000) {
          log(input_camera_id, iteration, concurrent, data);
          closeClient();
        }
      }
    },
    onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
      console.log("onEnd", code, msg, trailers);
    }
  });

  function closeClient(){
    client.close();
  }
}
