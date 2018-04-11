<?php

namespace App\Service;

use App\Entity\Trade;
use OldSound\RabbitMqBundle\RabbitMq\ConsumerInterface;
use PhpAmqpLib\Message\AMQPMessage;
use Symfony\Component\Cache\Adapter\AdapterInterface;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\Cache\Simple\RedisCache;

class TradesListenerService extends BaseService implements ConsumerInterface
{
    /**
     * @var WebsocketClientService
     */
    private $clientService;

    /**
     * @var string
     */
    private $pushSecret;
    /**
     * @var AdapterInterface
     */
    private $cache;

    public function __construct(
        WebsocketClientService $clientService,
        string $pushSecret,
        AdapterInterface $cache
    )
    {
        $this->clientService = $clientService;
        $this->pushSecret = $pushSecret;
        $this->cache = $cache;
    }

    public function execute(AMQPMessage $msg)
    {
        $broadcastMessage = json_decode($msg->getBody(), true);
        $broadcastMessage['push_secret'] = $this->pushSecret;
        $trade = new Trade();
        $trade->setPrice($broadcastMessage['price']);
        $trade->setSymbol($broadcastMessage['symbol']);
        $trade->setExchange($broadcastMessage['exchange']);
        $trade->setVolume($broadcastMessage['volume']);
        $trade->setTime(new \DateTime());

        $lastPrice = $this->cache->getItem($trade->getSymbol() . $trade->getExchange());

        if ($lastPrice->isHit()) {
            $trade->setPercentChange((($trade->getPrice() / $lastPrice->get()) - 1) * 100);
        }

        $lastPrice->set($trade->getPrice());
        $this->cache->save($lastPrice);

        $this->em->persist($trade);
        $this->em->flush();
        $this->clientService->send(json_encode($broadcastMessage));
    }
}
