<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Throwable;
use App\Http\Services\StatisticsService;

class TaskController extends Controller
{
    public $statisticsService;
    public function __construct()
    {
        $this->statisticsService = new StatisticsService();
    }

    // MAIN function to get all the sums.
    public function index(Request $request)
    {
        try {


            $websiteId = null;
            // $websiteId = "4f8b36d00000000000000001";
            $resData = [];
            $startTime = null;
            $endTime = null;

            $rawData = $this->getRawData();

            $rawData = json_decode($rawData);

            if ($websiteId) {
                $resData = [];
                foreach ($rawData as $item) {
                    if ($item->websiteId === $websiteId) {
                        array_push($resData, $item);
                    }
                }
                $data =  $this->statisticsService->processStatistics($websiteId, $resData, $startTime, $endTime);
                return $data;
            } else {

                $resDataNew = [];
                foreach ($rawData as $item) {
                    array_push($resDataNew, $item->websiteId);
                };

                $newArr = [...array_unique($resDataNew)];
                $data = $this->statisticsService->processStatisticsWithOutWebsiteId($newArr, $rawData, $startTime, $endTime);
                return $data;
            }
        } catch (Throwable $th) {
            throw $th;
        }
    }


    // Get Raw Data from the given URL
    private function getRawData()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return $response;
    }
}
