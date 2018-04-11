<?php

namespace App\Repository;

use App\Entity\Trade;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Trade|null find($id, $lockMode = null, $lockVersion = null)
 * @method Trade|null findOneBy(array $criteria, array $orderBy = null)
 * @method Trade[]    findAll()
 * @method Trade[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TradeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Trade::class);
    }

    public function findSymbolStatusData()
    {
        $statement = $this->getEntityManager()->getConnection()->prepare('
            SELECT 
                count(1) as tradeCount, 
                AVG(price) as price,
                SUM(volume) * AVG(price) as volume,
                SUM(percent_change) as percentChange,
                symbol,
                exchange
            FROM trade 
            WHERE trade.time > :timeOffset
            GROUP by trade.symbol, trade.exchange
        ');
        $timeOffset = (new \DateTime('-1 hour'))->format('Y-m-d H:i:s');
        $statement->bindParam(':timeOffset', $timeOffset);
        $statement->execute();

        return $statement->fetchAll();
    }
}
