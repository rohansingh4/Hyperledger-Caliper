# hyperledger-calipher

Network set up will 

5 organizations 
3 peer nodes
At least 2 endorsing peers per Organization 
Test for 5 million transactions per day by adding 100K nodes batch per round.
The smart contact should do basic validation of the input fields of the ticket

And additional validation like duplicate tickets ID



Json structure as discussed yesterday
regards
Kapil

POST API {/traveler/ticket}: We created POST API to create traveler ticket
in blockchain and it is generated json response as below.
{
   "id": "string",
   "trip_id": "string",
   "status": "string",
   "revenue": 0,
   "rapid": 0,
   "cm": 0,
   "bus": 0,
   "refund": 0,
   "check_in": "string",
   "check_out": "string",
   "traveller_id": "string"
}

PUT API {/traveler/ticket/{id}}: We created PUT API to update existing
traveler ticket on the behalf of id and it is generated json response as
below.
{
   "id": "string",
   "trip_id": "string",
   "status": "string",
   "revenue": 0,
   "rapid": 0,
   "cm": 0,
   "bus": 0,
   "refund": 0,
   "check_in": "string",
   "check_out": "string",
   "traveller_id": "string"
}



Installing Caliper - https://hyperledger.github.io/caliper/v0.4.2/installing-caliper/





WORD DOCUMENT -


		Caliper Hyperledger Performance Test Run Steps

Create Network Config file with the desired configs:
name: Fabric
version: "1.0"

mutual-tls: false

caliper:
  blockchain: fabric
  command:
    start: docker-compose -f network/fabric-v1.1/2org2peergoleveldb/docker-compose-tls.yaml up -d;sleep 3s
    end: docker-compose -f network/fabric-v1.1/2org2peergoleveldb/docker-compose-tls.yaml down;docker rm $(docker ps -aq);docker rmi $(docker images dev* -q)

info:
  Version: 1.1.0
  Size: 2 Orgs with 2 Peers
  Orderer: Solo
  Distribution: Single Host
  StateDB: GoLevelDB

clients:
  client0.org1.example.com:
    client:
      organization: Org1
      credentialStore:
        path: "/tmp/hfc-kvs/org1"
        cryptoStore:
          path: "/tmp/hfc-cvs/org1"
      clientPrivateKey:
        path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/key.pem
      clientSignedCert:
        path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem
  client0.org2.example.com:
    client:
      organization: Org2
      credentialStore:
        path: "/tmp/hfc-kvs/org2"
        cryptoStore:
          path: "/tmp/hfc-cvs/org2"
      clientPrivateKey:
        path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/key.pem
      clientSignedCert:
        path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/User1@org2.example.com-cert.pem
  client1.org2.example.com:
    client:
      organization: Org2
      affiliation: org2.department1
      role: client
      credentialStore:
        path: "/tmp/hfc-kvs/org2"
        cryptoStore:
          path: "/tmp/hfc-cvs/org2"

channels:
  mychannel:
    configBinary: network/fabric-v1.1/config/mychannel.tx
    created: false
    orderers:
    - orderer.example.com
    peers:
      peer0.org1.example.com:
        endorsingPeer: true
        chaincodeQuery: true
        ledgerQuery: true
        eventSource: true
      peer1.org1.example.com:
      peer0.org2.example.com:
      peer1.org2.example.com:

    chaincodes:
    - id: marbles
      version: v0
      targetPeers:
      - peer0.org1.example.com
      - peer1.org1.example.com
      - peer0.org2.example.com
      - peer1.org2.example.com
      language: node
      path: src/marbles/node
      metadataPath: src/marbles/node/metadata
      init: []
      function: init
      
      initTransientMap:
        pemContent: |
          -----BEGIN PRIVATE KEY-----
          MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgQDk37WuVcnQUjE3U
          NTW7PpPfcp54q/KBKNrtFXjAtUChRANCAAQ0xnSUxoocDsb2YIrmtFIKZ4XAiwqu
          V0BCfsl+ByVKUUdXypNrluQfm28AxX7sEDQLKtHVmuMi/BGaKahZ6Snk
          -----END PRIVATE KEY-----
        stringArg: this is also passed as a byte array
        
      endorsement-policy:
        identities:
        - role:
            name: member
            mspId: Org1MSP
        - role:
            name: member
            mspId: Org2MSP
        policy:
          2-of:
          - signed-by: 0
          - signed-by: 1

