<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;

class FrontPageController
{
    public function mainPage()
    {
        $number = mt_rand(0, 100);

        return new Response(
            '<html><body>Lucky number: '.$number.'</body></html>'
        );
    }
}
