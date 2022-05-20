const express = require("express");
const axios = require("axios");
const app = express();

app.listen(5000, () => {
    console.log("app is live on http:127.0.0.1:5000");
});

app.use("/data", async(req, res, next) => {
    let data = await axios.get(
        "https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json"
    );

    const websiteId = "4f8b36d00000000000000001";

    let newdata = data.data;
    let resData = [];
    let resdataNew = [];

    // If Website ID given

    if (websiteId) {
        let chatSum = 0;
        let missedChatSum = 0;

        newdata.forEach((item) => {
            if (item.websiteId === websiteId) {
                resData.push(item);
            }
        });

        resData.forEach((item) => {
            chatSum += Number(item.chats);
            missedChatSum += Number(item.missedChats);
        });

        const resDataNew = {
            websiteId: websiteId,
            chats: chatSum,
            missedChats: missedChatSum,
        };

        return res.send(resDataNew);
    }

    // If Website Id not given

    if (!websiteId) {
        newdata.forEach((item) => {
            resdataNew.push(item.websiteId);
        });

        let newArr = [...new Set(resdataNew)];

        let emptyArr = [];

        if (newArr) {
            newArr.forEach((item) => {
                let chats = 0;
                let missedChats = 0;
                // let obj = new Object();

                newdata.forEach((dataItem) => {
                    if (dataItem.websiteId === item) {
                        chats += Number(dataItem.chats);
                        missedChats += Number(dataItem.missedChats);
                    }
                });
                emptyArr.push({
                    websiteId: item,
                    chats: chats,
                    missedChats: missedChats,
                });
            });
        }

        return res.send(emptyArr);
    }
});