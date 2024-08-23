// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ResultsConsumer is FunctionsClient {
  using FunctionsRequest for FunctionsRequest.Request;

  uint32 private constant GAS_LIMIT = 300000;

  string private source;

  bytes private secrets;

  uint64 private subscriptionId;

  bytes32 public donId;

  mapping(bytes32 => PendingRequest) private pending;

  // STRUCTS

  struct PendingRequest {
    uint256 sportId;
    uint256 externalId;
  }

  // EVENTS

  event RequestedResult(uint256 sportId, uint256 externalId, bytes32 requestId);
  event ResultReceived(bytes32 requestId, bytes response);
  event NoPendingRequest();
  event RequestFailed(bytes response);

  // CONSTRUCTOR

  constructor(
    address _oracle,
    bytes32 _donId,
    uint64 _subscriptionId,
    string memory _source,
    bytes memory _secrets
  ) FunctionsClient(_oracle) {
    donId = _donId;
    subscriptionId = _subscriptionId;
    source = _source;
    secrets = _secrets;
  }

  // INTERNAL

  function _requestResult(uint256 sportId, uint256 externalId) internal returns (bytes32 requestId) {

    string[] memory args = new string[](2);
    args[0] = Strings.toString(sportId);
    args[1] = Strings.toString(externalId);
 
    requestId = _executeRequest(args);

    pending[requestId] = PendingRequest({sportId: sportId, externalId: externalId});
    emit RequestedResult(sportId, externalId, requestId);
  }


  function _executeRequest(string[] memory args) internal returns (bytes32 requestId) {
    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
    if (secrets.length > 0) {
      req.addSecretsReference(secrets);
    }
    if (args.length > 0) req.setArgs(args);
    requestId = _sendRequest(req.encodeCBOR(), subscriptionId, GAS_LIMIT, donId);
  }


  function _processResult(uint256 sportId, uint256 externalId, bytes memory response) internal virtual;

  // CHAINLINK FUNCTIONS

  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    PendingRequest memory request = pending[requestId];

    if (request.sportId == 0) {
      emit NoPendingRequest();
      return;
    }
    delete pending[requestId];

    if (err.length > 0) {
      emit RequestFailed(err);
      return;
    }
    emit ResultReceived(requestId, response);

    _processResult(request.sportId, request.externalId, response);
  }
}
