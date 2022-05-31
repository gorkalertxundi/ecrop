package eus.ecrop.ui.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/*
* @author Mikel Orobengoa
* @version 31/05/2022
*/


@Controller
/**
 * A controller that maps the index page.
 */
public class IndexController {

    @Value("${server.api.url}")
    private String apiUrl;

    @GetMapping({"/", "/{view}"})
    public String index(@PathVariable(required = false) String view, Model model) {
        if (view == null) {
            view = "index";
        }
        model.addAttribute("view", view);
        model.addAttribute("apiUrl", apiUrl);
        return "/page/index";
    }

}