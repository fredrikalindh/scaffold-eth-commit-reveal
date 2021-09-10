import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { Address, Balance, BytesStringInput } from "../components";
import { useContractReader, useBlockNumber } from "eth-hooks";

const { Text } = Typography;

export default function ExampleUI({
    commitEvents,
    revealEvents,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
}) {
    const [hashData, setHashData] = useState("");
    const [commitData, setCommitData] = useState("");
    // const [revealData, setRevealData] = useState("");
    const blockNumber = useBlockNumber(localProvider);
    console.log(blockNumber);

    // console.log(readContracts);
    useEffect(() => {
        async function getHash() {
            const hash = await readContracts?.YourContract?.getHash(hashData);
            setCommitData(hash);
        }
        getHash();
    }, [hashData]);

    // let hash = useContractReader(readContracts, "YourContract", "getHash", [hashData]);

    console.log("HASHDATA", hashData);
    // console.log("HASH", hash);
    console.log("HASH", commitData);

    return (
        <div>
            <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
                <h2>Commit/Reveal</h2>
                <Divider />
                <BytesStringInput
                    autofocus
                    value={"scaffold-eth"}
                    placeholder="Enter value..."
                    onChange={value => {
                        setHashData(value);
                    }}
                />
                <Text copyable={{ text: commitData }}>{commitData}</Text>
                <div style={{ padding: 16 }}>
                    <Button
                        onClick={() => {
                            tx(writeContracts.YourContract.commit(commitData, blockNumber + 50));
                        }}
                    >
                        Commit
                    </Button>
                </div>
                <div style={{ padding: 16 }}>
                    {/* <Input
                        onChange={async e => {
                            setCommitData(e.target.value);
                        }}
                    /> */}
                    <Button
                        onClick={() => {
                            tx(writeContracts.YourContract.reveal(hashData));
                        }}
                    >
                        Reveal
                    </Button>
                </div>
            </div>

            {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
            <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
                <h2>Events:</h2>
                <List
                    bordered
                    dataSource={commitEvents}
                    renderItem={item => {
                        return (
                            <List.Item>
                                <Address value={item.args.sender} ensProvider={mainnetProvider} fontSize={16} /> {"=>"}
                                {item.args.dataHash}
                            </List.Item>
                        );
                    }}
                />
                <List
                    bordered
                    dataSource={revealEvents}
                    renderItem={item => {
                        return (
                            <List.Item>
                                <Address value={item.args.sender} ensProvider={mainnetProvider} fontSize={16} /> {"=>"}
                                {item.args.revealHash}
                                <h4>Random number: {item.args.random}</h4>
                            </List.Item>
                        );
                    }}
                />
            </div>
        </div>
    );
}
