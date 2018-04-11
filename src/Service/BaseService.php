<?php

namespace App\Service;

use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;

abstract class BaseService
{
    /** @var  LoggerInterface */
    protected $logger;
    /** @var  EntityManager */
    protected $em;

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function setEntityManager(EntityManager $entityManager)
    {
        $this->em = $entityManager;
    }

    public function logInfo($message)
    {
        $className = $this->getClassNamePrefix();
        $this->logger->info($className.' '.$message);
    }

    public function logDebug($message)
    {
        $className = $this->getClassNamePrefix();
        $this->logger->debug($className.' '.$message);
    }

    public function logWarning($message)
    {
        $className = $this->getClassNamePrefix();
        $this->logger->warning($className.' '.$message);
    }

    public function logError($message)
    {
        $className = $this->getClassNamePrefix();
        $this->logger->error($className.' '.$message);
    }

    /**
     * @return string
     */
    protected function getClassNamePrefix():string
    {
        $className = get_class($this);
        $className = substr($className, strrpos($className, '\\') + 1);
        $className = strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', $className));

        return '['.$className.']';
    }
}
