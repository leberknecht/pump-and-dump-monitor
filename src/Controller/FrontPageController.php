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
        $data = $this->getDoctrine()->getRepository(Trade::class)->findSymbolStatusData();
        return new Response(json_encode($data));
    }
}
