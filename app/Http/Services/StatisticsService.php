<?php

namespace App\Http\Services;

use Illuminate\Support\Carbon;

class StatisticsService
{

    // Data if the website ID is given
    public function processStatistics(
        $websiteId,
        $resData,
        $startTime = null,
        $endTime = null
    ) {

        $chatSum = 0;
        $missedChatSum = 0;
        if ($startTime && $endTime) {

            foreach ($resData as $item) {


                $itemStartDate = Carbon::date($item->date)->timestamp();
                $itemEndDate = Carbon::date($item->date)->timestamp();
                $startTime = Carbon::date($startTime)->timestamp();
                $endTime = Carbon::date($endTime)->timestamp();
                if ($startTime > $itemStartDate && $endTime < $itemEndDate) {
                    $chatSum =  $chatSum + $item->chats;
                    $missedChatSum =  $missedChatSum + $item->missedChats;
                }
            };

            return [
                "websiteId" => $websiteId,
                "chats" => $chatSum,
                "missedChats" => $missedChatSum,
            ];
        } else {
            foreach ($resData as $item) {
                $chatSum += $item->chats;
                $missedChatSum += $item->missedChats;
            };

            return [
                "websiteId" => $websiteId,
                "chats" => $chatSum,
                "missedChats" => $missedChatSum,
            ];
        }
    }


    // Data if the website not given
    public function processStatisticsWithOutWebsiteId(
        $newArr,
        $newdata,
        $startTime = null,
        $endTime = null
    ) {
        if ($startTime && $endTime) {
            $emptyArr = [];
            if ($newArr) {
                foreach ($newArr as $item) {

                    $chats = 0;
                    $missedChats = 0;
                    foreach ($newdata as $dataItem) {

                        if ($dataItem->websiteId === $item) {
                            $itemStartDateNew = Carbon::date($item->date)->timestamp();
                            $itemEndDateNew =  Carbon::date($item->date)->timestamp();
                            $startTime = Carbon::date($startTime)->timestamp();
                            $endTime = Carbon::date($endTime)->timestamp();
                            if (
                                $startTime  > $itemStartDateNew &&
                                $endTime < $itemEndDateNew
                            ) {
                                $chats += $dataItem->chats;
                                $missedChats += $dataItem->missedChats;
                            }
                        }
                    };
                    array_push($emptyArr, [
                        "websiteId" => $item,
                        "chats" => $chats,
                        "missedChats" => $missedChats
                    ]);
                };
            }

            return $emptyArr;
        } else {
            $emptyArr = [];
            if ($newArr) {
                foreach ($newArr as $item) {


                    $chats = 0;
                    $missedChats = 0;

                    foreach ($newdata as $dataItem) {

                        if ($dataItem->websiteId === $item) {
                            $chats += $dataItem->chats;
                            $missedChats += $dataItem->missedChats;
                        }
                    }

                    array_push($emptyArr, [
                        "websiteId" => $item,
                        "chats" => $chats,
                        "missedChats" => $missedChats,
                    ]);
                }
            }
        }
        return $emptyArr;
    }
}
