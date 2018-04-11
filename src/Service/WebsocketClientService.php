<?php

namespace App\Service;

use WebSocket\Client;

class WebsocketClientService extends BaseService
{
    /**
     * @var Client
     */
    private $client;

    public function __construct(Client $websocketClient)
    {
        $this->client = $websocketClient;
    }

    public function send($message)
    {
        $this->client->send($message);
    }

    public function __destruct()
    {
        $this->client->close();
    }
}
