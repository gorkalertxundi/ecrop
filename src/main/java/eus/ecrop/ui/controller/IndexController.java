package eus.ecrop.ui.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/*
* @author Mikel Orobengoa
* @version 10/05/2022
*/

@Controller
public class IndexController {
    
    @GetMapping("/")
    public String index() {
        return "/page/index";
    }

}