organizations:
  Org1:
    mspid: Org1MSP
    peers:
    - peer0.org1.example.com
    - peer1.org1.example.com
    certificateAuthorities:
    - ca.org1.example.com
    adminPrivateKey:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/key.pem
    signedCert:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem

  Org2:
    mspid: Org2MSP
    peers:
    - peer0.org2.example.com
    - peer1.org2.example.com
    certificateAuthorities:
    - ca.org2.example.com
    adminPrivateKey:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/key.pem
    signedCert:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem

orderers:
  orderer.example.com:
    url: grpcs://localhost:7050
    grpcOptions:
      ssl-target-name-override: orderer.example.com
      grpc-max-send-message-length: 15
    tlsCACerts:
      path: network/fabric-v1.1/config/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

peers:
  peer0.org1.example.com:
    url: grpcs://localhost:7051
    grpcOptions:
      ssl-target-name-override: peer0.org1.example.com
      grpc.keepalive_time_ms: 600000
    tlsCACerts:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/tlscacerts/tlsca.org1.example.com-cert.pem

  peer1.org1.example.com:
    url: grpcs://localhost:7057
    grpcOptions:
      ssl-target-name-override: peer1.org1.example.com
      grpc.keepalive_time_ms: 600000
    tlsCACerts:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp/tlscacerts/tlsca.org1.example.com-cert.pem

  peer0.org2.example.com:
    url: grpcs://localhost:8051
    grpcOptions:
      ssl-target-name-override: peer0.org2.example.com
      grpc.keepalive_time_ms: 600000
    tlsCACerts:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/msp/tlscacerts/tlsca.org2.example.com-cert.pem

  peer1.org2.example.com:
    url: grpcs://localhost:8057
    grpcOptions:
      ssl-target-name-override: peer1.org2.example.com
      grpc.keepalive_time_ms: 600000
    tlsCACerts:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/msp/tlscacerts/tlsca.org2.example.com-cert.pem

certificateAuthorities:
  ca.org1.example.com:
    url: https://localhost:7054
    httpOptions:
      verify: false
    tlsCACerts:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
    registrar:
    - enrollId: admin
      enrollSecret: adminpw

  ca.org2.example.com:
    url: https://localhost:8054
    httpOptions:
      verify: false
    tlsCACerts:
      path: network/fabric-v1.1/config/crypto-config/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
    registrar:
    - enrollId: admin
      enrollSecret: adminpw
2.Create Test  Callback File to interact with deployed contracts
3. Create benchmark config file
test:
    name: my-asset-benchmark
    description: test benchmark
    workers:
      type: local
      number: 2
    rounds:
      - label: queryAsset
        description: Query asset benchmark
        chaincodeId: fabcar
        txDuration: 30
        rateControl: 
          type: fixed-backlog
          opts:
            unfinished_per_client: 2
        callback: benchmarks/callbacks/queryAssetBenchmarks.js
        arguments:
          assets: 10
  
monitor:
  type:
  - none
  
observer:
  type: local
  interval: 5

4. Run command:
caliper launch master --caliper-benchconfig benchmarks/myAssetBenchmark.yaml --caliper-networkconfig networks/network_config.json --caliper-workspace ./ --caliper-flow-only-test --caliper-fabric-gateway-usegateway --caliper-fabric-gateway-discovery

5. Deploy Chaincode SACC
/network.sh up deployCC -ccn mycc -ccp ../chaincode/sacc
6. Test Chaincode
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile $ORDERER_CA -C mychannel -n mycc --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"Args":["set","name","Alice"]}'
peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}'
7. docker-compose -f docker/docker-compose-peer1org1.yaml up -d
8. Check channels
peer channel list
CORE_PEER_ADDRESS=localhost:8051 peer channel list
9. Installing chaincode to peer
peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}'
CORE_PEER_ADDRESS=localhost:8051 peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}'
10.
export CHANNEL_NAME=mychannel

rm -rf $(ls | grep -E "^fabric-client-kv*")

echo "========== Creating Channel=========="
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer channel create -o orderer.example.com:7050 \
    -c mychannel -f /etc/hyperledger/channel/mychannel.tx --tls \
    --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
    cli peer channel join -b mychannel.block

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    peer1.org1.example.com peer channel fetch newest mychannel.block \
    -c mychannel --orderer orderer.example.com:7050 --tls \
    --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    peer1.org1.example.com peer channel join -b mychannel.block

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    peer0.org2.example.com peer channel fetch newest mychannel.block -c mychannel \
    --orderer orderer.example.com:7050 --tls \
    --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    peer0.org2.example.com peer channel join -b mychannel.block

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    peer1.org2.example.com peer channel fetch newest mychannel.block -c mychannel \
    --orderer orderer.example.com:7050 --tls \
    --cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    peer1.org2.example.com peer channel join -b mychannel.block

# echo "========== Channel Creation completed =========="
