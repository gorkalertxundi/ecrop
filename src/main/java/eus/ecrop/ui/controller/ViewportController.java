package eus.ecrop.ui.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/*
* @author Mikel Orobengoa
* @version 10/05/2022
*/

@Controller
@RequestMapping("/view")
public class ViewportController {
    
    @GetMapping("/login")
    public String login() {
        return "page/login";
    }

    @GetMapping("/map")
    public String map() {
        return "page/map";
    }

    @GetMapping("/land-zone")
    public String landZone() {
        return "page/land-zone";
    }

    @GetMapping("/subscriptions")
    public String subscriptions() {
        return "page/subscriptions";
    }

}