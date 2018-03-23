<?php

namespace App\Service;

use OldSound\RabbitMqBundle\RabbitMq\ConsumerInterface;
use PhpAmqpLib\Message\AMQPMessage;

class TradesListenerService extends BaseService implements ConsumerInterface
{
    /**
     * @var WebsocketClientService
     */
    private $clientService;

    /**
     * @var
     */
    private $pushSecret;

    public function __construct(
        WebsocketClientService $clientService,
        $pushSecret
    )
    {
        $this->clientService = $clientService;
        $this->pushSecret = $pushSecret;
    }

    public function execute(AMQPMessage $msg)
    {
        $broadcastMessage = json_decode($msg->getBody(), true);
        $broadcastMessage['push_secret'] = $this->pushSecret;
        $this->clientService->send(json_encode($broadcastMessage));
    }
}
