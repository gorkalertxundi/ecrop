package eus.ecrop.ui.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/*
* @author Mikel Orobengoa
* @version 27/05/2022
*/

@Controller
public class IndexController {

    @GetMapping({"/", "/{view}"})
    public String index(@PathVariable(required = false) String view, Model model) {
        if (view == null) {
            view = "index";
        }
        model.addAttribute("viewport", view);
        return "/page/index";
    }

}