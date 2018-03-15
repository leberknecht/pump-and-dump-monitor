<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FrontPageController extends Controller
{
    public function mainPage()
    {
        return $this->render('main.html.twig');
    }
}
