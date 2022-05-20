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
    let resDataDateFilterd = [];
    let resData = [];
    let resdataNew = [];

    const startDate = new Date(2019, 3, 1);
    const endDate = new Date(2024, 2, 1);

    // const startDate = null;
    // const endDate = null;

    // If Website ID given

    function processStatistics(resData, startTime = null, endTime = null) {
        let chatSum = 0;
        let missedChatSum = 0;
        if (startTime && endTime) {
            resData.forEach((item) => {
                let itemStartDate = new Date(item.date).getTime();
                let itemEndDate = new Date(item.date).getTime();
                if (startTime.getTime() > itemStartDate && endTime < itemEndDate) {
                    chatSum += Number(item.chats);
                    missedChatSum += Number(item.missedChats);
                }
            });

            return {
                websiteId: websiteId,
                chats: chatSum,
                missedChats: missedChatSum,
            };
        } else {
            resData.forEach((item) => {
                chatSum += Number(item.chats);
                missedChatSum += Number(item.missedChats);
            });

            return {
                websiteId: websiteId,
                chats: chatSum,
                missedChats: missedChatSum,
            };
        }
    }

    function processStatisticsWithOutWebsiteId(
        newArr,
        newdata,
        startTime = null,
        endTime = null
    ) {
        if (startTime && endTime) {
            let emptyArr = [];
            if (newArr) {
                newArr.forEach((item) => {
                    let chats = 0;
                    let missedChats = 0;

                    newdata.forEach((dataItem) => {
                        if (dataItem.websiteId === item) {
                            let itemStartDateNew = new Date(item.date).getTime();
                            let itemEndDateNew = new Date(item.date).getTime();

                            if (
                                startTime.getTime() > itemStartDateNew &&
                                endTime < itemEndDateNew
                            ) {
                                chats += Number(dataItem.chats);
                                missedChats += Number(dataItem.missedChats);
                            }
                        }
                    });
                    emptyArr.push({
                        websiteId: item,
                        chats: chats,
                        missedChats: missedChats,
                    });
                });
            }

            return emptyArr;
        } else {
            let emptyArr = [];
            if (newArr) {
                newArr.forEach((item) => {
                    let chats = 0;
                    let missedChats = 0;

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
        }
        return emptyArr;
    }

    if (websiteId) {
        newdata.forEach((item) => {
            if (item.websiteId === websiteId) {
                resData.push(item);
            }
        });

        let responseData = processStatistics(resData);

        if (responseData) {
            return res.send(responseData);
        }

        return res.status(200).json({ msg: "Nothing Found" });
    }

    // If Website Id not given

    if (!websiteId) {
        newdata.forEach((item) => {
            resdataNew.push(item.websiteId);
        });

        let newArr = [...new Set(resdataNew)];

        let newResponseData = processStatisticsWithOutWebsiteId(newArr, newdata);

        return res.send(newResponseData);
    }
});