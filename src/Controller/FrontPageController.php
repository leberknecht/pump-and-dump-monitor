<?php

namespace App\Controller;

use App\Entity\Trade;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class FrontPageController extends Controller
{
    public function mainPage()
    {
        return $this->render('main.html.twig');
    }

    public function symbolsStatus()
    {
        $data['60'] = $this->getDoctrine()->getRepository(Trade::class)->findSymbolStatusData('-1 hour');
        $data['30'] = $this->getDoctrine()->getRepository(Trade::class)->findSymbolStatusData('-30 min');
        $data['10'] = $this->getDoctrine()->getRepository(Trade::class)->findSymbolStatusData('-10 min');
        $data['5'] = $this->getDoctrine()->getRepository(Trade::class)->findSymbolStatusData('-5 min');
        return new Response(json_encode($data));
    }
}
